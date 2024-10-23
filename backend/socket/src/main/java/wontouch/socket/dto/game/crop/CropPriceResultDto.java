package wontouch.socket.dto.game.crop;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

import java.util.Map;

@AllArgsConstructor
@Getter
public class CropPriceResultDto {
    private Map<String, Object> originPriceMap;
    private Map<String, Object> newPriceMap;
}
