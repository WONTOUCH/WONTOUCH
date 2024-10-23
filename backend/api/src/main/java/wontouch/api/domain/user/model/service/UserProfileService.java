package wontouch.api.domain.user.model.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import wontouch.api.domain.user.dto.request.MileageSpendRequestDto;
import wontouch.api.domain.user.entity.UserProfile;
import wontouch.api.domain.user.dto.request.DescriptionUpdateRequestDto;
import wontouch.api.domain.user.dto.request.NicknameUpdateRequestDto;
import wontouch.api.domain.user.dto.request.UserProfileCreateRequestDto;
import wontouch.api.global.exception.CustomException;
import wontouch.api.global.exception.ExceptionResponse;
import wontouch.api.domain.user.model.repository.UserProfileRepository;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final UserProfileRepository userProfileRepository;

    @Value("${mileage.server.name}:${mileage.server.path}")
    private String mileageServerUrl;

    @Transactional
    public UserProfile createUserProfile(UserProfileCreateRequestDto profileCreateRequestDto) {
        UserProfile userProfile = UserProfile.builder()
                .userId(profileCreateRequestDto.getUserId())
                .nickname(profileCreateRequestDto.getNickname())
                .description(null)
                .build();

        return userProfileRepository.save(userProfile);
    }

    @Transactional
    public void updateNickname(NicknameUpdateRequestDto requestDto) {
        UserProfile userProfile = userProfileRepository.findByUserId(requestDto.getUserId())
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_PROFILE_EXCEPTION));

        // 10,000 마일리지 이상 갖고있는지 확인
        if (getTotalMileage(requestDto.getUserId()) < 10000)
            throw new ExceptionResponse(CustomException.INSUFFICIENT_MILEAGE_EXCEPTION);

        // 10,000 마일리지 사용
        purchaseByMileage(requestDto.getUserId(), 10000, "닉네임 수정");

        userProfile.updateNickname(requestDto.getNickname());
    }

    @Transactional
    public void updateDescription(DescriptionUpdateRequestDto requestDto) {
        UserProfile userProfile = userProfileRepository.findByUserId(requestDto.getUserId())
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_PROFILE_EXCEPTION));

        userProfile.updateDescription(requestDto.getDescription());
    }

    // 총 마일리지 조회 기능
    private int getTotalMileage(int userId) {
        String mileageUrl = String.format("%s/log/total/%d", mileageServerUrl, userId);

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(mileageUrl, String.class);

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

    // 마일리지 사용 로직
    private void purchaseByMileage(int userId, int amount, String description) {
        String spendMileageUrl = String.format("%s/log/spend", mileageServerUrl);

        MileageSpendRequestDto requestDto = MileageSpendRequestDto.builder()
                .userId(userId)
                .amount(amount)
                .description(description)
                .build();

        try {
            // 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");

            // dto를 JSON으로 변환
            String requestJson = objectMapper.writeValueAsString(requestDto);

            HttpEntity<String> requestEntity = new HttpEntity<>(requestJson, headers);

            // post 요청 보내기
            ResponseEntity<String> response = restTemplate.exchange(spendMileageUrl, HttpMethod.POST, requestEntity, String.class);

            // 응답 처리
            if (response.getStatusCode() == HttpStatus.CREATED) {
                // 마일리지 사용 성공 로직
                System.out.println("마일리지 사용 성공");
            } else {
                // 실패 로직
                System.out.println("마일리지 사용 실패");
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new ExceptionResponse(CustomException.UNHANDLED_ERROR_EXCEPTION);
        }
    }

}
