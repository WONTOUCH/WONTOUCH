package wontouch.api.domain.friend.entity;

import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Builder
@Document(collection = "friend_request")
public class FriendRequest {

    @Id
    private String id;

    private int fromUserId;

    private int toUserId;

    private LocalDateTime createAt;
}
