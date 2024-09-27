package wontouch.api.domain.friend.model.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import wontouch.api.domain.friend.entity.FriendRequest;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends MongoRepository<FriendRequest, Integer> {

    Optional<List<FriendRequest>> findByToUserId(int toUserId);
}
