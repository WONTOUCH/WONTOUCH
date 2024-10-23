package wontouch.lobby.dto;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class CreateRoomRequestDto {
    private String roomId;
    private String roomName;
    private long hostPlayerId;
    private boolean secret;
    private String password;
}
