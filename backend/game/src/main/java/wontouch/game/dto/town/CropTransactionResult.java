package wontouch.game.dto.town;

import lombok.AllArgsConstructor;
import lombok.Data;
import wontouch.game.dto.TransactionStatusType;

@Data
@AllArgsConstructor
public class CropTransactionResult {
    private TransactionStatusType type;        // 거래 상태
    private CropTransactionResponseDto info;    // 거래 정보
}
