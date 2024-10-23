package wontouch.lobby.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameInviteRequestDto {

    private long senderId;
    private long receiverId;
    private String roomId;
    private String roomName;
    private String password;
}
