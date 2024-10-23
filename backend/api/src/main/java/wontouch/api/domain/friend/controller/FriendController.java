package wontouch.api.domain.friend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wontouch.api.domain.friend.dto.request.FriendDeleteRequestDto;
import wontouch.api.domain.friend.dto.request.FriendRequestActionDto;
import wontouch.api.domain.friend.dto.request.FriendRequestDto;
import wontouch.api.domain.friend.dto.request.SendFriendRequestDto;
import wontouch.api.domain.friend.dto.response.FriendResponseDto;
import wontouch.api.domain.friend.dto.response.ReceiveFriendRequestDto;
import wontouch.api.domain.friend.model.service.FriendService;
import wontouch.api.global.dto.ResponseDto;

import java.util.List;

@RestController
@RequestMapping("/friend")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;

    // 친구 목록 조회
    @GetMapping("/{userId}")
    public ResponseEntity<?> getFriendList(@PathVariable int userId) {
        List<FriendResponseDto> friendResponseDtoList = friendService.getFriendList(userId);

        ResponseDto<Object> responseDto = ResponseDto.<Object>builder()
                .status(HttpStatus.OK.value())
                .message("친구 목록 조회 성공")
                .data(friendResponseDtoList)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 온라인인 친구 목록 조회
    @GetMapping("/online/{userId}")
    public ResponseEntity<?> getOnlineFriendList(@PathVariable int userId) {
        List<FriendResponseDto> friendResponseDtoList = friendService.getOnlineFriendList(userId);

        ResponseDto<Object> responseDto = ResponseDto.<Object>builder()
                .status(HttpStatus.OK.value())
                .message("온라인인 친구 목록 조회 성공")
                .data(friendResponseDtoList)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 친구 신청
    @PostMapping("/request")
    public ResponseEntity<?> sendFriendRequest(@RequestBody SendFriendRequestDto requestDto) {
        friendService.sendFriendRequest(requestDto);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.CREATED.value())
                .message("친구 신청 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    // 친구 신청 목록 조회
    @GetMapping("/request-list/{userId}")
    public ResponseEntity<?> getFriendRequestList(@PathVariable int userId) {
        List<ReceiveFriendRequestDto> receiveRequestList = friendService.getFriendRequestList(userId);

        ResponseDto<Object> responseDto = ResponseDto.<Object>builder()
                .status(HttpStatus.OK.value())
                .message("친구 신청 목록 조회 성공")
                .data(receiveRequestList)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 친구 신청 상세 조회
    @GetMapping("/request/detail")
    public ResponseEntity<?> getFriendRequestDetail(@RequestParam int fromUserId, @RequestParam int toUserId) {
        ReceiveFriendRequestDto receiveFriendRequestDto = friendService.getFriendRequest(fromUserId, toUserId);

        ResponseDto<Object> responseDto = ResponseDto.<Object>builder()
                .status(HttpStatus.OK.value())
                .message("친구 신청 상세 조회 성공")
                .data(receiveFriendRequestDto)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 친구 신청 승인
    @PostMapping("/request-accept")
    public ResponseEntity<?> acceptRequest(@RequestBody FriendRequestActionDto requestDto) {
        friendService.acceptRequest(requestDto);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.CREATED.value())
                .message("친구 신청 승인 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    // 친구 신청 거절
    @DeleteMapping("/request-reject")
    public ResponseEntity<?> rejectRequest(@RequestBody FriendRequestActionDto requestDto) {
        friendService.rejectRequest(requestDto);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("친구 신청 거절 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 친구 끊기
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteFriend(@RequestBody FriendDeleteRequestDto requestDto) {
        friendService.deleteFriend(requestDto);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("친구 끊기 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

}
