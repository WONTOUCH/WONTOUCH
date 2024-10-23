package wontouch.api.domain.user.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wontouch.api.domain.user.entity.UserProfile;
import wontouch.api.domain.user.dto.request.DescriptionUpdateRequestDto;
import wontouch.api.domain.user.dto.request.NicknameCheckRequestDto;
import wontouch.api.domain.user.dto.request.NicknameUpdateRequestDto;
import wontouch.api.domain.user.dto.request.UserProfileCreateRequestDto;
import wontouch.api.domain.user.model.repository.UserProfileRepository;
import wontouch.api.domain.user.model.service.AvatarService;
import wontouch.api.domain.user.model.service.UserProfileService;
import wontouch.api.global.dto.ResponseDto;
// 원터치 화이팅
@RestController
@RequestMapping("/user-profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final AvatarService avatarService;
    private final UserProfileRepository userProfileRepository;

    // 회원가입 시 기본 프로필 설정
    @PostMapping("/join")
    public ResponseEntity<?> createUserProfile(@Valid @RequestBody UserProfileCreateRequestDto createDto) {
        UserProfile createProfile = userProfileService.createUserProfile(createDto);
        avatarService.setInitialAvatar(createProfile.getUserId());

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.CREATED.value())
                .message("회원가입 프로필 설정 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    // 닉네임 중복 확인
    @PostMapping("/nickname/duplicate-check")
    public ResponseEntity<?> checkNickname(@Valid @RequestBody NicknameCheckRequestDto requestDto) {
        boolean result = userProfileRepository.existsByNickname(requestDto.getNickname());

        ResponseDto<Boolean> responseDto;
        if (result) {
            responseDto = ResponseDto.<Boolean>builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message("이미 사용 중인 닉네임입니다.")
                    .data(true)
                    .build();
        } else {
            responseDto = ResponseDto.<Boolean>builder()
                    .status(HttpStatus.OK.value())
                    .message("사용 가능한 닉네임입니다.")
                    .data(false)
                    .build();
        }

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 닉네임 수정
    @PatchMapping("/nickname/update")
    public ResponseEntity<?> updateNickname(@Valid @RequestBody NicknameUpdateRequestDto requestDto) {
        userProfileService.updateNickname(requestDto);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.CREATED.value())
                .message("닉네임 수정 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 한줄소개 수정
    @PatchMapping("/description")
    public ResponseEntity<?> updateDescription(@Valid @RequestBody DescriptionUpdateRequestDto requestDto) {
        userProfileService.updateDescription(requestDto);
        
        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.CREATED.value())
                .message("한줄소개 수정 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

}
