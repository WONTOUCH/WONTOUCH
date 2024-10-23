package wontouch.lobby.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import wontouch.lobby.domain.Room;

import java.util.Map;
import java.util.Set;

@Getter
@NoArgsConstructor
public class RoomResponseDto {
    private String roomId;
    private String roomName;
    private long hostId;
    private boolean secret;
    private Map<Object, Object> participants;
    private int maxPlayers;
    private int currentPlayersCount;

    public RoomResponseDto(Room room) {
        this.roomId = room.getRoomId();
        this.roomName = room.getRoomName();
        this.hostId = room.getHostId();
        this.secret = room.isSecret();
        this.participants = room.getParticipants();
        this.maxPlayers = 8;
        this.currentPlayersCount = room.getCurrentPlayersCount();
    }
}
