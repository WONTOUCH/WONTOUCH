package wontouch.auth.global.util.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import wontouch.auth.global.util.dto.JwtResponseDto;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class JwtProvider {
    private static final long REFRESH_TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000L; // refreshToken 유효기간 7일
    private static final long ACCESS_TOKEN_EXPIRE_TIME = 12 * 60 * 60 * 1000L; // accessToken 유효기간 12시간

    private static final String BEARER_TYPE = "Bearer";

    private final SecretKey secretKey;
    private final RedisTemplate redisTemplate;

    // application.properties 에 있는 평문 secret key 를 가져와 초기화
    public JwtProvider(@Value("${spring.jwt.secret}") String secret, @Qualifier("redisTemplate") RedisTemplate redisTemplate) {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(secret));
        this.redisTemplate = redisTemplate;
    }

    // 토큰 생성 메소드
    public String createToken(int userId) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + ACCESS_TOKEN_EXPIRE_TIME); // 만료기간 6시간

        return Jwts.builder()
                .claim("userId", userId)
                .setIssuedAt(now)
                .setExpiration(expiration)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String createRefreshToken(int userId) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + REFRESH_TOKEN_EXPIRE_TIME); // 만료기간 14일

        return Jwts.builder()
                .claim("userId", userId)
                .setIssuedAt(now)
                .setExpiration(expiration)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // Token 생성 메서드를 하나로 통일
    public JwtResponseDto.TokenInfo generateToken(int userId) {
        long now = (new Date()).getTime();

        // Access Token 생성
        String accessToken = Jwts.builder()
                .claim("userId", userId)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + ACCESS_TOKEN_EXPIRE_TIME))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();

        // Refresh Token 생성
        String refreshToken = Jwts.builder()
                .claim("userId", userId)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + REFRESH_TOKEN_EXPIRE_TIME))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();

        String redisKey = "refresh_token:" + userId;
        redisTemplate.opsForValue().set(redisKey, refreshToken, REFRESH_TOKEN_EXPIRE_TIME, TimeUnit.MILLISECONDS);

        System.out.println(redisTemplate.opsForValue().get(redisKey));

        return JwtResponseDto.TokenInfo.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    // access token 을 통해 claims 얻는 방법
    // 여기에서 get("userId", String.class)를 통해 값 불러올 수 있음
    public Claims parseClaims(String accessToken) {
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

    // 토큰 앞 부분('Bearer') 제거 메소드
    public String BearerRemove(String token) {
        return token.substring("Bearer ".length());
    }

    public Long getExpiration(String accessToken) {
        // accessToken 남은 유효시간
        Date expiration = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(accessToken)
                .getPayload()
                .getExpiration();
        // 현재 시간
        Long now = System.currentTimeMillis();
        return (expiration.getTime() - now);
    }

    public long getAccessTokenExpireTime() {
        return ACCESS_TOKEN_EXPIRE_TIME;
    }
}
