package wontouch.api.domain.notification.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameInviteNotificationDto {

    private int senderId;
    private String senderNickname;
    private String roomId;
    private String roomName;
    private String password;
}
