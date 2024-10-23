package wontouch.auth.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginTokenResponseDto {

    private String kakaoAccessToken;
    private String accessToken;
    private boolean isFirstLogin;

    public void updateFirstLogin() {
        isFirstLogin = true;
    }
}
