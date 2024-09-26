package wontouch.api.domain.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import wontouch.api.domain.user.dto.request.AvatarUpdateRequestDto;
import wontouch.api.global.dto.ResponseDto;

@RestController
@RequestMapping("/avatar")
@RequiredArgsConstructor
public class AvatarController {

    @PatchMapping
    public ResponseEntity<?> updateAvatar(@RequestBody AvatarUpdateRequestDto requestDto) {
        // 서비스 내 메서드 호출

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.CREATED.value())
                .message("아바타 수정 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

}
