package wontouch.mileage.domain.entity;

import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Builder
@Document(collection = "mileage_log")
public class MileageLog {

    @Id
    private String id;

    private int userId;

    private int amount;

    private String description;

    private int totalMileage;

    private LocalDateTime createAt;
    
    private MileageLogType mileageLogType;  // 적립, 사용 여부
}
