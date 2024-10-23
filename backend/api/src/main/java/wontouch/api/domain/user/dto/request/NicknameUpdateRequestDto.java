package wontouch.api.domain.user.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class NicknameUpdateRequestDto {

    private int userId;

    @Size(min = 2, max = 30)
    private String nickname;
}
