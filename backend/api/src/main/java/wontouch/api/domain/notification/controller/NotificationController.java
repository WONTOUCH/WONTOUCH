package wontouch.api.domain.notification.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import wontouch.api.domain.notification.dto.request.NotificationDeleteRequestDto;
import wontouch.api.domain.notification.dto.response.GameInviteNotificationDto;
import wontouch.api.domain.notification.dto.response.NotificationListResponseDto;
import wontouch.api.domain.notification.model.service.NotificationService;
import wontouch.api.global.dto.ResponseDto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    public static Map<Long, SseEmitter> sseEmitters = new HashMap<>();

    // 클라이언트가 SSE 연결을 요청할 때 사용하는 엔드포인트
    @GetMapping(value = "/subscribe/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subsribe(@PathVariable Long userId) {
        SseEmitter sseEmitter = notificationService.subscribe(userId);

        return sseEmitter;
    }

    // 친구 신청 알림 전송
    @PostMapping("/friend-request")
    public void sendFriendRequestNofication(@RequestParam String receiverNickname, @RequestBody int senderId) {
        notificationService.notifyFriendRequest(receiverNickname, senderId);
    }

    // 알림 목록 조회 기능
    @GetMapping("/list/{userId}")
    public ResponseEntity<?> getNotificationList(@PathVariable Long userId) {
        List<NotificationListResponseDto> notifications = notificationService.getNotificationList(userId);

        ResponseDto<Object> responseDto;
        if (notifications == null || notifications.isEmpty()) {
            responseDto = ResponseDto.<Object>builder()
                    .status(HttpStatus.OK.value())
                    .message("알림 없음")
                    .data(null)
                    .build();

            return new ResponseEntity<>(responseDto, HttpStatus.OK);
        } else {
            responseDto= ResponseDto.<Object>builder()
                    .status(HttpStatus.OK.value())
                    .message("알림 목록 조회 성공")
                    .data(notifications)
                    .build();

            return new ResponseEntity<>(responseDto, HttpStatus.OK);
        }
    }

    // 알림 삭제 기능
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteNotification(@Valid @RequestBody NotificationDeleteRequestDto requestDto) {
        notificationService.deleteNotification(requestDto);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("알림 삭제 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getNotificationDetail(@PathVariable String id) {
        GameInviteNotificationDto notificationDto = notificationService.getGameInviteNotification(id);

        ResponseDto<Object> responseDto = ResponseDto.<Object>builder()
                .status(HttpStatus.OK.value())
                .message("알림 조회 성공")
                .data(notificationDto)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

}
