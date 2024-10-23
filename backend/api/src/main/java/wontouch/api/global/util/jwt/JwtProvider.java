package wontouch.api.global.util.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

@Slf4j
@Component
public class JwtProvider {
    private static final long REFRESH_TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000L; // refreshToken 유효기간 7일
    private static final long ACCESS_TOKEN_EXPIRE_TIME = 12 * 60 * 60 * 1000L; // accessToken 유효기간 12시간

    private static final String BEARER_TYPE = "Bearer";

    private final SecretKey secretKey;

    // application.properties 에 있는 평문 secret key 를 가져와 초기화
    public JwtProvider(@Value("${spring.jwt.secret}") String secret) {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(secret));
    }

    // access token 을 통해 claims 얻는 방법
    // 여기에서 get("userId", String.class)를 통해 값 불러올 수 있음
    private Claims parseClaims(String accessToken) {
        try {
            return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(accessToken).getPayload();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    // JWT 토큰을 복호화하여 토큰에 들어있는 정보를 꺼내는 메서드
    public Integer getAuthentication(String accessToken) {
        // 토큰 복호화
        Claims claims = parseClaims(accessToken);

        String userId = claims.get("userId").toString();

        return Integer.valueOf(userId);

    }

    // 토큰 정보를 검증하는 메서드
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey) // secretKey를 설정
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.info("Invalid JWT Token", e);
        } catch (ExpiredJwtException e) {
            log.info("Expired JWT Token", e);
        } catch (UnsupportedJwtException e) {
            log.info("Unsupported JWT Token", e);
        } catch (IllegalArgumentException e) {
            log.info("JWT claims string is empty.", e);
        }
        return false;
    }

}
