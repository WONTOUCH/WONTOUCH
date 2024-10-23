package wontouch.game.repository.player;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;
import wontouch.game.domain.Player;
import wontouch.game.domain.PlayerStatus;
import wontouch.game.repository.crop.CropRedisRepository;

import java.util.Map;
import java.util.Set;

import static wontouch.game.domain.RedisKeys.*;

@Repository
@Slf4j
public class PlayerRepository {

    private final RedisTemplate<String, Object> redisTemplate;
    private final CropRedisRepository cropRepository;
    private static final int DEFAULT_GOLD = 1000000;

    private static final int ARTICLE_DEFAULT_PRICE = 5000;

    public PlayerRepository(RedisTemplate<String, Object> redisTemplate, CropRedisRepository cropRepository) {
        this.redisTemplate = redisTemplate;
        this.cropRepository = cropRepository;
    }

    // 현재 게임에 참여중인 플레이어 조회
    public Set<Object> getPlayersFromGame(String roomId) {
        String key = GAME_PREFIX + roomId + PLAYER_SUFFIX;
        Set<Object> keys = redisTemplate.opsForHash().keys(key);
        return keys;
    }

    // 플레이어 저장
    public void savePlayer(String roomId, Player player) {
        String playerKey = PLAYER_PREFIX + player.getId() + INFO_SUFFIX;
        redisTemplate.opsForHash().put(playerKey, "nickname", player.getNickname());
        redisTemplate.opsForHash().put(playerKey, "gold", DEFAULT_GOLD);
        redisTemplate.opsForHash().put(playerKey, "roomId", roomId);
    }

    // 플레이어 상태 세팅
    public void setPlayerStatus(String roomId, String playerId, PlayerStatus status) {
        String playerStatusKey = GAME_PREFIX + roomId + PLAYER_SUFFIX;
        redisTemplate.opsForHash().put(playerStatusKey, playerId, status.toString());
    }

    // 플레이어의 라운드 대기 상태 세팅
    public void setAllPlayerStatus(String roomId, PlayerStatus status) {
        Set<Object> players = getPlayersFromGame(roomId);
        for (Object playerId : players) {
            setPlayerStatus(roomId, (String)playerId, status);
        }
    }

    // 플레이어의 보유 작물 조회
    public Map<Object, Object> findAllCropsByPlayer(String playerId) {
        String playerCropKey = PLAYER_PREFIX + playerId + CROP_SUFFIX;
        // 모든 필드-값을 가져오기 (Map 형태로 반환)
        return redisTemplate.opsForHash().entries(playerCropKey);
    }

    // 플레이어의 최종 골드 계산
    public int calculateTotalGold(String roomId, String playerId) {
        int totalGold = getPlayerGold(playerId);
        Map<Object, Object> allCropsByPlayer = findAllCropsByPlayer(playerId);
        for (Object cropId : allCropsByPlayer.keySet()) {
            int cropPrice = cropRepository.getCropPrice(roomId, cropId);
            int cropQuantity = (Integer) allCropsByPlayer.get(cropId);
            totalGold += cropPrice * cropQuantity;
        }

        return totalGold;
    }

    // 플레이어의 골드 반환
    public int getPlayerGold(String playerId) {
        String playerKey = PLAYER_PREFIX + playerId + INFO_SUFFIX;
        return (Integer) redisTemplate.opsForHash().get(playerKey, "gold");
    }


    // 플레이어의 특정 작물 보유 개수 반환
    public int getPlayerCropQuantity(String playerId, String cropId) {
        String playerCropKey = PLAYER_PREFIX + playerId + CROP_SUFFIX;
        return (Integer) redisTemplate.opsForHash().get(playerCropKey, cropId);
    }

    // 플레이어가 보유한 기사 목록 반환
    public Set<Object> getPlayerArticleIds(String playerId) {
        String playerCropKey = PLAYER_PREFIX + playerId + ARTICLE_SUFFIX;
        return redisTemplate.opsForSet().members(playerCropKey);
    }

    // 플레이어의 보유 골드 gold만큼 변경
    public void updatePlayerGold(String playerId, long gold) {
        String playerKey = PLAYER_PREFIX + playerId + INFO_SUFFIX;
        redisTemplate.opsForHash().increment(playerKey, "gold", gold); // 골드 차감
    }

    public void updatePlayerCropQuantity(String playerId, String cropId, int quantity) {
        String playerCropKey = PLAYER_PREFIX + playerId + CROP_SUFFIX;
        redisTemplate.opsForHash().increment(playerCropKey, cropId, quantity); // 플레이어 보유 작물 수량 증가
    }

    // 플레이어의 기사 구입 초기 가격 세팅
    public void setPlayersArticlePrice(String roomId) {
        Set<Object> players = getPlayersFromGame(roomId);
        for (Object player : players) {
            String key = PLAYER_PREFIX + player + INFO_SUFFIX;
            redisTemplate.opsForHash().put(key, "articlePrice", ARTICLE_DEFAULT_PRICE);
        }
    }

    public void freePlayerArticle(String roomId) {
        Set<Object> player = getPlayersFromGame(roomId);
        for (Object playerId : player) {
            String key = PLAYER_PREFIX + playerId + ARTICLE_SUFFIX;
            redisTemplate.delete(key);
        }
    }

    // 플레이어들의 메모리 할당 해제
    public void freeAllPlayerMemory(String roomId) {
        Set<Object> players = getPlayersFromGame(roomId);
        for (Object player : players) {
            freePlayerMemory(roomId, (String)player);
        }
        freePlayerArticle(roomId);
    }

    public void freePlayerMemory(String roomId, String playerId) {
        if (playerId == null) {
            return;
        }
        String infoKey = PLAYER_PREFIX + playerId + INFO_SUFFIX;
        redisTemplate.delete(infoKey);
        String cropKey = PLAYER_PREFIX + playerId + CROP_SUFFIX;
        redisTemplate.delete(cropKey);
        String playerKey = GAME_PREFIX + roomId + PLAYER_SUFFIX;
        redisTemplate.opsForHash().delete(playerKey, playerId);
    }
}
