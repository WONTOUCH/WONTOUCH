package wontouch.socket.config;

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
import wontouch.socket.dto.MessageType;
import wontouch.socket.service.SocketServerService;
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
    private final SocketServerService socketServerService;
    private final MessageHandlerFactory messageHandlerFactory;

    public GameWebSocketHandler(WebSocketSessionService sessionService, SocketServerService socketServerService, MessageHandlerFactory messageHandlerFactory) {
        this.sessionService = sessionService;
        this.socketServerService = socketServerService;
        this.messageHandlerFactory = messageHandlerFactory;
    }

    // 연결 시 실행되는 로직
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String roomId = getRoomIdFromSession(session);
        String playerId = getPlayerIdFromQueryParams(session);

        session.getAttributes().put("playerId", playerId);

        // 기존에 접속된 방이 있다면 해당 세션 종료
        if (sessionService.isPlayerInAnotherRoom(roomId, playerId)) {
            log.warn("Player {} is already connected in another room, closing existing session.", playerId);
            sessionService.closeExistingSessionInAnotherRoom(roomId, playerId);  // 기존 세션 종료
        }

        if (sessionService.isPlayerInCurrentRoom(roomId, playerId)) {
            sessionService.closeExistingSessionInCurrentRoom(roomId, playerId);
        }

        // session추가
        sessionService.addSession(roomId, session);

        // client로 접속되었음을 return
        session.sendMessage(new TextMessage("Room ID Created: " + roomId));

        // 입장 메세지 전송
        sessionService.broadcastMessage(roomId, MessageType.NOTIFY, playerId + "이 입장하였습니다.");

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
        log.debug("SESSION CLOSE STATUS: {}", status);

        Map<String, Object> sessionInfo = new ConcurrentHashMap<>();
        sessionInfo.put("roomId", roomId);
        sessionInfo.put("playerId", playerId);
        sessionInfo.put("sessionId", session.getId());

        // session 삭제
        if (!sessionService.isPlayerInCurrentRoom(roomId, playerId)) {
            // session 정보를 게임 서버로 전송
            String gameTargetUrl = gameServerUrl + "/game/session/remove";
            restTemplate.postForObject(gameTargetUrl, sessionInfo, String.class);
        }

        sessionService.removeSession(roomId, session);

        // player의 lock 해제
        socketServerService.removePlayerLock(playerId);

        try {
            // session 정보를 로비 서버로 전송
            String lobbyTargetUrl = lobbyServerUrl + "/api/session/remove";
            restTemplate.postForObject(lobbyTargetUrl, sessionInfo, String.class);

        } catch (Exception e) {
            e.printStackTrace();
        }

        sessionService.broadcastMessage(roomId, MessageType.NOTIFY, playerId + "이 퇴장하였습니다.");
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
        log.debug("HANDLE MESSAGE to {}: {}, {}", session.toString(), messageType.toString(), payload);
        switch (messageType) {
            case CHAT:
                // 채팅 메시지 즉시 브로드캐스트
                msgMap.put("playerId", playerId);
                sessionService.broadcastMessage(roomId, MessageType.CHAT, msgMap);
                break;
            case NOTIFY:
                // 알림 메시지 처리
                sessionService.broadcastMessage(roomId, MessageType.NOTIFY, (String) msgMap.get("content"));
                break;
            case KICK:
                // 강퇴 처리
                content = messageHandlerFactory.handleMessage(roomId, playerId, messageType, msgMap);
                kickMessageCast(roomId, content);
                break;
            case BUY_CROP:
            case SELL_CROP:
            case PLAYER_CROP_LIST:
            case TOWN_CROP_LIST:
            case CROP_CHART:
            case BUY_RANDOM_ARTICLE:
            case BUY_CROP_ARTICLE:
            case ARTICLE_SHOP:
                content = messageHandlerFactory.handleMessage(roomId, playerId ,messageType, msgMap);
                sessionService.unicastMessage(roomId, playerId, messageType, content);
                break;
            case MOVE:
                content = messageHandlerFactory.handleMessage(roomId, playerId, messageType, msgMap);
                break;
            default:
                // 기타 타 서버로 전송되는 메시지 처리
                content = messageHandlerFactory.handleMessage(roomId, playerId, messageType, msgMap);
                sessionService.broadcastMessage(roomId, messageType, content);
                break;
        }
        log.info("Received message from room " + roomId + ": " + messageType);
    }

    private void kickMessageCast(String roomId, Object content) throws IOException {
        if (content instanceof Map){
            Map<String, Object> resultMap = (Map<String, Object>) content;
            boolean isKicked = (Boolean) resultMap.getOrDefault("isKicked", false);
            if (isKicked){
                sessionService.broadcastMessage(roomId, MessageType.NOTIFY, content);
                return;
            }
        }
        sessionService.broadcastMessage(roomId, MessageType.ERROR, null);
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
