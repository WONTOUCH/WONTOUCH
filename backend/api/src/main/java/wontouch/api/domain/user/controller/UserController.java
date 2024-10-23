package wontouch.api.domain.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wontouch.api.domain.user.dto.request.UserSearchRequestDto;
import wontouch.api.domain.user.dto.response.GameHistoryResponseDto;
import wontouch.api.domain.user.dto.response.UserResponseDto;
import wontouch.api.domain.user.dto.response.UserSearchResponseDto;
import wontouch.api.domain.user.model.service.UserService;
import wontouch.api.global.dto.ResponseDto;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 사용자 정보 조회 기능
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserInfo(@PathVariable int userId) {
        // service에서 사용자 정보 불러오기
        UserResponseDto userResponseDto = userService.getUserInfo(userId);
        
        ResponseDto<Object> responseDto = ResponseDto.<Object>builder()
                .status(HttpStatus.OK.value())
                .message("사용자 정보 조회 성공")
                .data(userResponseDto)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 닉네임을 통한 사용자 검색 기능
    @PostMapping("/search")
    public ResponseEntity<?> getUserByNickname(@RequestBody UserSearchRequestDto requestDto) {
        // 서비스 내 메서드 호출
        UserSearchResponseDto searchResponseDto = userService.getUserByNickname(requestDto);
        
        ResponseDto<Object> responseDto = ResponseDto.<Object>builder()
                .status(HttpStatus.OK.value())
                .message("사용자 닉네임 검색 성공")
                .data(searchResponseDto)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @GetMapping("/game-history/{userId}")
    public ResponseEntity<?> getGameHistoryList(@PathVariable int userId) {
        List<GameHistoryResponseDto> gameHistoryList = userService.getGameHistoryList(userId);

        ResponseDto<Object> responseDto;
        if (gameHistoryList == null || gameHistoryList.isEmpty()) {
            responseDto = ResponseDto.<Object>builder()
                    .status(HttpStatus.OK.value())
                    .message("게임 전적 없음")
                    .data(null)
                    .build();

            return new ResponseEntity<>(responseDto, HttpStatus.OK);
        } else {
            responseDto = ResponseDto.<Object>builder()
                    .status(HttpStatus.OK.value())
                    .message("게임 전적 조회 성공")
                    .data(gameHistoryList)
                    .build();

            return new ResponseEntity<>(responseDto, HttpStatus.OK);
        }
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable int userId) {
        userService.deleteByUserId(userId);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("사용자 탈퇴 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

}
