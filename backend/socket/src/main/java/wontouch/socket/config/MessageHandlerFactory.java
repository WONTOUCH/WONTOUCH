package wontouch.socket.config;

import org.springframework.stereotype.Component;
import wontouch.socket.dto.MessageType;
import wontouch.socket.service.GameServerService;
import wontouch.socket.service.LobbyServerService;
import wontouch.socket.service.SocketServerService;

import java.io.IOException;
import java.util.Map;

@Component
public class MessageHandlerFactory {

    private final LobbyServerService lobbyServerService;
    private final GameServerService gameServerService;
    private final SocketServerService socketServerService;

    public MessageHandlerFactory(LobbyServerService lobbyServerService, GameServerService gameServerService, SocketServerService socketServerService) {
        this.lobbyServerService = lobbyServerService;
        this.gameServerService = gameServerService;
        this.socketServerService = socketServerService;
    }

    public Object handleMessage(String roomId, String playerId,
                                       MessageType messageType, Map<String, Object> msgMap) throws IOException {
        switch (messageType) {
            case READY:
                // 로비 서버로 준비 정보 전송
                return lobbyServerService.sendPreparationInfo(roomId, playerId, msgMap);
            case START:
                // TODO 시작하는 로직 구현
                System.out.println("LET's START: " + msgMap);
                break;
            case KICK:
                // 유저 강퇴
                return lobbyServerService.kickUser(roomId, playerId, msgMap);
            case MOVE:
                return socketServerService.moveUser(roomId, playerId, msgMap);
            case BUY_CROP:
                return gameServerService.buyCropRequest(roomId, msgMap);
            case SELL_CROP:
                return gameServerService.sellCropRequest(roomId, msgMap);
            case PLAYER_CROP_LIST:
                return gameServerService.getPlayerCrops(playerId);
            case TOWN_CROP_LIST:
                return gameServerService.getTownCrops(roomId, msgMap);
            case CROP_CHART:
                return gameServerService.getCropChart(roomId, msgMap);
            case ROUND_READY:
                return gameServerService.sendPreparationInfo(roomId, playerId, msgMap);
            case BUY_RANDOM_ARTICLE:
                return gameServerService.buyRandomArticle(roomId, playerId, msgMap);
            case BUY_CROP_ARTICLE:
                return gameServerService.buyArticle(roomId, playerId, msgMap);
            case ARTICLE_SHOP:
                return "거래소에 서버를 거쳐 접근했습니다";
            default:
                System.out.println("Unknown message type: " + messageType);
                return null;
        }
        return null;
    }
}
