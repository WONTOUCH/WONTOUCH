package wontouch.api.domain.notification.entity;

import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Builder
@Document(collection = "notification")
public class Notification {

    @Id
    private String id;

    private Long receiverId;

    private String sender;

    private LocalDateTime createAt;

    private String content;

    private String roomId;

    private String roomName;

    private String password;

    private NotificationType notificationType;
}
