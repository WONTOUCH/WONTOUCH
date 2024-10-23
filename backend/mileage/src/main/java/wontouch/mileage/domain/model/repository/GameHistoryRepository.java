package wontouch.mileage.domain.model.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import wontouch.mileage.domain.entity.GameHistory;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameHistoryRepository extends MongoRepository<GameHistory, String> {

    List<GameHistory> findByUserId(int userId);
}
