package wontouch.socket.dto.lobby;

import lombok.Data;

import java.util.List;

@Data
public class ReadyDto {
    private List<ReadyStateDto> readyStateList;
    private boolean isAllReady;
}
