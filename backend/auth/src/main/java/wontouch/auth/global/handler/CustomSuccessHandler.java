package wontouch.auth.global.handler;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import wontouch.auth.global.util.dto.JwtResponseDto;
import wontouch.auth.domain.entity.User;
import wontouch.auth.global.util.jwt.JwtProvider;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        User user = (User) authentication.getPrincipal();
        JwtResponseDto.TokenInfo tokenInfo = jwtProvider.generateToken(user.getId());

        // 토큰을 헤더 또는 쿠키에 저장
        response.addHeader("Authorization", "Bearer " + tokenInfo.getAccessToken());
        Cookie jwtCookie = new Cookie("jwt", tokenInfo.getAccessToken());
        jwtCookie.setHttpOnly(true);
        jwtCookie.setMaxAge((int) jwtProvider.getAccessTokenExpireTime() / 1000);
        jwtCookie.setPath("/");
        response.addCookie(jwtCookie);

        response.sendRedirect("/"); // 로그인 후 리다이렉션할 경로
    }

}
