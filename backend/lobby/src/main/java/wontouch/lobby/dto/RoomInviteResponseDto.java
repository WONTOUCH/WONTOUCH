package wontouch.lobby.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import wontouch.lobby.domain.Room;

@Getter
@NoArgsConstructor
public class RoomInviteResponseDto {

    private String roomId;
    private String roomName;
    private boolean secret;
    private String password;

    public RoomInviteResponseDto(Room room) {
        this.roomId = room.getRoomId();
        this.roomName = room.getRoomName();
        this.secret = room.isSecret();
        this.password = room.getPassword();
    }
}
