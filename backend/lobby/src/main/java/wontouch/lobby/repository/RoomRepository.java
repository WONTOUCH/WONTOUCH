package wontouch.lobby.repository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;
import wontouch.lobby.domain.Room;

import wontouch.lobby.dto.CreateRoomRequestDto;
import wontouch.lobby.dto.RoomRequestDto;
import wontouch.lobby.dto.RoomResponseDto;
import wontouch.lobby.dto.SessionSaveDto;
import wontouch.lobby.exception.CustomException;
import wontouch.lobby.exception.ExceptionResponse;

import java.util.*;

import java.util.stream.Collectors;

// 방의 정보를 관리하는 레포지토리
@Repository
@Slf4j
public class RoomRepository {

    private final RedisTemplate<String, Object> redisTemplate;

    public RoomRepository(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // 방을 만들고 레디스에 저장
    public RoomResponseDto saveRoom(CreateRoomRequestDto room) {
        String key = "game_lobby:" + room.getRoomId() + ":info";
        String playerId = Long.toString(room.getHostPlayerId());
        redisTemplate.opsForHash().put(key, "roomId", room.getRoomId());
        redisTemplate.opsForHash().put(key, "roomName", room.getRoomName());
        redisTemplate.opsForHash().put(key, "secret", room.isSecret());
        redisTemplate.opsForHash().put(key, "hostId", playerId);
        if (room.isSecret()) {
            redisTemplate.opsForHash().put(key, "password", room.getPassword());
        }

        // 방 목록 Sorted Set에 방 ID 추가 (생성 시간을 score로 사용)
        String roomListKey = "game_lobby:rooms";
        double score = System.currentTimeMillis(); // 현재 시간을 밀리초로 가져옴
        redisTemplate.opsForZSet().add(roomListKey, room.getRoomId(), score);

        // 추가 필드 작성

        // 참여자 목록에 방 생성자 삽입
        String participantsKey = "game_lobby:" + room.getRoomId() + ":participants";
        redisTemplate.opsForHash().put(participantsKey, playerId, false);
        return new RoomResponseDto(getRoomById(room.getRoomId()));
    }

    // 방 입장
    public RoomResponseDto joinRoom(String roomId, RoomRequestDto roomRequestDto) {
        long playerId = roomRequestDto.getPlayerId();
        String participantsKey = "game_lobby:" + roomId + ":participants";
        redisTemplate.opsForHash().put(participantsKey, Long.toString(playerId), false);
        Room room = getRoomById(roomId);
        if (room.isSecret()) {
            if (room.getPassword().equals(roomRequestDto.getPassword())) {
                return new RoomResponseDto(room);
            } else {
                throw new ExceptionResponse(CustomException.INVALID_PASSWORD_EXCEPTION);
            }
        }
        return new RoomResponseDto(room);
    }

    // 방 퇴장
    public RoomResponseDto exitRoom(String roomId, String playerId) {
        String participantsKey = "game_lobby:" + roomId + ":participants";
        String infoKey = "game_lobby:" + roomId + ":info";
        log.debug("roomId: {}, playerId: {}", roomId, playerId);
        // 해당 플레이어를 방의 참가자 목록에서 제거
        redisTemplate.opsForHash().delete(participantsKey, playerId);

        // 남은 참가자 수 확인
        Long remainingParticipants = redisTemplate.opsForHash().size(participantsKey);
        log.debug("remainingParticipants: {}", remainingParticipants);
        // 참가자가 0명이면 방 정보 삭제
        if (remainingParticipants != null && remainingParticipants == 0) {
            deleteRoom(roomId);
            return new RoomResponseDto();
        }

        // 현재 퇴장하는 사람이 방장이라면 방장을 바꾼다.
        String hostId = (String) redisTemplate.opsForHash().get(infoKey, "hostId");
        log.debug("playerId:{}, hostId: {}", playerId, hostId);
        if (playerId.equals(hostId)) {
            log.debug("방장을 바꾸어야해욧!!");
            changeHost(roomId);
        }
        return new RoomResponseDto(getRoomById(roomId)); // 방의 최신 정보 반환
    }

    private void changeHost(String roomId) {
        Set<String> participants = getParticipants(roomId);
        // Set을 List로 변환하여 인덱스로 접근 가능하도록 함
        List<String> participantList = new ArrayList<>(participants);

        // 랜덤 인덱스 생성
        Random random = new Random();
        int randomIndex = random.nextInt(participantList.size());

        // 새로운 방장 선택
        String newHost = participantList.get(randomIndex);

        // 새로운 방장을 Redis에 저장
        saveNewHost(roomId, newHost);

        // 로그 출력
        log.info("방 ID '{}'의 새로운 방장은 '{}'입니다.", roomId, newHost);

    }

    private void saveNewHost(String roomId, String hostId) {
        String roomKey = "game_lobby:" + roomId + ":info";
        // 기존 방장 정보 업데이트
        redisTemplate.opsForHash().put(roomKey, "hostId", hostId);
    }

    // 방 삭제 메서드
    private void deleteRoom(String roomId) {
        String roomKey = "game_lobby:" + roomId + ":info";
        String participantsKey = "game_lobby:" + roomId + ":participants";
        String roomListKey = "game_lobby:rooms";
        // 방 정보와 참가자 목록을 삭제
        redisTemplate.delete(roomKey);
        redisTemplate.delete(participantsKey);
        redisTemplate.opsForZSet().remove(roomListKey, roomId);

        log.debug("Room " + roomId + " has been deleted due to no participants.");
    }

    // 방에 해당하는 세션들 저장
    public void saveSession(SessionSaveDto sessionSaveDto) {
        String sessionId = sessionSaveDto.getSessionId();
        String roomId = sessionSaveDto.getRoomId();
        String participantsKey = "game_lobby:" + roomId + ":sessions";
        redisTemplate.opsForSet().add(participantsKey, sessionId);
    }

    // 방 목록 조회
    public List<RoomResponseDto> getRooms(int pageNumber, int pageSize) {
        String roomListKey = "game_lobby:rooms";

        // 페이지 번호와 크기를 기반으로 시작과 종료 인덱스 계산
        int start = (pageNumber - 1) * pageSize;
        int end = start + pageSize - 1;

        // 최신 방부터 가져오기 위해 reverseRange 사용
        Set<Object> roomIds = redisTemplate.opsForZSet().reverseRange(roomListKey, start, end);

        List<RoomResponseDto> rooms = new ArrayList<>();
        if (roomIds != null && !roomIds.isEmpty()) {
            for (Object roomIdObj : roomIds) {
                String roomId = roomIdObj.toString();
                Room room = getRoomById(roomId);
                if (room != null) {
                    rooms.add(new RoomResponseDto(room));
                }
            }
        }
        return rooms;
    }


    // 방 정보 조회
    public Room getRoomById(String roomId) {
        String roomKey = "game_lobby:" + roomId + ":info";
        Map<Object, Object> roomData = redisTemplate.opsForHash().entries(roomKey);

        if (roomData.isEmpty()) {
            return null;
        }

        Room room = new Room();
        room.setRoomId((String) roomData.get("roomId"));
        room.setRoomName((String) roomData.get("roomName"));
        room.setHostId(Long.parseLong((String) roomData.get("hostId")));
        room.setSecret(Boolean.parseBoolean(String.valueOf(roomData.get("secret"))));
        if (room.isSecret()) {
            room.setPassword((String) roomData.get("password"));
        }

        // 참여자 정보 설정
        Set<String> participants = getParticipants(roomId);
        room.setParticipants(participants);
        room.setCurrentPlayersCount(participants.size());

        return room;
    }

    // 참여자 전체 정보 조회
    public Set<String> getParticipants(String roomId) {
        String participantsKey = "game_lobby:" + roomId + ":participants";

        // Hash에서 참여자 목록 가져오기
        Map<Object, Object> participantsMap = redisTemplate.opsForHash().entries(participantsKey);

        // Map<Object, Object>를 Set<String>으로 변환 (Hash에서 참가자 ID만 추출)
        Set<String> participantNames = participantsMap.keySet().stream()
                .map(Object::toString) // Object를 String으로 변환
                .collect(Collectors.toSet());

        return participantNames;
    }

    // 방의 현재 플레이어 수 조회
    public long getCurrentPlayersCount(String roomId) {
        String participantsKey = "game_lobby:" + roomId + ":participants";
        return redisTemplate.opsForSet().size(participantsKey);
    }
}
