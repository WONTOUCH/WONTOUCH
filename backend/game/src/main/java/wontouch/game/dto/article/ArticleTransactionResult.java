package wontouch.game.dto.article;

import lombok.AllArgsConstructor;
import lombok.Data;
import wontouch.game.domain.Action;
import wontouch.game.dto.TransactionStatusType;
import wontouch.game.entity.Article;

@AllArgsConstructor
@Data
public class ArticleTransactionResult {
    private TransactionStatusType type;
    private Article info;
    private String town;
    private int playerGold;
}
