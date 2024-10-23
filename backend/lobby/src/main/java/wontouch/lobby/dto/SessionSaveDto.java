package wontouch.lobby.dto;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class SessionSaveDto {
    private final String roomId;
    private final String sessionId;
}
