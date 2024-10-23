package wontouch.mileage.domain.model.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import wontouch.mileage.domain.entity.TierPointLog;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TierPointLogRepository extends MongoRepository<TierPointLog, String> {

    boolean existsByUserId(int userId);
    Optional<List<TierPointLog>> findByUserId(int userId);
    Optional<List<TierPointLog>> findByUserIdAndCreateAtAfter(int userId, LocalDateTime date);
    void deleteByUserId(int userId);
}
