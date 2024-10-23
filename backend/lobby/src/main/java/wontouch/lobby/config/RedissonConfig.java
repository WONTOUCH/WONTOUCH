package wontouch.lobby.config;

import lombok.RequiredArgsConstructor;
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RedissonConfig {

    private static final String REDISSON_HOST_PREFIX = "redis://";

    @Value("${spring.data.redis.host}:${spring.data.redis.port}")
    private String redisHost;

    @Bean
    public RedissonClient redissonClient() {
        Config config = new Config();
        config.useSingleServer().setAddress(REDISSON_HOST_PREFIX + redisHost);
        return Redisson.create(config);
    }
}
