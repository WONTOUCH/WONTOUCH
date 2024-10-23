package wontouch.auth.domain.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wontouch.auth.domain.dto.UserDto;
import wontouch.auth.domain.model.service.UserService;
import wontouch.auth.global.util.dto.ResponseDto;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 사용자 정보 불러오기
    @GetMapping
    public ResponseEntity<?> getUserInfo(String accessToken) {
        UserDto userDto = userService.getUserDto(accessToken);

        ResponseDto<Object> responseDto = ResponseDto.<Object>builder()
                .status(HttpStatus.OK.value())
                .message("사용자 정보 조회 성공")
                .data(userDto)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 사용자 이메일 조회
    @GetMapping("/email/{userId}")
    public ResponseEntity<?> getUserEmail(@PathVariable int userId) {
        String userEmail = userService.getUserEmail(userId);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("사용자 이메일 조회 성공")
                .data(userEmail)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 회원 탈퇴
    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<?> deleteKakaoUser(@PathVariable int userId) {
        userService.deleteUser(userId);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("회원 탈퇴 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
}
