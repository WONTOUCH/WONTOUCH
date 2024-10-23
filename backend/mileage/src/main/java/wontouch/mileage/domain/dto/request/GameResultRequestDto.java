package wontouch.mileage.domain.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class GameResultRequestDto {

    @NotNull
    private int userId;

    @NotNull
    private int mileage;

    @NotNull
    private int tierPoint;
}
