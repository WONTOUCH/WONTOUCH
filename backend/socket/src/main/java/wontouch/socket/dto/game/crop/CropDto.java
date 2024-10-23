package wontouch.socket.dto.game.crop;

import lombok.Data;

@Data
public class CropDto {
    private final String id;
    private final String type;
    private final String name;
    private int price;
    private String description;
    private final String imgUrl;
}
