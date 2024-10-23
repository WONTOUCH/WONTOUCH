package wontouch.lobby.dto.ready;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReadyStateDto {
    private long playerId;
    private boolean isReady;
}
