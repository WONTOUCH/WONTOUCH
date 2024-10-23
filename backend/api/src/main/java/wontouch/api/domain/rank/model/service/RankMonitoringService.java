package wontouch.api.domain.rank.model.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import wontouch.api.domain.rank.dto.response.RankListResponseDto;
import wontouch.api.domain.user.entity.UserProfile;
import wontouch.api.domain.user.model.repository.UserProfileRepository;
import wontouch.api.global.exception.CustomException;
import wontouch.api.global.exception.ExceptionResponse;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RankMonitoringService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final UserProfileRepository userProfileRepository;

    @Value("${mileage.server.name}:${mileage.server.path}")
    private String mileageServerUrl;

    /**
     * 티어 포인트에 따른 상위 랭킹 조회
     */
    public List<RankListResponseDto> getRankList(int size) {
        List<UserProfile> userProfiles = userProfileRepository.findAll();

        List<RankListResponseDto> rankList = new ArrayList<>();
        for (UserProfile userProfile : userProfiles) {
            // 월요일 자정 이후의 티어 포인트 불러오기
            int tierPoint = getTotalTierPointSinceMonday(userProfile.getUserId());

            RankListResponseDto rankListResponseDto = RankListResponseDto.builder()
                    .userId(userProfile.getUserId())
                    .nickname(userProfile.getNickname())
                    .tierPoint(tierPoint)
                    .build();

            rankList.add(rankListResponseDto);
        }

        // tierPoint 기준으로 내림차순 정렬
        rankList.sort(Comparator.comparingInt(RankListResponseDto::getTierPoint).reversed());

        // 정렬된 리스트에 rank 추가
        for (int i = 0; i < rankList.size(); i++) {
            rankList.get(i).setRank(i + 1);  // 순위는 1부터 시작
        }

        // 필요한 사이즈 만큼 잘라서 반환
        return rankList.stream().limit(size).collect(Collectors.toList());
    }

    /**
     * 월요일 자정 이후 적립된 티어 포인트 가져오기
     */
    private int getTotalTierPointSinceMonday(int userId) {
        String tierUrl = String.format("%s/tier/total/since-monday/%d", mileageServerUrl, userId);

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

    // 임시 작업
    @Scheduled(cron = "0 0 0 * * MON")
    public void monitorTierPoints() {
        // 모니터링 로직 추가
        List<RankListResponseDto> rankList = getRankList(10); // 상위 10명 조회 예시
        // 모니터링 결과를 저장하거나 로그로 기록하는 등의 추가 작업을 수행할 수 있음
        System.out.println("모니터링된 랭킹 리스트: " + rankList);
    }
}
