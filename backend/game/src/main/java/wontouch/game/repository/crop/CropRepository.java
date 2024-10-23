package wontouch.game.repository.crop;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import wontouch.game.entity.Crop;

import java.util.List;
import java.util.Optional;

public interface CropRepository extends MongoRepository<Crop, String>, CropCustomRepository {
    Optional<Crop> findByName(String name);


    List<Crop> findByType(String type);

    @Query(value = "{ 'type': ?0 }", fields = "{ 'articleList': 0, 'specialArticleList': 0 }")
    List<Crop> findByTypeExcludingArticleList(String type);

    @Query(value = "{ '_id': ?0 }", fields = "{ 'articleList': 0, 'specialArticleList': 0 }")
    Crop findByIdExcludingArticleList(String id);

    @Query(value = "{ '_id': ?0, 'articleList._id': ?1 }", fields = "{ 'articleList.$': 1 }")
    Optional<Crop> findCropByArticleId(String cropId, String articleId);

    @Query(value = "{ '_id': ?0, 'articleList._id': ?1 }", fields = "{ 'articleList.$': 1, 'articleList.futureArticles': 0 }")
    Optional<Crop> findCropByArticleIdWithoutFutureArticles(String cropId, String articleId);

    @Query(value = "{ '_id': ?0 }", fields = "{ 'articleList.futureArticles': 0 }")
    Optional<Crop> findCropWithoutFutureArticles(String cropId);

    // Article의 ID만 가져오는 쿼리
    @Query(value = "{ '_id': ?0 }", fields = "{ 'articleList._id': 1, '_id': 1 }")
    Optional<Crop> findCropWithArticleIdsOnly(String cropId);

    @Query(value = "{'_id':  ?0}", fields = "{'specialArticleList': 1}")
    Optional<Crop> findCropWithSpecialArticlesOnly(String cropId);
}
