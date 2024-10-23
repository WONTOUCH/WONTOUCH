package wontouch.api.domain.rank.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import wontouch.api.domain.rank.dto.response.RankListResponseDto;
import wontouch.api.domain.rank.model.service.RankMonitoringService;
import wontouch.api.global.dto.ResponseDto;

import java.util.List;

@RestController
@RequestMapping("/rank")
@RequiredArgsConstructor
public class RankController {

    private final RankMonitoringService rankMonitoringService;

    /**
     * 상위 랭킹 조회
     * @param size 상위 몇 명의 랭킹을 가져올지 (기본값: 10)
     */
    @GetMapping("/list")
    public ResponseEntity<?> getRankList(@RequestParam(defaultValue = "10") int size) {
        List<RankListResponseDto> rankList = rankMonitoringService.getRankList(size);

        ResponseDto<List<RankListResponseDto>> responseDto = ResponseDto.<List<RankListResponseDto>>builder()
                .status(HttpStatus.OK.value())
                .message("랭킹 리스트 조회 성공")
                .data(rankList)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

}
