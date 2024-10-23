package wontouch.socket.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import wontouch.socket.dto.lobby.ReadyDto;
import wontouch.socket.dto.lobby.ReadyStateDto;

import java.io.IOException;
import java.util.Map;

// 로비 서버로 이동하여 처리하는 로직들을 담는 서비스 레이어
@Service
@Slf4j
public class LobbyServerService {

    private final RestTemplate restTemplate = new RestTemplate();
    @Value("${lobby.server.name}:${lobby.server.path}")
    private String lobbyServerUrl;
    private final WebSocketSessionService sessionService;

    public LobbyServerService(WebSocketSessionService sessionService) {
        this.sessionService = sessionService;
    }

    public ReadyDto sendPreparationInfo(String roomId, String playerId,
                                             Map<String, Object> preparationInfo) {
        String readyUrl = lobbyServerUrl + "/ready/toggle";
        log.debug("readyUrl:{}", readyUrl);
        preparationInfo.put("playerId", playerId);
        preparationInfo.put("roomId", roomId);
        log.debug("preparationInfo:{}", preparationInfo);
        System.out.println("Sending preparation info to Lobby Server: " + preparationInfo);
        ReadyDto state = restTemplate.postForObject(readyUrl, preparationInfo, ReadyDto.class);
        return state;
    }

    public Map<String, Object> kickUser(String roomId, String playerId,
                            Map<String, Object> kickInfo) {
        String kickUrl = lobbyServerUrl + "/ready/kick";
        kickInfo.put("roomId", roomId);
        kickInfo.put("requestUserId", playerId);
        log.debug("kickInfo:{}", kickInfo);
        Boolean isKicked = restTemplate.postForObject(kickUrl, kickInfo, boolean.class);
        return kickLogic(roomId, Boolean.TRUE.equals(isKicked), kickInfo);
    }

    public Map<String, Object> kickLogic(String roomId, boolean isKicked, Map<String, Object> msgMap) {
        String playerId = (String) msgMap.get("playerId");
        Map<String, WebSocketSession> sessions = sessionService.getSessions(roomId);
        if (!isKicked) return null;
        if (sessions != null) {
            for (Map.Entry<String, WebSocketSession> entry : sessions.entrySet()) {
                WebSocketSession session = entry.getValue();
                String sessionPlayerId = (String) session.getAttributes().get("playerId");
                log.debug("session: {}, sessionPlayerId: {}", session.getId(), sessionPlayerId);

                if (playerId.equals(sessionPlayerId)) {
                    try {
                        session.close(CloseStatus.NORMAL);  // 소켓 연결 해제
                    } catch (IOException e) {
                        e.printStackTrace();
                        throw new RuntimeException(e);
                    }
                    sessions.remove(entry.getKey());  // roomSessions에서 세션 삭제
                    msgMap.put("isKicked", true);
                    msgMap.put("message", playerId + " 이 방에서 강퇴되었습니다.");
                    log.debug("Player {} has been kicked from room {}", playerId, roomId);
                    return msgMap;
                }
            }
        }
        msgMap.put("isKicked", false);
        return msgMap;
    }
}
