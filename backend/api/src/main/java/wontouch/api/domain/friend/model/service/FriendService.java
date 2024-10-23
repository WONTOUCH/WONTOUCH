package wontouch.api.domain.friend.model.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import wontouch.api.domain.friend.dto.request.FriendDeleteRequestDto;
import wontouch.api.domain.friend.dto.request.FriendRequestActionDto;
import wontouch.api.domain.friend.dto.request.SendFriendRequestDto;
import wontouch.api.domain.friend.dto.response.FriendResponseDto;
import wontouch.api.domain.friend.dto.response.ReceiveFriendRequestDto;
import wontouch.api.domain.friend.entity.Friend;
import wontouch.api.domain.friend.entity.FriendRequest;
import wontouch.api.domain.friend.model.repository.jpa.FriendRepository;
import wontouch.api.domain.friend.model.repository.mongo.FriendRequestRepository;
import wontouch.api.domain.notification.model.service.NotificationService;
import wontouch.api.domain.user.entity.Avatar;
import wontouch.api.domain.user.entity.UserProfile;
import wontouch.api.domain.user.model.repository.AvatarRepository;
import wontouch.api.domain.user.model.repository.UserProfileRepository;
import wontouch.api.global.exception.CustomException;
import wontouch.api.global.exception.ExceptionResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final FriendRepository friendRepository;
    private final FriendRequestRepository friendRequestRepository;
    private final UserProfileRepository userProfileRepository;
    private final AvatarRepository avatarRepository;
    private final NotificationService notificationService;
    private final RedisTemplate<String, String> redisTemplate;

    @Value("${mileage.server.name}:${mileage.server.path}")
    private String mileageServerUrl;


    // 친구 목록 조회
    public List<FriendResponseDto> getFriendList(int userId) {

        // 존재하는 사용자 ID인지 검사
        userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        List<Friend> friendList = friendRepository.findByFromUserIdOrToUserId(userId, userId)
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_FRIEND_EXCEPTION));

        // Friend를 FriendResponseDto로 변환
        return friendList.stream()
                .map(friend -> convertToFriendResponseDto(friend, userId))
                .collect(Collectors.toList());
    }

    // 온라인인 친구 목록 조회
    public List<FriendResponseDto> getOnlineFriendList(int userId) {
        // 모든 친구 목록 조회
        List<FriendResponseDto> friendList = getFriendList(userId);

        // 온라인 친구만 필터링
        return friendList.stream()
                .filter(FriendResponseDto::isOnline)
                .collect(Collectors.toList());
    }

    // Friend -> FriendResponseDto 로 변환하는 메서드
    private FriendResponseDto convertToFriendResponseDto(Friend friend, int userId) {
        // 친구의 ID가 자신인지 상대인지에 따라 처리
        int friendId = (friend.getFromUserId() == userId) ? friend.getToUserId() : friend.getFromUserId();

        // 온라인 여부 조회
        String redisKey = "user_activity:" + friendId;
        Boolean isOnline = redisTemplate.hasKey(redisKey);

        // 친구의 UserProfile 조회
        UserProfile friendProfile = userProfileRepository.findByUserId(friendId)
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        // FriendResponseDto로 변환
        return FriendResponseDto.builder()
                .friendId(friendId)
                .nickname(friendProfile.getNickname())
                .description(friendProfile.getDescription())
                .characterName(getCharacterNameByUserId(friendProfile.getUserId())) // 캐릭터 이름을 가져오는 로직
                .tierPoint(getTierByUserId(friendProfile.getUserId())) // 티어를 가져오는 로직
                .isOnline(isOnline != null && isOnline)
                .build();
    }

    // 친구 신청
    public FriendRequest sendFriendRequest(SendFriendRequestDto requestDto) {

        int fromUserId = requestDto.getFromUserId();
        int toUserId = requestDto.getToUserId();

        // 이미 친구인지 확인
        if (isAlreadyFriend(fromUserId, toUserId))
            throw new ExceptionResponse(CustomException.ALREADY_FRIEND_EXCEPTION);

        // 이미 친구 요청이 있는지 확인
        if (friendRequestRepository.existsByFromUserIdAndToUserId(fromUserId, toUserId))
            throw new ExceptionResponse(CustomException.ALREADY_EXIST_REQUEST_EXCEPTION);

        FriendRequest friendRequest = FriendRequest.builder()
                .fromUserId(fromUserId)
                .toUserId(toUserId)
                .createAt(LocalDateTime.now())
                .build();

        UserProfile toUser = userProfileRepository.findByUserId(toUserId)
                        .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_PROFILE_EXCEPTION));
        notificationService.notifyFriendRequest(toUser.getNickname(), fromUserId);

        return friendRequestRepository.save(friendRequest);
    }

    // 친구 신청 목록 조회
    public List<ReceiveFriendRequestDto> getFriendRequestList(int userId) {

        List<FriendRequest> friendRequestList = friendRequestRepository.findByToUserId(userId)
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_FRIEND_REQUEST_EXCEPTION));

        List<ReceiveFriendRequestDto> receiveRequestList = friendRequestList.stream()
                .map(friendRequest -> ReceiveFriendRequestDto.builder()
                        .fromUserId(friendRequest.getFromUserId())
                        .fromUserNickname(getNicknameByUserId(friendRequest.getFromUserId()))
                        .build())
                .toList();

        return receiveRequestList;
    }

    // 친구 신청 상세 조회
    public ReceiveFriendRequestDto getFriendRequest(int fromUserId, int toUserId) {

        FriendRequest friendRequest = friendRequestRepository.findByFromUserIdAndToUserId(fromUserId, toUserId)
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_FRIEND_REQUEST_EXCEPTION));

        UserProfile userProfile = userProfileRepository.findByUserId(friendRequest.getFromUserId())
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        Avatar equippedAvatar = avatarRepository.findByUserIdAndIsEquippedIsTrue(friendRequest.getFromUserId())
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_AVATAR_EXCEPTION));

        ReceiveFriendRequestDto receiveFriendRequestDto = ReceiveFriendRequestDto.builder()
                .fromUserId(friendRequest.getFromUserId())
                .fromUserNickname(userProfile.getNickname())
                .fromUserCharacterName(equippedAvatar.getCharacterName())
                .fromUserTierPoint(getTierByUserId(friendRequest.getFromUserId()))
                .build();

        return receiveFriendRequestDto;
    }

    // 친구 신청 승인
    @Transactional
    public void acceptRequest(FriendRequestActionDto requestDto) {
        
        // 존재하는 친구 신청인지 확인
        FriendRequest friendRequest = friendRequestRepository.findByFromUserIdAndToUserId(requestDto.getFromUserId(), requestDto.getUserId())
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_FRIEND_REQUEST_EXCEPTION));

        // 현재 로그인한 유저가 toUser 인지 확인
        if (requestDto.getUserId() != friendRequest.getToUserId())
            throw new ExceptionResponse(CustomException.NOT_AUTH_ACCEPT_REQUEST_EXCEPTION);
        
        friendRequestRepository.delete(friendRequest);

        Friend friend = Friend.builder()
                .fromUserId(requestDto.getFromUserId())
                .toUserId(requestDto.getUserId())
                .build();

        friendRepository.save(friend);
        notificationService.deleteById(requestDto.getNotificationId());
    }

    // 친구 신청 거절
    public void rejectRequest(FriendRequestActionDto requestDto) {

        // 존재하는 친구 신청인지 확인
        FriendRequest friendRequest = friendRequestRepository.findByFromUserIdAndToUserId(requestDto.getFromUserId(), requestDto.getUserId())
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_FRIEND_REQUEST_EXCEPTION));

        // 현재 로그인한 유저가 toUser 인지 확인
        if (requestDto.getUserId() != friendRequest.getToUserId())
            throw new ExceptionResponse(CustomException.NOT_AUTH_ACCEPT_REQUEST_EXCEPTION);

        friendRequestRepository.delete(friendRequest);
        notificationService.deleteById(requestDto.getNotificationId());
    }


    // 친구 끊기
    public void deleteFriend(FriendDeleteRequestDto requestDto) {

        // 친구 관계인지 확인
        if (!isAlreadyFriend(requestDto.getUserId(), requestDto.getFriendId()))
            throw new ExceptionResponse(CustomException.NOT_FOUND_FRIEND_EXCEPTION);

        // 첫 번째 쿼리에서 찾으면 바로 해당 친구 삭제
        Optional<Friend> friend = friendRepository.findByFromUserIdAndToUserId(requestDto.getUserId(), requestDto.getFriendId());

        if (friend.isEmpty()) {
            // 첫 번째에서 못 찾으면 두 번째 쿼리 실행
            friend = friendRepository.findByFromUserIdAndToUserId(requestDto.getFriendId(), requestDto.getUserId());
        }

        // 친구가 없으면 예외 발생
        Friend foundFriend = friend.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_FRIEND_EXCEPTION));

        friendRepository.delete(foundFriend);
    }


    // 친구 관계 확인 유효성 검사
    private boolean isAlreadyFriend(int userId, int friendId) {

        return friendRepository.existsByFromUserIdAndToUserId(userId, friendId) ||
                friendRepository.existsByFromUserIdAndToUserId(friendId, userId);
    }


    // userId를 통한 닉네임 불러오기
    private String getNicknameByUserId(int userId) {
        UserProfile userProfile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        return userProfile.getNickname();
    }

    // 캐릭터 이름 불러오기
    private String getCharacterNameByUserId(int userId) {
        Avatar avatar = avatarRepository.findByUserIdAndIsEquippedIsTrue(userId)
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_AVATAR_EXCEPTION));

        return avatar.getCharacterName();
    }

    // 티어 불러오기
    private int getTierByUserId(int userId) {
        String tierUrl = String.format("%s/tier/total/%d", mileageServerUrl, userId);

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(tierUrl, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode jsonResponse = objectMapper.readTree(response.getBody());

                // data 필드에서 값 추출
                return jsonResponse.get("data").asInt();
            } else {
                // 추가 구현 시 에러 처리
                return 0;
            }
        } catch (Exception e) {
            // 예외 처리
            throw new ExceptionResponse(CustomException.UNHANDLED_ERROR_EXCEPTION);
        }
    }

}
