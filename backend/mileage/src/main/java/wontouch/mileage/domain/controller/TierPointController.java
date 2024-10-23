package wontouch.mileage.domain.controller;

import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wontouch.mileage.domain.dto.request.TierPointCreateRequestDto;
import wontouch.mileage.domain.dto.response.TierPointResponseDto;
import wontouch.mileage.domain.entity.TierPointLog;
import wontouch.mileage.domain.model.repository.TierPointLogRepository;
import wontouch.mileage.domain.model.service.TierPointService;
import wontouch.mileage.global.dto.ResponseDto;
import wontouch.mileage.global.exception.CustomException;
import wontouch.mileage.global.exception.ExceptionResponse;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjuster;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@RestController
@RequestMapping("/tier")
@RequiredArgsConstructor
public class TierPointController {

    private final TierPointService tierPointService;
    private final TierPointLogRepository tierPointLogRepository;

    // 티어 포인트 적립
    @PostMapping("/create")
    public ResponseEntity<?> createTierPoint(@Valid @RequestBody TierPointCreateRequestDto requestDto) {
        tierPointService.createTierPoint(requestDto);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.CREATED.value())
                .message("티어 포인트 적립 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }
    
    // 티어 포인트 적립 목록 조회
    @GetMapping("/list/{userId}")
    public ResponseEntity<?> getTierPointList(@PathVariable int userId) {
        List<TierPointResponseDto> tierPointResponseDtoList = tierPointService.getTierPointList(userId);

        ResponseDto<Object> responseDto = ResponseDto.<Object>builder()
                .status(HttpStatus.OK.value())
                .message("티어 포인트 적립 목록 조회 성공")
                .data(tierPointResponseDtoList)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 총 티어 포인트 조회 기능
    @GetMapping("/total/{userId}")
    public ResponseEntity<?> getTotalTierPoint(@PathVariable int userId) {
        int totalAmount = tierPointService.getTotalTierPoint(userId);

        ResponseDto<Integer> responseDto = ResponseDto.<Integer>builder()
                .status(HttpStatus.OK.value())
                .message("총 티어 포인트 조회 성공")
                .data(totalAmount)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 월요일 자정 이후 적립된 티어 포인트 조회 기능
    @GetMapping("/total/since-monday/{userId}")
    public ResponseEntity<?> getTotalTierPointSinceMonday(@PathVariable int userId) {
        int totalAmount = tierPointService.getTotalTierPointSinceMonday(userId);

        ResponseDto<Integer> responseDto = ResponseDto.<Integer>builder()
                .status(HttpStatus.OK.value())
                .message("월요일 자정 이후 적립된 총 티어 포인트 조회 성공")
                .data(totalAmount)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 티어 포인트 삭제
    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<?> deleteByUserId(@PathVariable int userId) {
        tierPointService.deleteByUserId(userId);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("티어 포인트 삭제 성공").
                data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

}
