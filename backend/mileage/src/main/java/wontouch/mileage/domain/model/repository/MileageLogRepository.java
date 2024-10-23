package wontouch.mileage.domain.model.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import wontouch.mileage.domain.entity.MileageLog;
import wontouch.mileage.domain.entity.MileageLogType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MileageLogRepository extends MongoRepository<MileageLog, String> {

    boolean existsByUserId(int userId);
    Optional<List<MileageLog>> findByUserId(int userId);
    void deleteByUserId(int userId);
    void deleteByUserIdAndMileageLogTypeAndCreateAtBefore(int userId, MileageLogType mileageLogType, LocalDateTime createAt);
}
