package wontouch.lobby.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wontouch.lobby.dto.ready.ReadyDto;
import wontouch.lobby.dto.ready.ReadyStateDto;
import wontouch.lobby.repository.ReadyRepository;

import java.util.Map;
import java.util.Optional;
import java.util.Set;

// 게임의 준비 시작을 담당하는 서비스 레이어
@Service
@Slf4j
public class ReadyService {

    private final ReadyRepository readyRepository;

    @Autowired
    public ReadyService(ReadyRepository readyRepository) {
        this.readyRepository = readyRepository;
    }

    public ReadyDto updateReadyState(Map<String, Object> preparationInfo) {
        String roomId = preparationInfo.get("roomId").toString();
        long playerId = Long.parseLong(preparationInfo.get("playerId").toString());
        ReadyDto readyStateDto = readyRepository.readyStatusChange(roomId, playerId);
        log.debug("ready: {}", readyStateDto);
        return readyStateDto;
    }

    public boolean kickUser(Map<String, Object> kickInfo) {
        String roomId = kickInfo.get("roomId").toString();
        String requestUserId = kickInfo.get("requestUserId").toString();
        String playerId = kickInfo.get("playerId").toString();
        return readyRepository.kickUser(roomId, requestUserId, playerId);
    }

    public Set<String> startGameIfAllReady(String roomId) {
        // Redis에서 준비 상태를 체크하여 모든 플레이어가 준비되었을 경우 게임을 시작
        Optional<Set<String>> readyPlayers = readyRepository.getPlayersForGame(roomId);

        if (readyPlayers.isPresent()) {
            //모든 플레이어가 준비되었을 때 게임 시작
            log.debug("Game can be started for players: " + readyPlayers.get());
            return readyPlayers.get();
        } else {
            //플레이어가 준비되지 않았을 때
            log.debug("Not all players are ready.");
            throw new IllegalStateException("Not all players are ready.");
        }
    }
}
