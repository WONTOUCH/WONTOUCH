package wontouch.game.service;

import org.springframework.stereotype.Service;
import wontouch.game.dto.SessionDeleteDto;
import wontouch.game.repository.player.PlayerRepository;

import java.util.Map;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public Map<Object, Object> getAllCropsByPlayer(int playerId) {
        return playerRepository.findAllCropsByPlayer(String.valueOf(playerId));
    }

    public void removePlayerInfo(SessionDeleteDto sessionDeleteDto) {
        String roomId = sessionDeleteDto.getRoomId();
        String playerId = sessionDeleteDto.getPlayerId();
        playerRepository.freePlayerMemory(roomId, playerId);
    }
}
