package wontouch.lobby.domain;

import lombok.*;

import java.util.Map;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Room {
    private String roomId;
    private String roomName;
    private boolean secret;
    private String password;
    private long hostId;
    private Map<Object, Object> participants;
    private int currentPlayersCount;
}
