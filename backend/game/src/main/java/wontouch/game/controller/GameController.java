package wontouch.game.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import wontouch.game.domain.Player;
import wontouch.game.dto.SessionDeleteDto;
import wontouch.game.entity.Crop;
import wontouch.game.repository.crop.CropRedisRepository;
import wontouch.game.repository.crop.CropRepository;
import wontouch.game.service.ArticleService;
import wontouch.game.service.CropService;
import wontouch.game.service.PlayerService;
import wontouch.game.service.game.GameService;
import wontouch.game.service.game.TimerService;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/game")
@Slf4j
public class GameController {

    private final CropRepository cropRepository;
    private final CropRedisRepository cropRedisRepository;
    private final PlayerService playerService;
    @Value("${socket.server.name}:${socket.server.path}")
    private String socketServerUrl;

    private final GameService gameService;
    private final TimerService timerService;
    private final CropService cropService;
    private final ArticleService articleService;
    private final RestTemplate restTemplate = new RestTemplate();

    public GameController(GameService gameService, TimerService timerService,
                          CropService cropService, ArticleService articleService, CropRepository cropRepository, CropRedisRepository cropRedisRepository, PlayerService playerService) {
        this.gameService = gameService;
        this.timerService = timerService;
        this.cropService = cropService;
        this.articleService = articleService;
        this.cropRepository = cropRepository;
        this.cropRedisRepository = cropRedisRepository;
        this.playerService = playerService;
    }

    // 게임 시작 시에 기본 정보 세팅
    @PostMapping("/init/{roomId}")
    public List<Crop> initGame(@PathVariable String roomId, @RequestBody List<Player> players) {
        log.debug("players:{}", players.toString());
        // 플레이어 정보 세팅
        gameService.initPlayers(roomId, players);
        // 작물 정보 세팅
        List<Crop> cropList = cropService.loadRandomCropsFromEachTypeToRedis(roomId);
        gameService.initPlayersCrops(players, cropList);
        gameService.initCropsForRoundZero(roomId, cropList);
        String targetUrl = socketServerUrl + "/game/crop-list";
        Map<String, Object> cropListResponse = new ConcurrentHashMap<>();
        cropListResponse.put("roomId", roomId);
        cropListResponse.put("cropList", cropList);
        restTemplate.postForObject(targetUrl, cropListResponse, String.class);

        // 게임 시작
        articleService.saveNewArticlesForRound(roomId, 2);
        timerService.startNewRound(roomId);
        return cropList;
    }

    // 라운드 종료 후 다음 라운드 준비
    @PostMapping("/ready/{roomId}")
    public Map<String, Object> readyForNextRound(@PathVariable String roomId, @RequestBody Map<String, Object> readyInfo) {
        String playerId = (String) readyInfo.get("playerId");
        Map<String, Object> readyInfoResponse = timerService.playerReady(roomId, playerId);
        log.debug("readyInfoResponse:{}", readyInfoResponse.toString());
        return readyInfoResponse;
    }

    // 작물 정보 조회
    @GetMapping("/crop-list/{roomId}")
    public List<Crop> getDefaultCropList(@PathVariable String roomId) {
        List<Crop> defaultCropInfo = cropService.getDefaultCropInfo(roomId);
        log.debug("defaultCropInfo:{}", defaultCropInfo.toString());
        return defaultCropInfo;
    }

    @PostMapping("/session/remove")
    public void removeSessionFromGame(@RequestBody SessionDeleteDto session) {
        log.debug("session:{}", session.toString());
        try {
            playerService.removePlayerInfo(session);
        } catch (Exception e) {
            log.error("test");
            e.printStackTrace();
        }
    }
}
