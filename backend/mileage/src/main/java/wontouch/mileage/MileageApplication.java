package wontouch.mileage;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories(basePackages = "wontouch.mileage.domain.model.repository") // 리포지토리 패키지 경로 지정
public class MileageApplication {

    public static void main(String[] args) {
        SpringApplication.run(MileageApplication.class, args);
    }

}
