package wontouch.api.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvatarListResponseDto {

    private String characterName;
    private String description;
    private int price;
    private boolean isOwned;
    private boolean isEquipped;
}
