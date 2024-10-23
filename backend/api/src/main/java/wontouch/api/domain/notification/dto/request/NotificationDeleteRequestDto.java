package wontouch.api.domain.notification.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class NotificationDeleteRequestDto {

    @NotNull
    private String id;

    @NotNull
    private int userId;
}
