package wontouch.mileage.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class MileageSpendRequestDto {

    @NotNull
    private int userId;

    @NotNull
    private int amount;

    @NotBlank
    private String description;
}
