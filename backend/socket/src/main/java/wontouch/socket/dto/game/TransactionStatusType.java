package wontouch.socket.dto.game;

public enum TransactionStatusType {
    SUCCESS,         // 거래 성공
    INSUFFICIENT_GOLDS,  // 골드 부족
    INSUFFICIENT_STOCK,  // 재고 부족
    TRANSACTION_FAILED   // 일반적인 실패
}

