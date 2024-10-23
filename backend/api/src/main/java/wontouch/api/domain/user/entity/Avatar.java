package wontouch.api.domain.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import wontouch.api.global.baseTimeEntity.BaseTimeEntity;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Avatar extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private int userId;

    @Column(nullable = false)
    private String characterName;

    @Column(nullable = false)
    private boolean isEquipped;

    public void setEquipped(boolean isEquipped) {
        this.isEquipped = isEquipped;
    }

}
