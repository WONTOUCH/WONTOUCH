package wontouch.lobby.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wontouch.lobby.dto.ReadyStateDto;
import wontouch.lobby.dto.ResponseDto;
import wontouch.lobby.service.ReadyService;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/ready")
@Slf4j
public class ReadyController {

    private final ReadyService readyService;

    @Autowired
    public ReadyController(ReadyService readyService) {
        this.readyService = readyService;
    }

    @PostMapping("/toggle")
    public ReadyStateDto ready(@RequestBody Map<String, Object> preparationInfo) {
        System.out.println(preparationInfo);
        ReadyStateDto state = readyService.updateReadyState(preparationInfo);
        log.debug("ready: {}", state);
        return state;
    }

    @PostMapping("/kick")
    public boolean kick(@RequestBody Map<String, Object> kickInfo) {
        log.debug("kick: {}", kickInfo);
        return readyService.kickUser(kickInfo);
    }

    //TODO 시작 시 로비 redis 내의 정보를 삭제할지 결정하고 삭제
    @GetMapping("/start/{roomId}")
    public ResponseEntity<ResponseDto<?>> startGame(@PathVariable String roomId) {
        try {
            Set<String> players = readyService.startGameIfAllReady(roomId);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseDto<>(HttpStatus.OK.value(), "게임에 참여할 플레이어가 반환되었습니다.", players));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDto<>(400, e.getMessage(), null));
        }
    }
}
