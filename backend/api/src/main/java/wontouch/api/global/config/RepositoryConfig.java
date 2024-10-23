package wontouch.api.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableJpaRepositories(basePackages = {
        "wontouch.api.domain.user.model.repository",
        "wontouch.api.domain.friend.model.repository.jpa"
})
@EnableMongoRepositories(basePackages = {
        "wontouch.api.domain.friend.model.repository.mongo",
        "wontouch.api.domain.notification.model.repository"
})
public class RepositoryConfig {
}
