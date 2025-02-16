package wontouch.lobby.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ExceptionHandler {
    @org.springframework.web.bind.annotation.ExceptionHandler(ExceptionResponse.class)
    public ResponseEntity<?> handleException(ExceptionResponse e) {
        Map<String, String> errorDetails = new HashMap<>();
        errorDetails.put("errorCode", e.getCustomException().getErrorCode());
        errorDetails.put("errorMessage", e.getCustomException().getErrorMessage());
        return ResponseEntity.status(HttpStatus.valueOf(e.getCustomException().getStatusNum())).body(errorDetails);
    }
}
