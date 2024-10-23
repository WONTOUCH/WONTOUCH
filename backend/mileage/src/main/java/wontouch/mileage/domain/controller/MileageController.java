package wontouch.mileage.domain.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wontouch.mileage.domain.dto.request.MileageCreateRequestDto;
import wontouch.mileage.domain.dto.request.MileageSpendRequestDto;
import wontouch.mileage.domain.dto.response.MileageResponseDto;
import wontouch.mileage.domain.model.service.MileageService;
import wontouch.mileage.global.dto.ResponseDto;

import java.util.List;

@RestController
@RequestMapping("/log")
@RequiredArgsConstructor
public class MileageController {

    private final MileageService mileageService;

    // 마일리지 적립
    @PostMapping("/create")
    public ResponseEntity<?> createMileage(@Valid @RequestBody MileageCreateRequestDto requestDto) {
        mileageService.createMileage(requestDto);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.CREATED.value())
                .message("마일리지 적립 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    // 마일리지 적립 목록 조회
    @GetMapping("/list/{userId}")
    public ResponseEntity<?> getMileageLogList(@PathVariable int userId) {
        List<MileageResponseDto> mileageResponseDtoList = mileageService.getMileageLogList(userId);

        ResponseDto<Object> responseDto = ResponseDto.<Object>builder()
                .status(HttpStatus.OK.value())
                .message("마일리지 적립 목록 조회 성공")
                .data(mileageResponseDtoList)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 총 마일리지 조회
    @GetMapping("/total/{userId}")
    public ResponseEntity<?> getTotalAmount(@PathVariable int userId) {
        int totalAmount = mileageService.getTotalMileageByUserId(userId);

        ResponseDto<Integer> responseDto = ResponseDto.<Integer>builder()
                .status(HttpStatus.OK.value())
                .message("총 마일리지 조회 성공")
                .data(totalAmount)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 마일리지 사용
    @PostMapping("/spend")
    public ResponseEntity<?> spendMileage(@Valid @RequestBody MileageSpendRequestDto requestDto) {
        mileageService.spendMileage(requestDto);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.CREATED.value())
                .message("마일리지 사용 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    // 오래된 마일리지 로그 삭제
    @DeleteMapping("/delete/old/{userId}")
    public ResponseEntity<?> deleteOldEarnMileageLogs(@PathVariable int userId) {
        mileageService.deleteOldEarnMileageLogs(userId);
        
        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("오래된 마일리지 로그 삭제 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<?> deleteByUserId(@PathVariable int userId) {
        mileageService.deleteByUserId(userId);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("마일리지 삭제 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

}
