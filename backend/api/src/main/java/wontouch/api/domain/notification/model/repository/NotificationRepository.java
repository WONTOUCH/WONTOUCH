package wontouch.api.domain.notification.model.repository;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import wontouch.api.domain.notification.entity.Notification;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    Optional<Notification> findById(String id);
    List<Notification> findByReceiverId(Long receiverId);
    List<Notification> findByCreateAtBefore(LocalDateTime dateTime, PageRequest pageRequest);
    void deleteById(String id);
}
