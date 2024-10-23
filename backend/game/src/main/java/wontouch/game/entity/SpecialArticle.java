package wontouch.game.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class SpecialArticle {
    @Id
    private String id;
    private String crop;
    private String title;
    private String body;
    private String author;
    @JsonProperty("change_rate")
    private double changeRate;
}
