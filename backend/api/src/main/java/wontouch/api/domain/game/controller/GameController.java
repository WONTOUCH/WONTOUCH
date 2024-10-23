package wontouch.api.domain.game.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/game")
@Slf4j
public class GameController {

    private final RestTemplate restTemplate = new RestTemplate();
    // 게임서버 기본 주소
    @Value("${game.server.name}:${game.server.path}")
    private String gameServerUrl;

    @GetMapping("/crop-list/{roomId}")
    public Object getCropList(@PathVariable String roomId) {
        String targetUrl = gameServerUrl + "/game/crop-list/" + roomId;
        log.debug("targetUrl: {}", targetUrl);
        Object cropList = restTemplate.getForObject(targetUrl, Object.class);
        log.debug("CROP LIST: {}", cropList);
        return cropList;
    }
}
