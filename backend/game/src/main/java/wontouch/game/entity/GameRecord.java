package wontouch.game.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "games")
public class GameRecord {

    @Id
    private String gameId;
    private LocalDateTime gameDate;
    private List<PlayerStats> playerStats;
}
