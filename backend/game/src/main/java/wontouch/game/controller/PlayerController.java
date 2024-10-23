package wontouch.game.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import wontouch.game.service.game.GameService;
import wontouch.game.service.PlayerService;
import wontouch.game.service.game.TimerService;

import java.util.Map;

@RestController
@RequestMapping("/player")
@Slf4j
public class PlayerController {

    private final GameService gameService;
    private final PlayerService playerService;
    private final TimerService timerService;

    @Autowired
    public PlayerController(GameService gameService, PlayerService playerService, TimerService timerService) {
        this.gameService = gameService;
        this.playerService = playerService;
        this.timerService = timerService;
    }


//    @PostMapping("/init/{roomId}")
//    public void initPlayers(@PathVariable String roomId, @RequestBody List<Player> players) {
//        log.debug("players:{}", players.toString());
//        gameService.initPlayers(roomId, players);
//        timerService.startNewRound(roomId);
//    }

    // 플레이어의 보유 작물 조회
    @GetMapping("/crop/list/{playerId}")
    public Map<Object, Object> getCropList(@PathVariable int playerId) {
        return playerService.getAllCropsByPlayer(playerId);
    }
}
