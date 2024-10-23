package wontouch.auth.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomException {

    // 400
    NOT_FOUND_USER_EXCEPTION(400, "NotFoundUserException", "유저가 존재하지 않습니다.")

    ;

    private int statusNum;
    private String errorCode;
    private String errorMessage;
}
