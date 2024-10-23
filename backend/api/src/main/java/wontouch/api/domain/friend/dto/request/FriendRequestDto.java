package wontouch.api.domain.friend.dto.request;

import lombok.Getter;

@Getter
public class FriendRequestDto {

    private int fromUserId;
    private int toUserId;
}
