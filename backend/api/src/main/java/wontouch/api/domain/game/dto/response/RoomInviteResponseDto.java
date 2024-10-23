package wontouch.api.domain.game.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomInviteResponseDto {

    private String roomId;
    private String roomName;
    private boolean secret;
    private String password;
}
