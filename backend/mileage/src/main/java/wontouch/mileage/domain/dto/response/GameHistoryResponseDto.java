package wontouch.mileage.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameHistoryResponseDto {

    private int rank;
    private int totalGold;
    private String createAt;
}
