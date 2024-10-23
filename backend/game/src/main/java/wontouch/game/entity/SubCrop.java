package wontouch.game.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class SubCrop {
    private String id;
    private String name;
    @JsonProperty("change_rate")
    private double changeRate;
}
