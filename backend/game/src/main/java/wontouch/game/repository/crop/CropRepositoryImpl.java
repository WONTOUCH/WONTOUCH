package wontouch.game.repository.crop;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;
import wontouch.game.entity.Crop;

import java.util.List;

@Repository
public class CropRepositoryImpl implements CropCustomRepository {

    private final MongoTemplate mongoTemplate;

    @Autowired
    public CropRepositoryImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public List<String> findDistinctTypes() {
        return mongoTemplate.query(Crop.class).distinct("type").as(String.class).all();
    }
}
