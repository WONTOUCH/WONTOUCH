package wontouch.api.domain.user.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class DescriptionUpdateRequestDto {

    private int userId;

    @Size(max = 30, message = "한줄소개는 한글 기준 30자 이하로 설정해주세요.")
    private String description;
}
