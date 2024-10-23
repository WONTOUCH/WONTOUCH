package wontouch.api.domain.user.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import wontouch.api.domain.user.entity.Avatar;

import java.util.List;
import java.util.Optional;

@Repository
public interface AvatarRepository extends JpaRepository<Avatar, Integer> {

    boolean existsByUserIdAndCharacterName(int userId, String characterName);
    Optional<List<Avatar>> findByUserId(int userId);
    Optional<Avatar> findByUserIdAndCharacterName(int userId, String characterName);
    Optional<Avatar> findByUserIdAndIsEquippedIsTrue(int userId);
    void deleteByUserId(int userId);
}
