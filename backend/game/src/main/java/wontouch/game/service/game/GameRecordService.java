package wontouch.game.service.game;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wontouch.game.entity.GameRecord;
import wontouch.game.repository.GameRecordRepository;

import java.util.List;

@Service
public class GameRecordService {

    private final GameRecordRepository gameRecordRepository;

    @Autowired
    public GameRecordService(GameRecordRepository gameRecordRepository) {
        this.gameRecordRepository = gameRecordRepository;
    }

    // 플레이어의 전적 조회
    public List<GameRecord> getPlayerGameRecords(String playerId) {
        return gameRecordRepository.findByPlayerStatsPlayerId(playerId);
    }

    // 게임 기록 저장
    public GameRecord saveGameRecord(GameRecord gameRecord) {
        return gameRecordRepository.save(gameRecord);
    }
}
