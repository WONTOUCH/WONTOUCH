package wontouch.game.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class FutureArticle {
    private String title;
    private String body;
    private String author;

    @JsonProperty("change_rate")
    private double changeRate;
    @JsonProperty("spawn_rate")
    private double spawnRate;
    @JsonProperty("sub_crops")
    private List<SubCrop> subCrops;// SubCrop 리스트 추가

    public static FutureArticle fromSpecialArticle(SpecialArticle article) {
        FutureArticle futureArticle = new FutureArticle();
        futureArticle.title = article.getTitle();
        futureArticle.body = article.getBody();
        futureArticle.author = article.getAuthor();
        futureArticle.changeRate = article.getChangeRate();
        return futureArticle;
    }
}
