package wontouch.game.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wontouch.game.entity.Article;
import wontouch.game.entity.Crop;
import wontouch.game.repository.article.ArticleRepository;
import wontouch.game.service.ArticleService;
import wontouch.game.service.CropService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/article")
@Slf4j
public class ArticleController {

    private final ArticleService articleService;
    private final CropService cropService;
    // TODO 테스트용 추후 삭제 예정
    private final ArticleRepository articleRepository;

    public ArticleController(ArticleService articleService, CropService cropService, ArticleRepository articleRepository) {
        this.articleService = articleService;
        this.cropService = cropService;
        this.articleRepository = articleRepository;
    }

    @PostMapping("/{cropId}")
    public ResponseEntity<Crop> updateArticle(@PathVariable String cropId, @RequestBody List<Article> articleList) {
        log.debug("articleList: {}", articleList);
        Crop crop = articleService.updateArticleList(cropId, articleList);
        log.debug("crop: {}", crop.toString());
        return ResponseEntity.ok(crop);
    }


    @GetMapping("/get-random/{roomId}")
    public ResponseEntity<?> getRandomArticles(@PathVariable String roomId) {
        articleService.saveNewArticlesForRound(roomId, 2);
        return ResponseEntity.ok("random articles");
    }

    @PostMapping("/buy/{roomId}")
    public ResponseEntity<?> buyTest(@PathVariable String roomId, @RequestBody Map<String, Object> buyInfo) {
        String cropId = cropService.getRandomCropFromGame(roomId);
        cropId = "radish";
        String playerId = buyInfo.get("playerId").toString();
        Article article = articleRepository.buyRandomArticle(roomId, playerId, cropId);

        return ResponseEntity.ok(article);
    }

    @PostMapping("/buy-random/{roomId}")
    public ResponseEntity<?> buyRandomArticle(@PathVariable String roomId, @RequestBody Map<String, Object> buyInfo) {
        String cropId = cropService.getRandomCropFromGame(roomId);
        String playerId = buyInfo.get("playerId").toString();
        Article article = articleRepository.buyRandomArticle(roomId, playerId, cropId);
        return ResponseEntity.ok(article);
    }
}
