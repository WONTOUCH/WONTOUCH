package wontouch.socket.dto.game.crop;

import lombok.AllArgsConstructor;
import lombok.Data;
import wontouch.socket.dto.game.TransactionStatusType;

@Data
@AllArgsConstructor
public class CropTransactionResult {
    private TransactionStatusType type;        // 거래 상태
    private CropTransactionDto info;    // 거래 정보
}
