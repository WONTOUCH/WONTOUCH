package wontouch.game.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import wontouch.game.entity.FutureArticle;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Data
@AllArgsConstructor
public class RoundResultDto {
    private Map<String, Integer> originPriceMap;
    private Map<String, Integer> newPriceMap;
    private Map<String, FutureArticle> futureArticles;
    private Map<String, Set<Object>> playerArticleMap;
}
