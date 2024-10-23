package wontouch.mileage.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TierPointResponseDto {

    private int amount;
    private String description;
    private String createAt;
}
