package wontouch.auth.global.util.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class JwtResponseDto {

    @Builder
    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TokenInfo {
        private String accessToken;
        private String refreshToken;
        private boolean isFirstLogin; // 위치 옮겨야할 가능성 큼

        public void updateFirstLogin() {
            isFirstLogin = true;
        }
    }
}
