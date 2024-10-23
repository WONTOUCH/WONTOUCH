package wontouch.lobby.dto;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class RoomRequestDto {
    private long playerId;
    private String roomId;
    private String password;
}
