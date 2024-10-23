package wontouch.game.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import wontouch.game.entity.GameRecord;

import java.util.List;

@Repository
public interface GameRecordRepository extends MongoRepository<GameRecord, String> {
    List<GameRecord> findByPlayerStatsPlayerId(String playerId);
}
