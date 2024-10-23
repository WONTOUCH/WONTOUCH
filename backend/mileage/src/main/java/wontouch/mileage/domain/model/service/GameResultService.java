package wontouch.mileage.domain.model.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wontouch.mileage.domain.dto.request.MileageCreateRequestDto;
import wontouch.mileage.domain.dto.request.TierPointCreateRequestDto;
import wontouch.mileage.global.exception.CustomException;
import wontouch.mileage.global.exception.ExceptionResponse;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class GameResultService {

    private final MileageService mileageService;
    private final TierPointService tierPointService;
    private final GameHistoryService gameHistoryService;

    public void earnPoints(Map<String, Map<String, Integer>> resultTable) {

        for (Map.Entry<String, Map<String, Integer>> entry : resultTable.entrySet()) {
            String userIdValue = entry.getKey();
            int userId;
            try {
                userId = Integer.parseInt(userIdValue);
            } catch (NumberFormatException e) {
                throw new ExceptionResponse(CustomException.NUMBER_FORMAT_EXCEPTION);
            }
            Map<String, Integer> userStats = entry.getValue();

            int mileage = userStats.getOrDefault("mileage", 0);
            int tierPoint = userStats.getOrDefault("tierPoint", 0);
            int rank = userStats.getOrDefault("rank", -1);
            int totalGold = userStats.getOrDefault("totalGold", 0);

            MileageCreateRequestDto mileageDto = MileageCreateRequestDto.builder()
                    .userId(userId)
                    .amount(mileage)
                    .build();
            mileageService.createMileage(mileageDto);

            TierPointCreateRequestDto tierPointDto = TierPointCreateRequestDto.builder()
                    .userId(userId)
                    .amount(tierPoint)
                    .build();
            tierPointService.createTierPoint(tierPointDto);

            // 게임 전적 생성
            gameHistoryService.createGameHistory(userId, rank, totalGold);
        }
    }
}
