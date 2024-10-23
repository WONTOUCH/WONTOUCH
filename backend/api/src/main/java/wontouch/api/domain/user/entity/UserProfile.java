package wontouch.api.domain.user.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private int userId;

    @Column(nullable = false)
    @Size(min = 2, max = 30)
    private String nickname;

    @Column
    @Size(max = 30, message = "한줄소개는 한글 기준 30자 이하로 설정해주세요.")
    private String description;

    @Builder
    public UserProfile(int userId, String nickname, String description) {
        this.userId = userId;
        this.nickname = nickname;
        this.description = description;
    }

    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    public void updateDescription(String description) {
        this.description = description;
    }
}
