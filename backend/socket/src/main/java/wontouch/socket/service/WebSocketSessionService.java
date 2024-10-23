package wontouch.socket.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import wontouch.socket.dto.MessageResponseDto;
import wontouch.socket.dto.MessageType;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class WebSocketSessionService {
    // 소켓 세션과 메세지 전송을 전담하는 서비스 레이어
    private final Map<String, ConcurrentHashMap<String, WebSocketSession>> roomSessions = new ConcurrentHashMap<>();
    private final Map<String, String> playerIdToRoomId = new ConcurrentHashMap<>(); // playerId -> roomId
    private final ObjectMapper mapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${lobby.server.name}:${lobby.server.path}")
    private String lobbyServerUrl;

    @Value("${game.server.name}:${game.server.path}")
    private String gameServerUrl;

    public void addSession(String roomId, WebSocketSession session) {
        log.debug("Adding session to room: {}", roomId);
        roomSessions.putIfAbsent(roomId, new ConcurrentHashMap<>());
        roomSessions.get(roomId).put(session.getId(), session);

        // playerId와 roomId 매핑 추가
        String playerId = (String) session.getAttributes().get("playerId");
        playerIdToRoomId.put(playerId, roomId);
        log.debug("Current sessions in room {}: {}", roomId, roomSessions.get(roomId).size());
    }

    public void removeSession(String roomId, WebSocketSession session) {
        log.debug("Removing session from room: {}", roomId);
        if (roomSessions.containsKey(roomId)) {
            roomSessions.get(roomId).remove(session.getId());

            // 해당 playerId의 방 정보 제거
            String playerId = (String) session.getAttributes().get("playerId");
            playerIdToRoomId.remove(playerId);

            if (roomSessions.get(roomId).isEmpty()) {
                roomSessions.remove(roomId);
            }
        }
        log.debug("Remaining sessions in room {}: {}", roomId, roomSessions.containsKey(roomId) ? roomSessions.get(roomId).size() : 0);
    }

    public boolean isPlayerInAnotherRoom(String currentRoomId, String playerId) {
        String roomId = playerIdToRoomId.get(playerId);
        return roomId != null && !roomId.equals(currentRoomId);
    }

    public boolean isPlayerInCurrentRoom(String currentRoomId, String playerId) {
        String roomId = playerIdToRoomId.get(playerId);
        return roomId != null && roomId.equals(currentRoomId);
    }

    public Map<String, WebSocketSession> getSessions(String roomId) {
        return roomSessions.getOrDefault(roomId, new ConcurrentHashMap<>());
    }

    public boolean roomExists(String roomId) {
        return roomSessions.containsKey(roomId);
    }


    @Async
    public synchronized void sendMessageToSession(WebSocketSession session, MessageType messageType, Object content) throws IOException {
        if (session.isOpen()) {
            session.sendMessage(new TextMessage(mapper.writeValueAsString(new MessageResponseDto(messageType, content))));
        }
    }

    @Async
    public synchronized void broadcastMessage(String roomId, MessageType messageType, Object content) throws IOException {
        log.debug("MessageBroadCast");
        Map<String, WebSocketSession> sessions = getSessions(roomId);
        for (WebSocketSession session : sessions.values()) {
            sendMessageToSession(session, messageType, content);
        }
    }

    // 메세지 유니캐스트
    @Async
    public void unicastMessage(String roomId, String playerId, MessageType messageType, Object content) throws IOException {
        log.debug("MessageUnicast");
        Map<String, WebSocketSession> roomSessions = getSessions(roomId);
        for (WebSocketSession session : roomSessions.values()) {
            // 세션에 저장된 플레이어 ID와 비교하여 특정 플레이어에게만 전송
            String sessionPlayerId = (String) session.getAttributes().get("playerId");

            if (playerId.equals(sessionPlayerId)) {
                // 해당 플레이어에게만 메시지를 전송

                session.sendMessage(new TextMessage(mapper.writeValueAsString(new MessageResponseDto(messageType, content))));
                log.debug("Message sent to playerId {} session: {}, in room {}", playerId, session.toString(), roomId);
                break;  // 특정 플레이어에게만 전송 후 루프 종료
            }
        }
    }

    public void closeExistingSessionInCurrentRoom(String roomId, String playerId) {
        String existingRoomId = playerIdToRoomId.get(playerId);
        Map<String, WebSocketSession> sessions = roomSessions.get(roomId);
        // 해당 playerId와 일치하는 세션을 찾음
        if (sessions != null) {
            for (WebSocketSession session : sessions.values()) {
                String sessionPlayerId = (String) session.getAttributes().get("playerId");

                // 동일한 playerId로 연결된 세션을 찾아서 종료
                if (playerId.equals(sessionPlayerId)) {
                    try {
                        // 기존 세션 종료
                        //session.close();
                        log.info("닫아버리기 Player {}'s existing session in current room {} closed", playerId, roomId);
                        // 세션 목록에서 제거
                        removeSession(roomId, session);
                        break;  // 동일한 플레이어의 세션을 찾았으므로 루프 종료
                    } catch (Exception e) {
                        log.error("Error while closing session for player {}: {}", playerId, e.getMessage());
                    }
                }
            }
        }
    }


    // 연결되어 있는 session 닫기
    public void closeExistingSessionInAnotherRoom(String roomId, String playerId) {
        // playerId가 연결된 방을 찾음
        String existingRoomId = playerIdToRoomId.get(playerId);

        if (existingRoomId != null) {
            // 해당 방에 있는 세션들을 가져옴
            Map<String, WebSocketSession> sessions = roomSessions.get(existingRoomId);

            // 해당 playerId와 연결된 세션을 찾음
            if (sessions != null) {
                for (WebSocketSession session : sessions.values()) {
                    String sessionPlayerId = (String) session.getAttributes().get("playerId");

                    // 동일한 playerId로 연결된 세션을 찾아서 종료
                    if (playerId.equals(sessionPlayerId)) {
                        try {
                            log.info("한 곳에만 있거라 Player {}'s existing session in room {} closed", playerId, existingRoomId);

                            // 해당 세션을 방에서 제거
                            removeSession(existingRoomId, session);

                            // 해당 정보 제거
                            try {
                                // session 정보를 로비 서버로 전송
                                Map<String, Object> sessionInfo = new ConcurrentHashMap<>();
                                // session 정보를 게임 서버로 전송
                                String gameTargetUrl = gameServerUrl + "/game/session/remove";
                                restTemplate.postForObject(gameTargetUrl, sessionInfo, String.class);
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                            break;
                        } catch (Exception e) {
                            log.error("Error while closing session for player {}: {}", playerId, e.getMessage());
                        }
                    }
                }
            }
        }
    }

}
