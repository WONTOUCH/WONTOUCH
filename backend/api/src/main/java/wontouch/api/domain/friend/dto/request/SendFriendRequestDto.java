package wontouch.api.domain.friend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class SendFriendRequestDto {

    @NotNull
    private int fromUserId;

    @NotNull
    private int toUserId;
}
