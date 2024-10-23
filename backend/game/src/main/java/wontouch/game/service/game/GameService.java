package wontouch.game.service.game;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import wontouch.game.domain.Player;
import wontouch.game.domain.PlayerStatus;
import wontouch.game.dto.SessionDeleteDto;
import wontouch.game.entity.Crop;
import wontouch.game.repository.GameRepository;
import wontouch.game.repository.article.ArticleRepository;
import wontouch.game.repository.player.PlayerRepository;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class GameService {

    private final GameRepository gameRepository;
    private final PlayerRepository playerRepository;
    private final ArticleRepository articleRepository;

    public GameService(GameRepository gameRepository, PlayerRepository playerRepository, ArticleRepository articleRepository) {
        this.gameRepository = gameRepository;
        this.playerRepository = playerRepository;
        this.articleRepository = articleRepository;
    }

    // 게임이 시작될 때 플레이어들의 초기 상태를 설정하는 메서드
    public void initPlayers(String roomId, List<Player> players) {
        for (Player player : players) {
            // 비즈니스 로직 처리
            playerRepository.savePlayer(roomId, player);
            playerRepository.setPlayerStatus(roomId, String.valueOf(player.getId()), PlayerStatus.WAITING);
        }
    }

    // 이번 게임에 포함된 작물의 목록을 각 플레이어의 보유 작물에 세팅
    public void initPlayersCrops(List<Player> players, List<Crop> crops) {
        for (Player player : players) {
            gameRepository.initCrops(player, crops);
        }
    }

    public void initCropsForRoundZero(String roomId, List<Crop> crops) {
        for (Crop crop : crops) {
            articleRepository.updateCropPrice(roomId, crop.getId(), crop.getPrice(), 0);
        }
    }

    public Map<String, Set<Object>> mappingPlayerArticles(String roomId) {
        Set<Object> players = playerRepository.getPlayersFromGame(roomId);
        Map<String, Set<Object>> playerArticleMap = new ConcurrentHashMap<>();
        for (Object playerId : players) {
            Set<Object> playerArticleIds = playerRepository.getPlayerArticleIds((String) playerId);
            playerArticleMap.put(String.valueOf(playerId), playerArticleIds);
        }
        return playerArticleMap;
    }
}
