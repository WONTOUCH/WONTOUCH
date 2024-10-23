package wontouch.lobby.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomException {

    ROOM_ALREADY_EXISTS_EXCEPTION(409, "ROOM_ALREADY_EXISTS_EXCEPTION", "이미 존재하는 방입니다"),
    NO_AVAILABLE_ROOM_EXCEPTION(409, "NO_AVAILABLE_ROOM_EXCEPTION", "방에 빈자리가 없습니다."),
    ROOM_NOT_FOUND(404, "NOT_FOUNDED_ROOM", "존재하지 않는 방입니다."),
    INVALID_PASSWORD_EXCEPTION(401, "InvalidPasswordException", "비밀번호가 틀렸습니다.");

    private int statusNum;
    private String errorCode;
    private String errorMessage;

}
