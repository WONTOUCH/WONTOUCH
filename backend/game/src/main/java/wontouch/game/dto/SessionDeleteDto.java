package wontouch.game.dto;

import lombok.Data;

@Data
public class SessionDeleteDto {
    private final String roomId;
    private final String playerId;
    private final String sessionId;
}

