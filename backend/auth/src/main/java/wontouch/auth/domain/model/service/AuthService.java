package wontouch.auth.domain.model.service;

import com.nimbusds.jose.shaded.gson.Gson;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import wontouch.auth.domain.dto.request.GoogleRequestDto;
import wontouch.auth.domain.dto.request.KakaoLogoutRequestDto;
import wontouch.auth.domain.dto.response.LoginTokenResponseDto;
import wontouch.auth.global.util.dto.JwtResponseDto;
import wontouch.auth.domain.dto.response.KakaoResponseDto;
import wontouch.auth.domain.entity.User;
import wontouch.auth.domain.model.repository.UserRepository;
import wontouch.auth.global.util.jwt.JwtProvider;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final RedisTemplate<String, String> redisTemplate;

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String kakaoClientId;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String kakaoClientSecret;

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String kakaoRedirectUri;


    /**
     * 구글 콜백 메서드
     */
    public JwtResponseDto.TokenInfo googleCallback(GoogleRequestDto requestDto) {

        String email = requestDto.getEmail();
        String username = requestDto.getUsername();
        Optional<User> loginUser = userRepository.findByEmail(email);

        JwtResponseDto.TokenInfo tokenInfo;

        // 회원가입
        if (loginUser.isEmpty()) {
            User googleUser = new User();
            googleUser.createUser(username, email);
            User savedUser = userRepository.save(googleUser);
            tokenInfo = jwtProvider.generateToken(savedUser.getId());
            tokenInfo.updateFirstLogin();

            // 로그인 시 활동 시간 저장
            saveUserActivity(savedUser.getId());

            return tokenInfo;
        } else {    // 기존 회원 로그인
            User user = loginUser.get();
            tokenInfo = jwtProvider.generateToken(user.getId());

            // 로그인 시 활동 시간 저장
            saveUserActivity(user.getId());

            return tokenInfo;
        }
    }

    /**
     * 카카오 콜백 메서드
     */
    public LoginTokenResponseDto kakaoCallback(String kakaoCode) {
        String accessToken = getKakaoToken(kakaoCode);
        KakaoResponseDto kakaoResponseDto = getKakaoUserInfo(accessToken);
        String email = kakaoResponseDto.getEmail();
        String username = kakaoResponseDto.getUsername();
        Optional<User> loginUser = userRepository.findByEmail(email);

        // 회원가입
        if (loginUser.isEmpty()) {
            User kakaoUser = new User();
            kakaoUser.createUser(username, email);
            User savedUser = userRepository.save(kakaoUser);
            JwtResponseDto.TokenInfo tokenInfo = jwtProvider.generateToken(savedUser.getId());
            tokenInfo.updateFirstLogin();

            if (savedUser.getEmail().equals("") || savedUser.getUsername().equals("")) {
                String message = "마이페이지에서 본인의 정보를 알맞게 수정 후 이용해주세요.";
                // 메시지 후처리 필요
            }

            // 로그인 시 활동 시간 저장
            saveUserActivity(savedUser.getId());

            return LoginTokenResponseDto.builder()
                    .kakaoAccessToken(accessToken)
                    .accessToken(tokenInfo.getAccessToken())
                    .isFirstLogin(tokenInfo.isFirstLogin())
                    .build();
        } else { // 기존 회원이 로그인하는 경우
            User user = loginUser.get();
            JwtResponseDto.TokenInfo tokenInfo = jwtProvider.generateToken(user.getId());

            // 로그인 시 활동 시간 저장
            saveUserActivity(user.getId());

            return LoginTokenResponseDto.builder()
                    .kakaoAccessToken(accessToken)
                    .accessToken(tokenInfo.getAccessToken())
                    .isFirstLogin(tokenInfo.isFirstLogin())
                    .build();
        }
    }

    /**
     * 카카오 인가 코드를 통해 토큰 발급받기
     */
    public String getKakaoToken(String kakaoCode) {
        // HttpHeader 생성
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(HttpHeaders.CONTENT_TYPE, "application/x-www-form-urlencoded;charset=utf-8");

        // body 생성
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", kakaoClientId);
        params.add("client_secret", kakaoClientSecret);
        params.add("redirect_uri", kakaoRedirectUri);
        params.add("code", kakaoCode);

        // header + body
        HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(params, httpHeaders);

        System.out.println("kakaoCode: " + kakaoCode);

        // http 요청
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(
                "https://kauth.kakao.com/oauth/token",
                HttpMethod.POST,
                httpEntity,
                String.class
        );

        // response 에서 access token 가져오기
        String responseBody = response.getBody();
        if (responseBody != null) {
            Gson gsonObj = new Gson();
            Map<?, ?> responseMap = gsonObj.fromJson(responseBody, Map.class);
            return (String) responseMap.get("access_token");
        }

        return null;
    }

    /**
     * 카카오 유저의 정보 가져오기
     */
    public KakaoResponseDto getKakaoUserInfo(String accessToken) {
        // HttpHeader 생성
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Authorization", "Bearer " + accessToken);
        httpHeaders.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        // HttpHeader 와 HttpBody 를 하나의 객체에 담기 (body 정보는 생략 가능)
        HttpEntity<String> requestEntity = new HttpEntity<>(httpHeaders);

        // RestTemplate 를 이용하여 HTTP 요청 처리
        RestTemplate restTemplate = new RestTemplate();

        // HTTP 요청을 GET 방식으로 실행하여 멤버 정보를 가져옴
        ResponseEntity<String> responseEntity = restTemplate.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.GET,
                requestEntity,
                String.class
        );

        // 카카오 인증 서버가 반환한 사용자 정보
        String userInfo = responseEntity.getBody();

        // JSON 데이터에서 필요한 정보 추출
        Gson gsonObj = new Gson();
        Map<?, ?> data = gsonObj.fromJson(userInfo, Map.class);

        // 이메일 동의 여부 확인
        boolean emailAgreement = (boolean) ((Map<?, ?>) (data.get("kakao_account"))).get("email_needs_agreement");
        String email;

        if (emailAgreement) {
            email = "";
        } else {
            email = (String) ((Map<?, ?>) (data.get("kakao_account"))).get("email");
        }

        // 이미 존재하는 경우
