package wontouch.mileage.domain.model.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wontouch.mileage.domain.dto.request.TierPointCreateRequestDto;
import wontouch.mileage.domain.dto.response.TierPointResponseDto;
import wontouch.mileage.domain.entity.TierPointLog;
import wontouch.mileage.domain.model.repository.TierPointLogRepository;
import wontouch.mileage.global.exception.CustomException;
import wontouch.mileage.global.exception.ExceptionResponse;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TierPointService {

    private final TierPointLogRepository tierPointLogRepository;

    // 티어 포인트 적립
    @Transactional
    public void createTierPoint(TierPointCreateRequestDto requestDto) {

        TierPointLog tierPointLog = TierPointLog.builder()
                .userId(requestDto.getUserId())
                .amount(requestDto.getAmount())
                .description("게임 완료 보상")
                .createAt(LocalDateTime.now())
                .build();

        tierPointLogRepository.save(tierPointLog);
    }

    // 티어 포인트 적립 목록 조회
    public List<TierPointResponseDto> getTierPointList(int userId) {
        List<TierPointLog> tierPointLogList = tierPointLogRepository.findByUserId(userId)
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_TIER_POINT_LOG_EXCEPTION));

        List<TierPointResponseDto> responseDtoList = tierPointLogList.stream()
                .map(tierPointLog -> TierPointResponseDto.builder()
                        .amount(tierPointLog.getAmount())
                        .description(tierPointLog.getDescription())
                        .createAt(tierPointLog.getCreateAt().toString())
                        .build())
                .toList();

        return responseDtoList;
    }

    // 총 티어 포인트 조회 기능
    public int getTotalTierPoint(int userId) {
        if (!tierPointLogRepository.existsByUserId(userId))
            return 0;

        List<TierPointLog> tierPointLogList = tierPointLogRepository.findByUserId(userId)
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_TIER_POINT_LOG_EXCEPTION));

        return tierPointLogList.stream()
                .mapToInt(log -> log.getAmount())
                .sum();
    }

    // 월요일 자정 이후 적립된 티어 포인트 조회 기능
    public int getTotalTierPointSinceMonday(int userId) {
        if (!tierPointLogRepository.existsByUserId(userId))
            return 0;

        // 월요일 자정의 날짜를 가져온 후, 그 이후 적립된 티어 포인트를 필터링
        LocalDateTime mondayMidnight = LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).atStartOfDay();

        List<TierPointLog> tierPointLogList = tierPointLogRepository.findByUserIdAndCreateAtAfter(userId, mondayMidnight)
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_TIER_POINT_LOG_EXCEPTION));

        return tierPointLogList.stream()
                .mapToInt(log -> log.getAmount())
                .sum();
    }

    // 티어 포인트 삭제
    @Transactional
    public void deleteByUserId(int userId) {
        tierPointLogRepository.deleteByUserId(userId);
    }
}
