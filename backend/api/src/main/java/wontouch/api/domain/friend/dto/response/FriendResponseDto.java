package wontouch.api.domain.friend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendResponseDto {

    private int friendId;
    private String nickname;
    private String description;
    private String characterName;
    private int tierPoint;
    private boolean isOnline;
}
