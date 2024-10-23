package wontouch.api.domain.game.dto.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@ToString
public class CreateRoomRequestDto {
    private final String roomId;
    private String roomName;
    private final long hostPlayerId;

    @Setter
    private boolean secret;
    private String password;

    public CreateRoomRequestDto(String roomId, String roomName,
                                long hostPlayerId, boolean secret,
                                String password) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.hostPlayerId = hostPlayerId;
        this.secret = secret;
        this.password = password;
    }
}
