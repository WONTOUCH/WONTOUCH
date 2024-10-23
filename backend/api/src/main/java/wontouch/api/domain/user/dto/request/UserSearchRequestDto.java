package wontouch.api.domain.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class UserSearchRequestDto {

    @NotNull
    private int userId;

    @NotBlank
    private String nickname;
}
