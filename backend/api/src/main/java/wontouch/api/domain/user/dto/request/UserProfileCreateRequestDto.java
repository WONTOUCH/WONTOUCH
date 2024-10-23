package wontouch.api.domain.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileCreateRequestDto {

    private int userId;

    @NotBlank(message = "닉네임은 필수 입력 사항 입니다.")
    @Size(min = 2, max = 30)
    private String nickname;
}
