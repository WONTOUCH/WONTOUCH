package wontouch.api.domain.rank.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class RankListResponseDto {

    private int userId;
    private int rank;
    private String nickname;
    private int tierPoint;

    public void setRank(int rank) {
        this.rank = rank;
    }
}
