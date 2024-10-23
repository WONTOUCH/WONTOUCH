package wontouch.auth.domain.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wontouch.auth.domain.dto.request.GoogleRequestDto;
import wontouch.auth.domain.dto.request.KakaoLogoutRequestDto;
import wontouch.auth.domain.dto.request.KakaoRequestDto;
import wontouch.auth.domain.dto.response.LoginTokenResponseDto;
import wontouch.auth.global.util.dto.JwtResponseDto;
import wontouch.auth.domain.model.service.AuthService;
import wontouch.auth.global.util.dto.ResponseDto;

@RestController
@RequestMapping("/oauth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    // 구글 소셜 로그인
    @GetMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleRequestDto requestDto) {
        JwtResponseDto.TokenInfo tokenInfo = authService.googleCallback(requestDto);

        ResponseDto<Object> responseDto = ResponseDto.<Object>builder()
                .status(HttpStatus.OK.value())
                .message("구글 소셜 로그인")
                .data(tokenInfo)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 카카오 소셜 로그인
    @PostMapping("/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestBody KakaoRequestDto requestDto) {

        LoginTokenResponseDto tokenInfo = authService.kakaoCallback(requestDto.getCode());

        ResponseDto<Object> responseDto = ResponseDto.<Object>builder()
                .status(HttpStatus.OK.value())
                .message("카카오 소셜 로그인")
                .data(tokenInfo)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 카카오 로그아웃
    @PostMapping("/kakao/logout")
    public ResponseEntity<?> kakaoLogout(@RequestBody KakaoLogoutRequestDto requestDto) {
        authService.kakaoLogout(requestDto);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("카카오 로그아웃 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 사용자 활동 기록 삭제
    @DeleteMapping("/activity/delete/{userId}")
    public ResponseEntity<?> deleteUserActivity(@PathVariable int userId) {
        authService.deleteUserActivity(userId);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("사용자 활동 기록 삭제 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

}
