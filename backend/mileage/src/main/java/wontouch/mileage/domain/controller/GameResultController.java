package wontouch.mileage.domain.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import wontouch.mileage.domain.model.service.GameResultService;
import wontouch.mileage.global.dto.ResponseDto;

import java.util.Map;

@RestController
@RequestMapping("/result")
@RequiredArgsConstructor
@Slf4j
public class GameResultController {

    private final GameResultService gameResultService;

    /**
     * 게임 종료 시 마일리지 및 티어 포인트 한번에 적립
     */
    @PostMapping
    public ResponseEntity<?> earnPoint(@RequestBody Map<String, Map<String, Integer>> requestDtoMap) {
        log.debug("Earning point: {}", requestDtoMap);
        gameResultService.earnPoints(requestDtoMap);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.CREATED.value())
                .message("마일리지 및 티어 포인트 적립 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

}
