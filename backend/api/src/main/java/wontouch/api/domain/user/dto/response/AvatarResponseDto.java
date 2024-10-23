package wontouch.api.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvatarResponseDto {

    private int avatarId;
    private String characterName;
    private boolean isEquipped;
}
