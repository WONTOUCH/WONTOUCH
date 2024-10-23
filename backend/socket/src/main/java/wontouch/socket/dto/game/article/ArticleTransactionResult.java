package wontouch.socket.dto.game.article;

import lombok.AllArgsConstructor;
import lombok.Data;
import wontouch.socket.dto.game.TransactionStatusType;
import wontouch.socket.dto.game.crop.CropTransactionDto;

@Data
@AllArgsConstructor
public class ArticleTransactionResult {
    private TransactionStatusType type;        // 거래 상태
    private ArticleDto info;    // 거래 정보
}
