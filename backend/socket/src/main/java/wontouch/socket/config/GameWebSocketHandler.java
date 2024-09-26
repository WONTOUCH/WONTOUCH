package wontouch.socket.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponentsBuilder;
import wontouch.socket.dto.MessageResponseDto;
import wontouch.socket.dto.MessageType;
import wontouch.socket.service.WebSocketSessionService;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

// 웹소켓 핸들러
// 소켓으로 보내지는 데이터는 이곳을 모두 거침
@Slf4j
@Component
public class GameWebSocketHandler extends TextWebSocketHandler {

    @Value("${lobby.server.name}:${lobby.server.path}")
    private String lobbyServerUrl;

    @Value("${game.server.name}:${game.server.path}")
    private String gameServerUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();
    private final WebSocketSessionService sessionService;
    private final MessageHandlerFactory messageHandlerFactory;

    public GameWebSocketHandler(WebSocketSessionService sessionService, MessageHandlerFactory messageHandlerFactory) {
        this.sessionService = sessionService;
        this.messageHandlerFactory = messageHandlerFactory;
    }

    // 연결 시 실행되는 로직
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String roomId = getRoomIdFromSession(session);
        String playerId = getPlayerIdFromQueryParams(session);

        session.getAttributes().put("playerId", playerId);

        // session추가
        sessionService.addSession(roomId, session);

        // client로 접속되었음을 return
        session.sendMessage(new TextMessage("Room ID Created: " + roomId));

        // 입장 메세지 전송
        broadcastMessage(roomId, MessageType.NOTIFY, playerId + "이 입장하였습니다.");

        // session 정보를 로비 서버로 전송
        String sessionUrl = lobbyServerUrl + "/api/session/save";
        Map<String, Object> sessionInfo = new ConcurrentHashMap<>();
        sessionInfo.put("roomId", roomId);
        sessionInfo.put("sessionId", session.getId());
        restTemplate.postForObject(sessionUrl, sessionInfo, String.class);

        log.debug("Session " + session.getId() + " joined room " + roomId);
    }

    // 연결 종료 시 실행되는 로직
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String roomId = getRoomIdFromSession(session);
        String playerId = (String) session.getAttributes().get("playerId");

        // session 삭제
        sessionService.removeSession(roomId, session);

        broadcastMessage(roomId, MessageType.NOTIFY, playerId + "이 퇴장하였습니다.");
        log.debug("Session " + session.getId() + " left room " + roomId);
    }

    // 모든 메세지 처리 핸들링
    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String roomId = getRoomIdFromSession(session);
        String payload = message.getPayload();
        String playerId = (String) session.getAttributes().get("playerId");
        Map<String, Object> msgMap = WebSocketMessageParser.parseMessage(payload);
        Object content = null;
        MessageType messageType = MessageType.valueOf((String) msgMap.get("type"));
        log.debug(messageType.toString());
        switch (messageType) {
            case CHAT:
                // 채팅 메시지 즉시 브로드캐스트
                msgMap.put("playerId", playerId);
                broadcastMessage(roomId, MessageType.CHAT, msgMap);
                break;
            case NOTIFY:
                // 알림 메시지 처리
                broadcastMessage(roomId, MessageType.NOTIFY, (String) msgMap.get("content"));
                break;
            case KICK:
                // 강퇴 처리
                content = messageHandlerFactory.handleMessage(roomId, messageType, msgMap);
                kickUser(roomId, (Boolean) content, msgMap);
                break;
            case MOVE:
                broadcastMessage(roomId, MessageType.MOVE, (String) msgMap.get("content"));
            case BUY:
                content = messageHandlerFactory.handleMessage(roomId, messageType, msgMap);
                unicastMessage(roomId, playerId, messageType, content);
                break;
            default:
                // 기타 타 서버로 전송되는 메시지 처리
                content = messageHandlerFactory.handleMessage(roomId, messageType, msgMap);
                broadcastMessage(roomId, messageType, content);
                break;
        }
        log.info("Received message from room " + roomId + ": " + messageType);
    }

    // 메세지 브로드캐스트
    private void broadcastMessage(String roomId, MessageType messageType, Object content) throws IOException {
        log.debug("MessageBroadCast");
        Map<String, WebSocketSession> roomSessions = sessionService.getSessions(roomId);
        for (WebSocketSession session : roomSessions.values()) {
            session.sendMessage(new TextMessage(mapper.writeValueAsString(new MessageResponseDto(messageType, content))));
        }
    }

    // 메세지 유니캐스트
    private void unicastMessage(String roomId, String playerId, MessageType messageType, Object content) throws IOException {
        log.debug("MessageUnicast");
        Map<String, WebSocketSession> roomSessions = sessionService.getSessions(roomId);

        for (WebSocketSession session : roomSessions.values()) {
            // 세션에 저장된 플레이어 ID와 비교하여 특정 플레이어에게만 전송
            String sessionPlayerId = (String) session.getAttributes().get("playerId");

            if (playerId.equals(sessionPlayerId)) {
                // 해당 플레이어에게만 메시지를 전송

                session.sendMessage(new TextMessage(mapper.writeValueAsString(new MessageResponseDto(messageType, content))));
                log.debug("Message sent to playerId {} in room {}", playerId, roomId);
                break;  // 특정 플레이어에게만 전송 후 루프 종료
            }
        }
    }

    // 유저 강퇴
    public void kickUser(String roomId, boolean isKicked, Map<String, Object> msgMap) throws IOException {
        String playerId = (String) msgMap.get("playerId");
        Map<String, WebSocketSession> sessions = sessionService.getSessions(roomId);
        if (!isKicked) return;
        if (sessions != null) {
            for (Map.Entry<String, WebSocketSession> entry : sessions.entrySet()) {
                WebSocketSession session = entry.getValue();
                String sessionPlayerId = (String) session.getAttributes().get("playerId");
                log.debug("session: {}, sessionPlayerId: {}", session.getId(), sessionPlayerId);

                if (playerId.equals(sessionPlayerId)) {
                    session.close(CloseStatus.NORMAL);  // 소켓 연결 해제
                    sessions.remove(entry.getKey());  // roomSessions에서 세션 삭제
                    msgMap.put("message", playerId + " 이 방에서 강퇴되었습니다.");
                    broadcastMessage(roomId, MessageType.NOTIFY, msgMap);
                    log.debug("Player {} has been kicked from room {}", playerId, roomId);
                    break;
                }
            }
        }
    }


    private String getRoomIdFromSession(WebSocketSession session) {
        return Objects.requireNonNull(session.getUri()).getPath().split("/")[4];
    }

    private String getPlayerIdFromQueryParams(WebSocketSession session) {
        String query = session.getUri().getQuery();
        Map<String, String> queryParams = UriComponentsBuilder.fromUriString("?" + query).build().
                getQueryParams().toSingleValueMap();
        return queryParams.get("playerId");
    }
}
