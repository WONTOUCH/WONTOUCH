package wontouch.game.dto;

import lombok.Data;
import wontouch.game.domain.Player;

import java.util.Set;

@Data
public class PlayerInitializeDto {
    private final Set<Player> players;
}
