package wontouch.api.domain.friend.model.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import wontouch.api.domain.friend.entity.Friend;

import java.util.List;
import java.util.Optional;

public interface FriendRepository extends JpaRepository<Friend, Integer> {

    boolean existsByFromUserIdAndToUserId(int fromUserId, int toUserId);
    Optional<List<Friend>> findByFromUserId(int fromUserId);
    Optional<Friend> findByFromUserIdAndToUserId(int fromUesrId, int toUserId);
    Optional<List<Friend>> findByFromUserIdOrToUserId(int fromUserId, int toUserId);
    void deleteByFromUserIdOrToUserId(int fromUserId, int toUserId);
}
