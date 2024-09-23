package wontouch.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import wontouch.auth.entity.Token;
import wontouch.auth.entity.User;

import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    @Query("select u from User u JOIN Token t ON u.id = t.user.id WHERE t.accessToken= :accessToken")
    Optional<User> findUserByAccessToken(@Param("accessToken") String accessToken);

    @Query("select t from Token t JOIN User u ON u.id = t.user.id WHERE t.user.id= :userId")
    Optional<Token> findTokenByUserId(@Param("userId") int userId);

    @Modifying
    @Query("delete from Token t where t.user.id = :userId")
    void deleteTokenByUserId(@Param("userId") int userId);

    @Modifying
    @Query("delete from Token t where t.accessToken = :accessToken")
    void deleteTokenByAccessToken(@Param("accessToken") String accessToken);
}
