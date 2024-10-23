package wontouch.game.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wontouch.game.entity.Crop;
import wontouch.game.repository.crop.CropRedisRepository;
import wontouch.game.repository.crop.CropRepository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class CropService {

    private static final int NUM_OF_CROPS_PER_TYPE = 3;
    private static final int STOCK_QUANTITY= 10;
    private final CropRepository cropRepository;
    private final CropRedisRepository cropRedisRepository;

    @Autowired
    public CropService(CropRepository cropRepository, CropRedisRepository cropRedisRepository) {
        this.cropRepository = cropRepository;
        this.cropRedisRepository = cropRedisRepository;
    }

    // 작물 저장
    public Crop saveCrop(Crop crop) {
        return cropRepository.save(crop);
    }

    // 작물 전체 조회
    public Map<Object, Object> getTownCropList(String roomId, String type) {
        Map<Object, Object> cropList = new HashMap<>();
        List<Object> cropIdsFromTown = cropRedisRepository.getCropIdsFromTown(roomId, type).stream().toList();
        for (Object cropId : cropIdsFromTown) {
            int cropQuantity = cropRedisRepository.getCropQuantity(roomId, cropId);
            cropList.put(cropId, cropQuantity);
        }
        return cropList;
    }

    // 특정 작물 차트 조회
    public Map<Object, Object> getCropChart(String roomId, String cropId) {
        return cropRedisRepository.getCropChart(roomId, cropId);
    }

    // 게임 시작 시 mongoDB에서 타입마다 NUM_OF_CROPS_PER_TYPE 만큼의 작물을 뽑아 Redis에 저장
    public List<Crop> loadRandomCropsFromEachTypeToRedis(String roomId) {
        List<String> allTypes = cropRepository.findDistinctTypes();
        System.out.println(allTypes);
        // 이번 게임에서 사용되는 모든 작물 리스트
        List<Crop> gameCropList = new ArrayList<>();
        for (String type : allTypes) {
            List<Crop> selectedRandomCrops = selectRandomCrops(type);
            gameCropList.addAll(selectedRandomCrops);
            // TODO roomId와 Mapping
            initCropsInfoToRedis(roomId, type, selectedRandomCrops);
            log.debug("saved " + type + " crops");
        }
        return gameCropList;
    }

    // 타입에 해당하는 작물 중 랜덤하게 선택
    private List<Crop> selectRandomCrops(String type) {
        List<Crop> crops = cropRepository.findByTypeExcludingArticleList(type);
        log.debug("type: " + type + " crops: " + crops);
        int numOfCrops = NUM_OF_CROPS_PER_TYPE;
        if (numOfCrops > crops.size()) {
            numOfCrops = crops.size();
        }
        Random random = new Random();
//        return crops.stream()
//                .sorted((a, b) -> random.nextInt(2) - 1)  // 무작위로 정렬
//                .limit(numOfCrops)                // 제한된 개수 선택
//                .toList();
        return crops.stream()
//                .filter(crop -> crop.getArticleList() != null && !crop.getArticleList().isEmpty()) // articleList가 비어있지 않은 것만 필터링
                .sorted((a, b) -> random.nextInt(2) - 1)  // 무작위로 정렬
                .limit(numOfCrops)                         // 제한된 개수 선택
                .toList();
    }

    // 해당하는 작물을 Redis에 저장
    private void initCropsInfoToRedis(String roomId, String type, List<Crop> selectedCrops) {
        for (Crop crop : selectedCrops) {
            cropRedisRepository.addCropToGame(roomId, crop.getId());
            cropRedisRepository.addCropToTown(roomId, type, crop.getId());
            cropRedisRepository.addCropDetails(roomId, crop, type);
        }
    }

    // 랜덤한 Crop 선정
    public String getRandomCropFromGame(String roomId) {
        Set<Object> allCrops = cropRedisRepository.getAllCrops(roomId);
        List<Object> crops = allCrops.stream().toList();
        Random random = new Random();
        return (String) crops.get(random.nextInt(allCrops.size()));
    }

    public List<Crop> getDefaultCropInfo(String roomId) {
        Set<Object> allCrops = cropRedisRepository.getAllCrops(roomId);
        List<Crop> defaultCrops = new ArrayList<>();
        for (Object cropId : allCrops) {
            Crop crop = cropRepository.findByIdExcludingArticleList((String) cropId);
            defaultCrops.add(crop);
        }
        return defaultCrops;
    }

    public Map<String, Integer> mappingCropIdToCropName(String roomId, Map<String, Integer> priceMap) {
        Map<String, Integer> cropNameBasedPriceMap = new HashMap<>();
        for (String cropId : priceMap.keySet()) {
            String cropName = cropRedisRepository.getCropNameFromCropId(roomId, cropId);
            cropNameBasedPriceMap.put(cropName, priceMap.get(cropId));
        }
        return cropNameBasedPriceMap;
    }

    public void stockCrops(String roomId){
        Set<Object> allCrops = cropRedisRepository.getAllCrops(roomId);
        for (Object cropId : allCrops) {
            cropRedisRepository.updateCropQuantity(roomId, cropId, STOCK_QUANTITY);
        }
    }
}
