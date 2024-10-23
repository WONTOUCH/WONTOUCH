package wontouch.game.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import wontouch.game.entity.Article;
import wontouch.game.entity.Crop;
import wontouch.game.entity.SpecialArticle;
import wontouch.game.repository.article.ArticleRepository;
import wontouch.game.repository.crop.CropRedisRepository;
import wontouch.game.repository.crop.CropRepository;

import java.util.*;
import java.util.stream.Collectors;
import static wontouch.game.domain.RedisKeys.*;

@Service
@Slf4j
public class ArticleService {

    private final CropRepository cropRepository;
    private final CropRedisRepository cropRedisRepository;
    private final ArticleRepository articleRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final RedisTemplate<String, Object> redisTemplate;

    public ArticleService(CropRepository cropRepository, CropRedisRepository cropRedisRepository, ArticleRepository articleRepository, RedisTemplate<String, Object> redisTemplate) {
        this.cropRepository = cropRepository;
        this.cropRedisRepository = cropRedisRepository;
        this.articleRepository = articleRepository;
        this.redisTemplate = redisTemplate;
    }

    // 기사 구매
    public void buyArticle(String roomId, String playerId, String articleId) {

    }

    // 기사 업데이트
    public Crop updateArticleList(String cropId, List<Article> articleList) {
        Optional<Crop> findCrop = cropRepository.findById(cropId);
        Crop crop = findCropOrThrow(findCrop);
        List<Article> currentArticleList = crop.getArticleList();

        // ID 할당
        for (Article article : articleList) {
            if (article.getId() == null || article.getId().isEmpty()) {
                article.setId(UUID.randomUUID().toString()); // 새로운 ID 할당
            }
        }

        if (currentArticleList == null) {
            // 기존 Article 리스트가 없으면 새로운 리스트로 설정
            crop.setArticleList(articleList);
        } else {
            // 기존 Article 리스트가 있으면 새로 받은 리스트를 추가
            currentArticleList.addAll(articleList);
        }

        return cropRepository.save(crop);
    }

    public Crop updateSpecialArticles(String cropId, List<SpecialArticle> specialArticles) {
        Optional<Crop> cropOptional = cropRepository.findById(cropId);
        Crop crop = findCropOrThrow(cropOptional);
        List<SpecialArticle> existedSpecialArticles = crop.getSpecialArticleList();

        for (SpecialArticle specialArticle : specialArticles) {
            if (specialArticle.getId() == null || specialArticle.getId().isEmpty()) {
                specialArticle.setId(UUID.randomUUID().toString());
            }
        }

        if (existedSpecialArticles == null) {
            crop.setSpecialArticleList(specialArticles);
        } else {
            existedSpecialArticles.addAll(specialArticles);
        }

        return cropRepository.save(crop);
    }

    // 라운드 시작 시 상점 정보 세팅
    // TODO 라운드 타이머와 연결
    public void saveNewArticlesForRound(String roomId, int numArticles) {
        Map<String, List<String>> randomArticleIds = loadRandomArticleIds(roomId, numArticles);
        String articleKey = GAME_PREFIX + roomId + ARTICLE_SUFFIX;

        for (String cropId : randomArticleIds.keySet()) {
            String articleCropKey = articleKey + ":" + cropId;

            // 기존 기사 정보를 삭제
            redisTemplate.delete(articleCropKey);

            // 새로운 기사 세팅
            List<String> ids = randomArticleIds.get(cropId);
            for (String id : ids) {
                redisTemplate.opsForSet().add(articleCropKey, id);
            }
        }
    }

    // 랜덤한 기사 ID 리스트 로드
    public Map<String, List<String>> loadRandomArticleIds(String roomId, int numArticles) {
        Set<Object> allCrops = cropRedisRepository.getAllCrops(roomId);
        log.debug("allCrops from loadRandomArticleIds: {}", allCrops);
        Map<String, List<String>> randomArticleIds = new HashMap<>();
        Random random = new Random();

        for (Object cropId : allCrops) {
            // Crop에서 Article의 ID만 가져옴
            Optional<Crop> findCrop = cropRepository.findCropWithArticleIdsOnly((String) cropId);
            //log.debug("findCrop:{}", findCrop);
            Crop crop = findCropOrThrow(findCrop);
            List<String> articleIds = crop.getArticleList() != null ?
                    crop.getArticleList().stream()
                            .map(Article::getId)  // Article ID만 추출
                            .collect(Collectors.toList())
                    : Collections.emptyList();

            if (articleIds != null && !articleIds.isEmpty()) {
                // 랜덤하게 지정한 수의 ID를 뽑아냄
                List<String> randomSelection = getRandomIds(articleIds, numArticles, random);
                randomArticleIds.put((String) cropId, randomSelection);
            }
        }
        return randomArticleIds;
    }

    // 랜덤한 ID 리스트를 가져오기
    private List<String> getRandomIds(List<String> idList, int numIds, Random random) {
        List<String> selectedIds = new ArrayList<>();
        int idSize = idList.size();

        if (numIds > idSize) {
            return new ArrayList<>(idList);  // ID가 부족할 경우 모두 반환
        }

        // 중복 없이 랜덤하게 ID 선택
        while (selectedIds.size() < numIds) {
            int randomIndex = random.nextInt(idSize);
            String selectedId = idList.get(randomIndex);

            if (!selectedIds.contains(selectedId)) {
                selectedIds.add(selectedId);
            }
        }
        return selectedIds;
    }


    // 랜덤한 기사 리스트를 가져오기
    private List<Article> getRandomArticles(List<Article> articleList, int numArticles, Random random) {
        List<Article> selectedArticles = new ArrayList<>();
        int articleSize = articleList.size();

        // 뽑고자 하는 기사 수가 실제 기사 수보다 많을 경우 모두 반환
        if (numArticles > articleSize) {
            return new ArrayList<>(articleList);
        }

        // 중복 없이 랜덤하게 기사 선택
        while (selectedArticles.size() < numArticles) {
            int randomIndex = random.nextInt(articleSize);
            Article selectedArticle = articleList.get(randomIndex);

            // 중복된 기사가 선택되지 않도록 처리
            if (!selectedArticles.contains(selectedArticle)) {
                selectedArticles.add(selectedArticle);
            }
        }
        return selectedArticles;
    }

    // 찾은 작물 예외 처리
    private Crop findCropOrThrow(Optional<Crop> findCrop) {
        if (findCrop.isEmpty()) {
            throw new IllegalArgumentException("crop not found");
        }
        return findCrop.get();
    }
}
