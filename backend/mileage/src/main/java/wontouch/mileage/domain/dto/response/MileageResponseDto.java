package wontouch.mileage.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MileageResponseDto {

    private int amount;
    private String description;
    private int totalMileage;
    private String createAt;
    private String mileageLogType;
}
