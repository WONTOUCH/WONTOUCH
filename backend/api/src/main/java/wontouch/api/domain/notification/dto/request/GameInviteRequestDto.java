package wontouch.api.domain.notification.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameInviteRequestDto {

    @NotNull
    private long senderId;

    @NotNull
    private long receiverId;

    @NotNull
    private String roomId;

    private String roomName;

    private String password;
}
