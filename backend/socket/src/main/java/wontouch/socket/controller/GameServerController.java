package wontouch.socket.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import wontouch.socket.dto.MessageType;
import wontouch.socket.dto.game.crop.CropPriceResultDto;
import wontouch.socket.service.WebSocketSessionService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller()
@RequestMapping("/game")
@Slf4j
public class GameServerController {

    private final WebSocketSessionService sessionService;
    private final ObjectMapper mapper = new ObjectMapper();
    private final WebSocketSessionService webSocketSessionService;

    public GameServerController(WebSocketSessionService sessionService, WebSocketSessionService webSocketSessionService) {
        this.sessionService = sessionService;
        this.webSocketSessionService = webSocketSessionService;
    }

    @PostMapping("/round-start")
    public ResponseEntity<?> roundStart(@RequestBody Map<String, Object> messageData) {
        String roomId = (String) messageData.get("roomId");
        log.debug("START TIMER!!: {}", messageData);
        try {
            sessionService.broadcastMessage(roomId, MessageType.ROUND_START, messageData);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok("Timer started successfully");
    }

    @PostMapping("/round-end")
    public ResponseEntity<?> roundEnd(@RequestBody Map<String, Object> messageData) {
        String roomId = (String) messageData.get("roomId");
        log.debug("END TIMER!!: {}", messageData);
        try {
            sessionService.broadcastMessage(roomId, MessageType.ROUND_END, "Timer ended successfully");
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok("Timer ended successfully");
    }

    @PostMapping("/round-result/{roomId}")
    public ResponseEntity<?> roundResult(@PathVariable String roomId, @RequestBody Map<String, Object> messageData) throws IOException {
        log.debug("roomId: {}", roomId);
        log.debug(messageData.toString());
        Map<String, List<Object>> playerArticleMap = (Map<String, List<Object>>) messageData.get("playerArticleMap");
        Map<String, Object> futureArticleMap = (Map<String, Object>) messageData.get("futureArticles");
        for (String playerId : playerArticleMap.keySet()) {
            List<Object> articleIds = playerArticleMap.get(playerId);
            List<Object> futureArticles = new ArrayList<>();
            for (Object articleId : articleIds) {
                Object futureArticle = futureArticleMap.get(articleId.toString());
                futureArticles.add(futureArticle);
            }
            try {
                log.debug("futureArticles size: {}", futureArticles.size());
                webSocketSessionService.unicastMessage(roomId, playerId, MessageType.ARTICLE_RESULT, futureArticles);
            } catch (IOException e) {
                log.error(e.getMessage());
            }
        }

        CropPriceResultDto cropPriceResultDto = new CropPriceResultDto(
                (Map<String, Object>) messageData.get("originPriceMap"),
                (Map<String, Object>) messageData.get("newPriceMap"));

        webSocketSessionService.broadcastMessage(roomId, MessageType.ROUND_RESULT,
                cropPriceResultDto);
        return null;
    }

    @PostMapping("/preparation-start")
    public ResponseEntity<?> preparationStart(@RequestBody Map<String, Object> messageData) {

        String roomId = (String) messageData.get("roomId");
        log.debug("START PREPARATION!!: {}", messageData);
        try {
            sessionService.broadcastMessage(roomId, MessageType.PREPARATION_START, messageData);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok("preparation started successfully");
    }

    @PostMapping("/crop-list")
    public ResponseEntity<?> cropList(@RequestBody Map<String, Object> messageData) {
        String roomId = (String) messageData.get("roomId");
        log.debug("작물 정보를 불러오기 위한 roomId", roomId);
        //log.debug("CROP LIST!!: {}", messageData);
        try {
            sessionService.broadcastMessage(roomId, MessageType.CROP_LIST, messageData);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok("Timer ended successfully");
    }

    @PostMapping("/game-result")
    public ResponseEntity<?> getGameResult(@RequestBody Map<String, Object> messageData) {
        String roomId = (String) messageData.get("roomId");
        log.debug("GAME RESULT!!: {}", messageData);
        try {
            sessionService.broadcastMessage(roomId, MessageType.GAME_RESULT, messageData);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok("Game ended successfully");
    }
}
