package wontouch.api.domain.user.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import wontouch.api.domain.user.entity.UserProfile;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Integer> {

    Optional<UserProfile> findByUserId(int userId);
    Optional<UserProfile> findByNickname(String nickname);
    Boolean existsByNickname(String nickname);
    void deleteByUserId(int userId);
}
