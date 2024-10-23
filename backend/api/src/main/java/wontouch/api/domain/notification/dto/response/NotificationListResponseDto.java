package wontouch.api.domain.notification.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationListResponseDto {

    private String id;
    private int senderId;
    private String senderNickname;
    private String createAt;
    private String content;
    private String notificationType;
}
