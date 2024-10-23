package wontouch.mileage.domain.entity;

import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Builder
@Document(collection = "game_history")
public class GameHistory {

    @Id
    private String id;

    private int userId;

    private int rank;

    private int totalGold;

    private LocalDateTime createAt;
}
