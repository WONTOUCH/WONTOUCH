package wontouch.mileage.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = {
        "wontouch.mileage.model.repository"
})
public class RepositoryConfig {
}
