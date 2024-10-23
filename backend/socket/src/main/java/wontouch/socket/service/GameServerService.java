package wontouch.socket.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import wontouch.socket.dto.game.crop.CropTransactionResult;

import java.util.Map;

// 게임 서버로 이동하여 처리하는 로직들을 담는 서비스 레이어
@Service
@Slf4j
public class GameServerService {

    private final RestTemplate restTemplate = new RestTemplate();
    @Value("${game.server.name}:${game.server.path}")
    private String gameServerUrl;

    // 작물 구매 요청
    public CropTransactionResult buyCropRequest(String roomId, Map<String, Object> transactionInfo) {
        String buyCropUrl = gameServerUrl + "/town/buy/crop/" + roomId;
        log.debug("buyCropUrl: {}", buyCropUrl);
        transactionInfo.put("action", "BUY");
        CropTransactionResult result = restTemplate.postForObject(buyCropUrl, transactionInfo, CropTransactionResult.class);
        log.debug("result: {}", result);
        return result;
    }

    // 작물 판매 요청
    public CropTransactionResult sellCropRequest(String roomId, Map<String, Object> transactionInfo) {
        String sellCropUrl = gameServerUrl + "/town/sell/crop/" + roomId;
        log.debug("sellCropUrl: {}", sellCropUrl);
        transactionInfo.put("action", "SELL");
        CropTransactionResult result = restTemplate.postForObject(sellCropUrl, transactionInfo, CropTransactionResult.class);
        log.debug("result: {}", result);
        return result;
    }

    // 특정 작물의 차트 요청
    public Object getCropChart(String roomId, Map<String, Object> cropInfo) {
        String cropChartUrl = gameServerUrl + "/crop/chart/" + roomId;
        log.debug("cropChartUrl: {}", cropChartUrl);
        Map<Object, Object> cropChart = restTemplate.postForObject(cropChartUrl, cropInfo, Map.class);
        return cropChart;
    }

    // 플레이어의 보유 작물 리스트 요청
    public Object getPlayerCrops(String playerId) {
        String playerCropsUrl = gameServerUrl + "/player/crop/list/" + playerId;
        log.debug("playerCropsUrl: {}", playerCropsUrl);
        Object playerCrops = restTemplate.getForObject(playerCropsUrl, Object.class);
        log.debug("Player's crop List: {}", playerCrops);
        return playerCrops;
    }

    // 마을의 보유 작물 리스트 요청
    public Object getTownCrops(String roomId, Map<String, Object> townInfo) {
        String townType = townInfo.get("townName").toString();
        String townCropsUrl = gameServerUrl + "/town/crop/list/" + roomId + "/" + townType;
        Object townCrops = restTemplate.getForObject(townCropsUrl, Object.class);
        return townCrops;
    }

    // 라운드 준비
    public Object sendPreparationInfo(String roomId, String playerId, Map<String, Object> readyInfo) {
        String readyUrl = gameServerUrl + "/game/ready/" + roomId;
        log.debug("readyUrl:{}", readyUrl);
        readyInfo.put("playerId", playerId);
        log.debug("preparationInfo:{}", readyInfo);
        System.out.println("Sending preparation info to Game Server: " + readyInfo);
        return restTemplate.postForObject(readyUrl, readyInfo, Object.class);
    }

    // 특정 작물 기사 구입
    public Object buyArticle(String roomId, String playerId, Map<String, Object> transactionInfo) {
        String articleUrl = gameServerUrl + "/article/buy/" + roomId;
        transactionInfo.put("playerId", playerId);
        return restTemplate.postForObject(articleUrl, transactionInfo, Object.class);
    }

    // 랜덤 기사 구입
    public Object buyRandomArticle(String roomId, String playerId, Map<String, Object> transactionInfo) {
        String articleUrl = gameServerUrl + "/article/buy-random/" + roomId;
        transactionInfo.put("playerId", playerId);
        return restTemplate.postForObject(articleUrl, transactionInfo, Object.class);
    }
}
