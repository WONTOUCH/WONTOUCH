package wontouch.mileage.domain.model.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wontouch.mileage.domain.dto.response.GameHistoryResponseDto;
import wontouch.mileage.domain.entity.GameHistory;
import wontouch.mileage.domain.model.repository.GameHistoryRepository;
import wontouch.mileage.global.exception.CustomException;
import wontouch.mileage.global.exception.ExceptionResponse;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GameHistoryService {

    private final GameHistoryRepository gameHistoryRepository;

    // 게임 전적 생성
    @Transactional
    public GameHistory createGameHistory(int userId, int rank, int totalGold) {

        GameHistory gameHistory = GameHistory.builder()
                .userId(userId)
                .rank(rank)
                .totalGold(totalGold)
                .createAt(LocalDateTime.now())
                .build();

        return gameHistoryRepository.save(gameHistory);
    }

    // 게임 전적 목록 조회
    public List<GameHistoryResponseDto> getGameHistoryList(int userId) {
        List<GameHistory> gameHistoryList = gameHistoryRepository.findByUserId(userId);

        if (gameHistoryList == null || gameHistoryList.isEmpty())
            return null;

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        List<GameHistoryResponseDto> responseDtoList = gameHistoryList.stream()
                .map(gameHistory -> GameHistoryResponseDto.builder()
                        .rank(gameHistory.getRank())
                        .totalGold(gameHistory.getTotalGold())
                        .createAt(gameHistory.getCreateAt().format(formatter))
                        .build())
                .toList();

        return responseDtoList;
    }

}
