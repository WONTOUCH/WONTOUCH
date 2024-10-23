package wontouch.api.domain.friend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class FriendDeleteRequestDto {

    @NotNull
    private int userId;

    @NotNull
    private int friendId;
}
