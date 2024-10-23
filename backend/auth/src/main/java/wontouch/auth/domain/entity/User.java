package wontouch.auth.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import wontouch.auth.global.baseTimeEntity.BaseTimeEntity;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String username;

    @Column
    private String email;

    public User createUser(String username, String email) {
        this.username = username;
        this.email = email;

        return this;
    }

}
