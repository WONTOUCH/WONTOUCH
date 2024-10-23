package wontouch.auth.domain.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import wontouch.auth.domain.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findById(int id);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
}
