package wontouch.game.dto.town;

import lombok.Data;

// 작물 거래 이후 업데이트 사항 전송
@Data
public class CropTransactionResponseDto {
    // 작물 이름
    private String cropId;
    // 마을 이름
    private String town;
    // 마을에 남은 수량
    private int townQuantity;
    // 플레이어에게 남은 수량
    private int playerQuantity;
    // 플레이어에게 남은 돈
    private int playerGold;
}
