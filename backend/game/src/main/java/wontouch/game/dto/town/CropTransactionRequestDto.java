package wontouch.game.dto.town;

import lombok.Data;
import wontouch.game.domain.Action;

@Data
public class CropTransactionRequestDto {
    private String cropId;
    private String cropName;
    private int quantity;
    private Action action;
    private long playerId;
}
