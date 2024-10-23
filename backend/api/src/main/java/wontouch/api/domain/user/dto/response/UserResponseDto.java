package wontouch.api.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private int userId;
    private String email;
    private String nickname;
    private String description;
    private String characterName;
    private int tierPoint;
    private int mileage;

    public void updateEmail(String email) {
        this.email = email;
    }
}
