package wontouch.api.domain.game.dto.request;

import lombok.Data;

@Data
public class RoomRequestDto {
    private long playerId;
    private String password;
}
