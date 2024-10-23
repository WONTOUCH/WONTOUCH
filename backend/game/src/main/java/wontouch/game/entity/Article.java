package wontouch.game.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.List;

@Data
public class Article {
    @Id
    private String id;
    private String crop;
    private String aspect;
    private String title;
    private String body;
    private String author; ;

    @JsonProperty("future_articles")
    private List<FutureArticle> futureArticles;
}
