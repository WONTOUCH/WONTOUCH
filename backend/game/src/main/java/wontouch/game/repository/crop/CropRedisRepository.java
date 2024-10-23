package wontouch.game.repository.crop;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;
import wontouch.game.entity.Crop;

import java.util.Map;
import java.util.Set;

import static wontouch.game.domain.RedisKeys.*;

@Repository
@Slf4j
public class CropRedisRepository {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final int DEFAULT_QUANTITY = 30;

    public CropRedisRepository(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // 게임에 작물 ID를 SET으로 저장 (게임 전역 관리)
    public void addCropToGame(String roomId, String cropId) {
        String redisKey = "game:" + roomId + ":crop:list";
        redisTemplate.opsForSet().add(redisKey, cropId);
    }

    // 특정 마을(타입)에 작물 ID를 SET으로 저장
    public void addCropToTown(String roomId, String type, String cropId) {
        String redisKey = "game:" + roomId + ":town:" + type;
        redisTemplate.opsForSet().add(redisKey, cropId);
    }

    // 특정 작물의 세부 정보를 HASH에 저장
    public void addCropDetails(String roomId, Crop crop, String type) {
        String redisKey = "game:" + roomId + ":crop:" + crop.getId() + ":info";
        redisTemplate.opsForHash().put(redisKey, "name", crop.getName());
        redisTemplate.opsForHash().put(redisKey, "price", crop.getPrice());
        redisTemplate.opsForHash().put(redisKey, "type", crop.getType());
        redisTemplate.opsForHash().put(redisKey, "description", crop.getDescription());
        redisTemplate.opsForHash().put(redisKey, "quantity", DEFAULT_QUANTITY);
        redisTemplate.opsForHash().put(redisKey, "town", type);
    }

    // 모든 작물의 ID(이름) 조회
    public Set<Object> getAllCrops(String roomId) {
        String redisKey = "game:" + roomId + ":crop:list";
        return redisTemplate.opsForSet().members(redisKey);
    }

    // 특정 상점(타입)의 작물 ID 목록 조회
    public Set<Object> getCropIdsFromTown(String roomId, String type) {
        String redisKey = "game:" + roomId + ":town:" + type;
        return redisTemplate.opsForSet().members(redisKey);
    }

    // 작물의 id를 통해 남은 재고 조회
    public int getCropQuantity(String roomId, Object cropId) {
        String redisKey = GAME_PREFIX + roomId + CROP_INFIX + cropId + INFO_SUFFIX;
        return (Integer) redisTemplate.opsForHash().get(redisKey, "quantity");
    }

    // 작물 가격 조회
    public int getCropPrice(String roomId, Object cropId) {
        String redisKey = GAME_PREFIX + roomId + CROP_INFIX + cropId + INFO_SUFFIX;
        log.debug("key:{}", redisKey);
        Integer price = (Integer) redisTemplate.opsForHash().get(redisKey, "price");
        if (price == null) {
            log.warn("Price not found for key: {}", redisKey);
            // 기본값 설정 (예: 0)
            return 0;
        }
        return price;
    }

    public String getCropTown(String roomId, Object cropId) {
        String redisKey = GAME_PREFIX + roomId + CROP_INFIX + cropId + INFO_SUFFIX;

        Object town = redisTemplate.opsForHash().get(redisKey, "town");

        return (String) town;
    }

    // 작물 가격 업데이트
    public int updateCropPrice(String roomId, Object cropId, int newCropPrice) {
        String redisKey = "game:" + roomId + ":crop:" + cropId + ":info";
        redisTemplate.opsForHash().put(redisKey, "price", newCropPrice);
        return newCropPrice;
    }

    public String getCropNameFromCropId(String roomId, String cropId) {
        String redisKey = "game:" + roomId + ":crop:" + cropId + ":info";
        return (String) redisTemplate.opsForHash().get(redisKey, "name");
    }

    // 구매한 만큼 재고 감소
    public void updateCropQuantity(String roomId, Object cropId, int purchaseQuantity) {
        String cropKey = GAME_PREFIX + roomId + CROP_INFIX + cropId + INFO_SUFFIX;
        redisTemplate.opsForHash().increment(cropKey, "quantity", purchaseQuantity); // 마을 보유 작물 수량 감소
    }

    // 특정 작물의 세부 정보 조회
    public Map<Object, Object> getCropDetails(String roomId, String cropId) {
        String redisKey = "game:" + roomId + ":crop:" + cropId + ":info";
        return redisTemplate.opsForHash().entries(redisKey);
    }

    // 특정 작물의 차트 조회
    public Map<Object, Object> getCropChart(String roomId, String cropId) {
        String redisKey = "game:" + roomId + ":crop:" + cropId + ":chart";
        return redisTemplate.opsForHash().entries(redisKey);
    }

    // 작물 차트 업데이트
    public void updateCropChart(String roomId, String cropId, int round, int price) {
        log.debug("차트 업데이트 시도");
        String redisKey = "game:" + roomId + ":crop:" + cropId + ":chart";
        redisTemplate.opsForHash().put(redisKey, String.valueOf(round), price);
    }
}
