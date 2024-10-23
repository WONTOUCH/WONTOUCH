package wontouch.api.domain.user.dto.request;

import lombok.Getter;

@Getter
public class AvatarUpdateRequestDto {

    private int userId;
    private String characterName;
}
