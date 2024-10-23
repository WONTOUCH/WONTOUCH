package wontouch.game.repository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;
import wontouch.game.domain.Player;
import wontouch.game.entity.Crop;
import wontouch.game.repository.player.PlayerRepository;

import java.util.*;

import static wontouch.game.domain.RedisKeys.*;

@Repository
@Slf4j
public class GameRepository {

    private final RedisTemplate<String, Object> redisTemplate;
    private final PlayerRepository playerRepository;
    private static final int TOTAL_EXPERIENCE = 1000;
    private static final int TOTAL_MILEAGE = 5000;
    private static final int MAX_PLAYER = 8;

    public GameRepository(RedisTemplate<String, Object> redisTemplate, PlayerRepository playerRepository) {
        this.redisTemplate = redisTemplate;
        this.playerRepository = playerRepository;
    }

    public int updateRound(String roomId) {
        String roomKey = GAME_PREFIX + roomId + ROOM_SUFFIX;

        // Redis에서 round 값을 가져옴
        String roundValue = (String) redisTemplate.opsForHash().get(roomKey, "round");

        // null이면 0으로 시작, 아니면 Integer로 변환하여 1 증가
        int round = roundValue != null ? Integer.parseInt(roundValue) : 0;
        round += 1;

        // 갱신된 round 값을 Redis에 저장
        redisTemplate.opsForHash().put(roomKey, "round", Integer.toString(round));

        // 로그 출력
        log.debug("Updated round for room {}: {}", roomId, round);

        return round;
    }

    public void initCrops(Player player, List<Crop> crops) {
        String playersCropKey = PLAYER_PREFIX + player.getId() + ":crop";
        log.debug("playersCropKey: {}", playersCropKey);
        for (Crop crop : crops) {
            redisTemplate.opsForHash().put(playersCropKey, crop.getId(), 0);
        }
    }

    // 최종 결과 맵 반환
    public Map<String, Map<String, Integer>> getTotalResultMap(String roomId) {
        String playerStatusKey = GAME_PREFIX + roomId + PLAYER_SUFFIX;
        Set<Object> playerIds = redisTemplate.opsForHash().keys(playerStatusKey);
        Map<String, Integer> totalGoldResponse = new HashMap<>();
        int totalGoldSum = 0;

        // 총 인원이 8명으로 설정되어 있다고 가정
        int actualPlayers = playerIds.size();  // 실제 참가 인원 수

        // 실제 참가 인원이 총 인원보다 적을 경우, 경험치와 마일리지 비례 조정
        int adjustedTotalExperience = TOTAL_EXPERIENCE * actualPlayers / MAX_PLAYER;
        int adjustedTotalMileage = TOTAL_MILEAGE * actualPlayers / MAX_PLAYER;

        // 보상 결과를 저장할 Map
        Map<String, Map<String, Integer>> rewardDistribution = new HashMap<>();

        // 플레이어마다 골드 계산
        for (Object playerId : playerIds) {
            int totalGold = playerRepository.calculateTotalGold(roomId, (String) playerId);
            totalGoldSum += totalGold;
            totalGoldResponse.put(playerId.toString(), totalGold);
        }

        // 총 골드를 내림차순으로 정렬하여 등수 계산
        List<Map.Entry<String, Integer>> sortedGoldList = new ArrayList<>(totalGoldResponse.entrySet());
        sortedGoldList.sort((e1, e2) -> e2.getValue().compareTo(e1.getValue()));  // 내림차순 정렬

        // 등수 계산 및 보상 분배 (동점 처리 포함)
        int rank = 1;
        int previousGold = -1;
        int playersWithSameRank = 0;

        for (Map.Entry<String, Integer> entry : sortedGoldList) {
            String playerId = entry.getKey();
            int totalGold = entry.getValue();

            // 플레이어가 차지하는 골드 비율 계산
            double goldRatio = (double) totalGold / totalGoldSum;

            // 비율에 따라 경험치와 마일리지 계산
            int experienceEarned = (int) (adjustedTotalExperience * goldRatio);
            int mileageEarned = (int) (adjustedTotalMileage * goldRatio);

            // 동점자 처리: 이전 플레이어의 골드와 비교하여 등수 할당
            if (totalGold == previousGold) {
                playersWithSameRank++;
            } else {
                // 동점자가 아닌 경우 현재 순위에서 동점자 수만큼 증가시킴
                rank += playersWithSameRank;
                playersWithSameRank = 1;
            }

            // 플레이어에게 보상 분배 및 등수 추가
            Map<String, Integer> playerRewards = new HashMap<>();
            playerRewards.put("totalGold", totalGold);
            playerRewards.put("tierPoint", experienceEarned);
            playerRewards.put("mileage", mileageEarned);
            playerRewards.put("rank", rank);  // 등수 추가

            rewardDistribution.put(playerId, playerRewards);

            // 현재 플레이어의 gold를 기록하여 다음 플레이어와 비교
            previousGold = totalGold;
        }

        return rewardDistribution;
    }

}
