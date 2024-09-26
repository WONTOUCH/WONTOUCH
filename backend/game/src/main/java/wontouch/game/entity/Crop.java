package wontouch.game.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "crop")
@Data
public class Crop {

    @Id
    private final String id;
    private final String type;
    private final String name;
    private int price;
    private String description;
    private final String imgUrl;
}
