package wontouch.api.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchResponseDto {

    private int tierPoint;
    private int friendId;
    private String nickname;
    private String characterName;
    private boolean isFriend;
}
