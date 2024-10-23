package wontouch.mileage.domain.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import wontouch.mileage.domain.dto.response.GameHistoryResponseDto;
import wontouch.mileage.domain.model.service.GameHistoryService;
import wontouch.mileage.global.dto.ResponseDto;

import java.util.List;

@RestController
@RequestMapping("/game-history")
@RequiredArgsConstructor
public class GameHistoryController {

    private final GameHistoryService gameHistoryService;

    // 게임 전적 조회 기능
    @GetMapping("/list/{userId}")
    public ResponseEntity<?> getGameHistoryList(@PathVariable int userId) {
        List<GameHistoryResponseDto> gameHistoryList = gameHistoryService.getGameHistoryList(userId);

        ResponseDto<Object> responseDto;
        if (gameHistoryList == null || gameHistoryList.isEmpty()) {
            responseDto = ResponseDto.<Object>builder()
                    .status(HttpStatus.OK.value())
                    .message("게임 전적 없음")
                    .data(null)
                    .build();

            return new ResponseEntity<>(responseDto, HttpStatus.OK);
        } else {
            responseDto = ResponseDto.<Object>builder()
                    .status(HttpStatus.OK.value())
                    .message("게임 전적 조회 성공")
                    .data(gameHistoryList)
                    .build();

            return new ResponseEntity<>(responseDto, HttpStatus.OK);
        }
    }
    
}
