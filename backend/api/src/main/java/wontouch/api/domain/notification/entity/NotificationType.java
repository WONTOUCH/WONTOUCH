package wontouch.api.domain.notification.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum NotificationType {

    FRIEND_REQUEST("친구 신청"),
    FRIEND_ACCEPT("친구 수락"),
    GAME_INVITE("게임 초대")
    ;

    private String description;
}