//        if (userRepository.findByEmail(email))

        // 닉네임 동의 여부 확인
        boolean nickNameAgreement = (boolean) ((Map<?, ?>) (data.get("kakao_account"))).get("profile_nickname_needs_agreement");
        String nickName;
        if (nickNameAgreement) {
            nickName = "";
        } else {
            nickName = (String) ((Map<?, ?>) ((Map<?, ?>) data.get("properties"))).get("nickname");
        }

        return new KakaoResponseDto(email, nickName);
    }

    /**
     * 카카오 로그아웃 처리
     */
    public boolean kakaoLogout(KakaoLogoutRequestDto requestDto) {
        String accessToken = requestDto.getAccessToken();

        try {
            // accessToken에서 userId 추출
            Claims claims = jwtProvider.parseClaims(accessToken);
            int userId = claims.get("userId", Integer.class);
            String redisKey = "refresh_token:" + userId;

            // Redis 에서 해당 유저의 refresh token 조회
            String currentToken = redisTemplate.opsForValue().get(redisKey);
            log.info("현재 Redis에 저장된 refresh token: " + currentToken);

            // Redis에서 해당 유저의 refresh token 삭제
            redisTemplate.delete(redisKey);
            log.info("삭제된 후 Redis에 저장된 refresh token: " + redisTemplate.opsForValue().get(redisKey));

            // 로그아웃 시 활동 기록 삭제
            deleteUserActivity(userId);

            log.info("카카오 로그아웃 성공: userId = " + userId);
            return true;
        } catch (Exception e) {
            log.error("카카오 로그아웃 실패", e);
            return false;
        }
    }

    /**
     * 사용자 활동 저장
     */
    public void saveUserActivity(int userId) {
        // Redis key 설정
        String redisKey = "user_activity:" + userId;

        // 현재 시간을 저장
        String currentTime = LocalDateTime.now().toString();

        // TTL 설정 (6시간)
        long ttl = 6 * 60 * 60;

        // Redis에 현재 시간을 value로 저장 및 TTL 설정
        redisTemplate.opsForValue().set(redisKey, currentTime, ttl, TimeUnit.SECONDS);
    }

    /**
     * 사용자 활동 삭제
     */
    public void deleteUserActivity(int userId) {
        // Redis key 설정
        String redisKey = "user_activity:" + userId;

        // Redis 에서 해당 키 삭제
        boolean isDeleted = redisTemplate.delete(redisKey);

        if (isDeleted) {
            log.info("User activity deleted successfully.");
        } else {
            log.error("Failed to delete user activity.");
        }
    }

}
