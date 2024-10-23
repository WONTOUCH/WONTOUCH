package wontouch.socket.dto.lobby;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CreateRoomRequest {
    private String roomId;
    private String roomName;
    private long hostPlayerId;
    private boolean isPrivate;
    private String password;
}
