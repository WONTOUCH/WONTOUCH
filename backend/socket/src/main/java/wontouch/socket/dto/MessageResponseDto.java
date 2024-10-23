package wontouch.socket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MessageResponseDto {
    private MessageType type;
    private Object content;
}
