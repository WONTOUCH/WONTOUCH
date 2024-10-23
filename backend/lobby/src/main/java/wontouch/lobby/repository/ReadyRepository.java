package wontouch.lobby.repository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;
import wontouch.lobby.dto.ready.ReadyDto;
import wontouch.lobby.dto.ready.ReadyStateDto;

import java.util.*;
import java.util.stream.Collectors;

// 게임의 준비 시작을 담당하는 레포지토리 레이어
@Repository
@Slf4j
public class ReadyRepository {

    private final RedisTemplate<String, Object> redisTemplate;

    public ReadyRepository(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public ReadyDto readyStatusChange(String roomId, long playerId) {
        String participantsKey = "game_lobby:" + roomId + ":participants";
        // 1. 기존 값 불러오기
        String field = Long.toString(playerId);
        log.debug("roomId: " + roomId + ", participantsKey: " + participantsKey);
        boolean isReady = (boolean) redisTemplate.opsForHash()
                .get(participantsKey, field);

        // 2. 필요한 경우 값을 변경하는 로직 (여기서는 새로운 값으로 덮어쓰기)
        log.info("Existing value: " + isReady);  // 기존 값을 로그로 확인

        // 3. 변경된 값을 다시 Redis Hash에 반영
        redisTemplate.opsForHash().put(participantsKey, field, !isReady);

        log.info("Updated value for field '" + field + "' in hash '" + participantsKey + "': " + !isReady);

        return getReadyStatus(roomId);
    }

//    public boolean isAllReady(String roomId) {
//        String participantsKey = "game_lobby:" + roomId + ":participants";
//
//        // Hash에서 참여자 목록 가져오기
//        Map<Object, Object> participantsMap = redisTemplate.opsForHash().entries(participantsKey);
//
//        // 참가자가 없는 경우 처리
//        if (participantsMap == null || participantsMap.isEmpty()) {
//            // 참가자가 없으면 모두 준비되지 않은 것으로 반환
//            return false;
//        }
//
//        // 모든 참가자의 readyState가 true인지 확인
//        return participantsMap.entrySet().stream()
//                .allMatch(entry -> {
//                    Object value = entry.getValue();
//                    return Boolean.parseBoolean(value.toString());
//                });
//    }

    public ReadyDto getReadyStatus(String roomId) {
        String participantsKey = "game_lobby:" + roomId + ":participants";

        // Hash에서 참여자 목록 가져오기
        Map<Object, Object> participantsMap = redisTemplate.opsForHash().entries(participantsKey);

        // 참가자가 없는 경우 처리
        if (participantsMap == null || participantsMap.isEmpty()) {
            // 참가자가 없으면 빈 리스트와 isAllReady=false 반환
            return new ReadyDto(new ArrayList<>(), false);
        }

        // ReadyStateDto 리스트 생성
        List<ReadyStateDto> readyStateList = participantsMap.entrySet().stream()
                .map(entry -> {
                    long playerId = Long.parseLong(entry.getKey().toString());
                    boolean isReady = Boolean.parseBoolean(entry.getValue().toString());
                    return new ReadyStateDto(playerId, isReady);
                })
                .collect(Collectors.toList());

        // 모든 참가자가 준비되었는지 확인
        boolean isAllReady = readyStateList.stream()
                .allMatch(ReadyStateDto::isReady);

        // ReadyDto 객체로 반환
        return new ReadyDto(readyStateList, isAllReady);
    }

    public boolean kickUser(String roomId, String requestId, String playerId) {
        String participantsKey = "game_lobby:" + roomId + ":participants";
        String infoKey = "game_lobby:" + roomId + ":info";
        log.debug("roomId:{}", roomId);
        String hostId = (String) redisTemplate.opsForHash().get(infoKey, "hostId");
        log.debug("playerId:{}, hostId: {}", playerId, hostId);
        if (requestId.equals(hostId)) {
            redisTemplate.opsForHash().delete(participantsKey, playerId);
            return true;
        }
        return false;
    }

    public Optional<Set<String>> getPlayersForGame(String roomId) {
        String participantsKey = "game_lobby:" + roomId + ":participants";

        // Hash에서 참여자 목록 가져오기
        Map<Object, Object> participantsMap = redisTemplate.opsForHash().entries(participantsKey);

        // 참가자가 없는 경우 빈 Optional 반환
        if (participantsMap.isEmpty()) {
            return Optional.empty();
        }

        // 모든 참가자의 readyState가 true인지 확인하고, 모두 true인 경우 해당 플레이어 목록을 반환
        Set<String> readyPlayers = participantsMap.entrySet().stream()
                .filter(entry -> Boolean.parseBoolean(entry.getValue().toString())) // 준비된 플레이어만 필터링
                .map(entry -> entry.getKey().toString()) // Object를 String으로 변환
                .collect(Collectors.toSet());

        // 모든 플레이어가 ready 상태인 경우에만 Optional에 담아 반환
        if (readyPlayers.size() == participantsMap.size()) {
            return Optional.of(readyPlayers);
        }

        // 모든 플레이어가 준비되지 않은 경우 빈 Optional 반환
        return Optional.empty();
    }
}
