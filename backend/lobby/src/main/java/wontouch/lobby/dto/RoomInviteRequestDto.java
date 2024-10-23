package wontouch.lobby.dto;

import lombok.Getter;

@Getter
public class RoomInviteRequestDto {

    private long userId;
    private long friendId;
    private String roomId;
}
