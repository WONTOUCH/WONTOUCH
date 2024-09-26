package wontouch.socket.dto.game;

import lombok.Getter;

@Getter
public class CropTransactionDto {
    private String cropId;
    // 마을에 남은 수량
    private int townQuantity;
    // 플레이어에게 남은 수량
    private int playerQuantity;
    // 플레이어에게 남은 돈
    private int playerGold;
}
