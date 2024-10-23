package wontouch.lobby.dto.ready;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReadyDto {
    private List<ReadyStateDto> readyStateList;
    private boolean isAllReady;
}
