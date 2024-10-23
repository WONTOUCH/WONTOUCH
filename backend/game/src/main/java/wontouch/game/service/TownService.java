package wontouch.game.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import wontouch.game.dto.TransactionStatusType;
import wontouch.game.dto.town.CropTransactionRequestDto;
import wontouch.game.dto.town.CropTransactionResponseDto;
import wontouch.game.dto.town.CropTransactionResult;
import wontouch.game.repository.crop.CropRedisRepository;
import wontouch.game.repository.crop.CropRepository;
import wontouch.game.repository.player.PlayerRepository;

@Service
@Slf4j
public class TownService {

    private final PlayerRepository playerRepository;
    private final CropRepository cropRepository;
    private final CropRedisRepository cropRedisRepository;

    public TownService(PlayerRepository playerRepository, CropRepository cropRepository, CropRedisRepository cropRedisRepository) {
        this.playerRepository = playerRepository;
        this.cropRepository = cropRepository;
        this.cropRedisRepository = cropRedisRepository;
    }

    // 플레이어가 특정 작물을 구매
    // TODO Redisson Lock을 사용할지 결정
    public synchronized CropTransactionResult buyCrop(String roomId, CropTransactionRequestDto cropTransactionRequestDto) {
        String cropId = cropTransactionRequestDto.getCropId();
        String playerId = String.valueOf(cropTransactionRequestDto.getPlayerId());

        // 1. 플레이어의 보유 골드와 작물의 가격 및 상점에 남은 수량 가져오기
        Integer gold = playerRepository.getPlayerGold(playerId);
        Integer price = cropRedisRepository.getCropPrice(roomId, cropId);
        Integer availableQuantity = cropRedisRepository.getCropQuantity(roomId, cropId);
        String town = cropRedisRepository.getCropTown(roomId, cropId);

        log.debug("gold: {}, price: {}, availableQuantity: {}", gold, price, availableQuantity);
        // 2. 총 거래 금액 계산
        long totalPrice = (long) price * cropTransactionRequestDto.getQuantity();
        int purchaseQuantity = cropTransactionRequestDto.getQuantity();

        // 거래 응답 객체 초기화
        CropTransactionResponseDto responseDto = new CropTransactionResponseDto();
        responseDto.setCropId(cropId);
        responseDto.setTown(town);
        // 3. 골드와 작물 수량이 충분한지 확인
        if (gold != null && gold >= totalPrice) {
            if (availableQuantity != null && availableQuantity >= purchaseQuantity) {

                // 3.1 충분하다면 골드 차감 및 작물 수량 감소
                // TODO 트랜잭션 처리
//                redisTemplate.multi(); // 새로운 트랜잭션 시작
                playerRepository.updatePlayerGold(playerId, -totalPrice); // 플레이어 보유 골드 감소
                cropRedisRepository.updateCropQuantity(roomId, cropId, -purchaseQuantity); // 마을 작물 수량 감소
                playerRepository.updatePlayerCropQuantity(playerId, cropId, purchaseQuantity); // 플레이어 보유 작물 수량 증가
//                redisTemplate.exec(); // 트랜잭션 커밋
                System.out.println("Transaction successful! Player bought " + purchaseQuantity + " crops.");
                int playerGold = playerRepository.getPlayerGold(playerId);
                int playerQuantity = playerRepository.getPlayerCropQuantity(playerId, cropId);
                int townQuantity = cropRedisRepository.getCropQuantity(roomId, cropId);

                // TODO 플레이어에게 남은 수량으로 변경
                responseDto.setPlayerQuantity(playerQuantity);  // 플레이어가 구매한 수량
                responseDto.setTownQuantity(townQuantity);        // 마을에 남은 작물 수량
                responseDto.setPlayerGold(playerGold);            // 플레이어의 남은 골드
                // 성공 반환
                return new CropTransactionResult(TransactionStatusType.SUCCESS, responseDto);
            } else {
                // 3.2 상점에 충분한 수량이 없는 경우
                return new CropTransactionResult(TransactionStatusType.INSUFFICIENT_STOCK, responseDto);
            }
        } else {
            // 3.3 골드가 부족한 경우
            return new CropTransactionResult(TransactionStatusType.INSUFFICIENT_GOLDS, null);
        }
    }

    // 플레이어가 특정 작물을 판매
    public synchronized CropTransactionResult sellCrop(String roomId, CropTransactionRequestDto cropTransactionRequestDto) {
        String cropId = cropTransactionRequestDto.getCropId();
        String playerId = String.valueOf(cropTransactionRequestDto.getPlayerId());

        // 1. 플레이어의 작물 수량과 상점의 가격 가져오기
        int playerCropQuantity = playerRepository.getPlayerCropQuantity(playerId, cropId);
        int price = cropRedisRepository.getCropPrice(roomId, cropId);

        log.debug("playerCropQuantity: {}, price: {}", playerCropQuantity, price);

        int sellQuantity = cropTransactionRequestDto.getQuantity();
        long totalPrice = (long) price * sellQuantity;  // 판매 후 받을 총 금액

        // 거래 응답 객체 초기화
        CropTransactionResponseDto responseDto = new CropTransactionResponseDto();
        responseDto.setCropId(cropId);

        // 2. 플레이어가 판매할 수 있는 작물 수량이 충분한지 확인
        if (playerCropQuantity >= sellQuantity) {
            // 2.1 충분하다면 작물 수량 감소 및 골드 증가
            playerRepository.updatePlayerCropQuantity(playerId, cropId, -sellQuantity); // 플레이어의 작물 수량 감소
            playerRepository.updatePlayerGold(playerId, totalPrice); // 플레이어의 보유 골드 증가
            cropRedisRepository.updateCropQuantity(roomId, cropId, sellQuantity); // 마을의 작물 보유 수량 증가
            log.debug("Player sold {} crops for {} gold.", sellQuantity, totalPrice);

            // 3. 갱신된 정보 가져오기
            int playerGold = playerRepository.getPlayerGold(String.valueOf(playerId));
            int playerUpdatedQuantity = playerRepository.getPlayerCropQuantity(String.valueOf(playerId), cropId);
            int townQuantity = cropRedisRepository.getCropQuantity(roomId, cropId);

            // 4. 응답 DTO에 갱신된 정보 설정
            responseDto.setPlayerQuantity(playerUpdatedQuantity);  // 플레이어가 남은 작물 수량
            responseDto.setTownQuantity(townQuantity);             // 상점에 남은 작물 수량
            responseDto.setPlayerGold(playerGold);                 // 플레이어의 남은 골드

            // 성공 반환
            return new CropTransactionResult(TransactionStatusType.SUCCESS, responseDto);
        } else {
            // 2.2 플레이어가 충분한 작물을 가지고 있지 않으면
            return new CropTransactionResult(TransactionStatusType.INSUFFICIENT_STOCK, null);
        }
    }

}
