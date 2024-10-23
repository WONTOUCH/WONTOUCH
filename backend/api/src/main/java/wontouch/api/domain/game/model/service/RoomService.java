package wontouch.api.domain.game.model.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import wontouch.api.domain.game.dto.response.RoomInviteResponseDto;
import wontouch.api.domain.notification.dto.request.GameInviteRequestDto;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${lobby.server.name}:${lobby.server.path}")
    private String lobbyServerUrl;

    public GameInviteRequestDto inviteFriend(GameInviteRequestDto requestDto) {
        // lobby 서버에서 roomId를 통해 Room 정보 불러오기
        String lobbyUrl = String.format("%s/rooms/invite-info/%s", lobbyServerUrl, requestDto.getRoomId());

        try {
            // RestTemplate을 통해 lobby 서버의 게임방 정보를 가져옴
            ResponseEntity<String> response = restTemplate.getForEntity(lobbyUrl, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                // JSON 응답에서 RoomInviteResponseDto 추출
                JsonNode jsonResponse = objectMapper.readTree(response.getBody());

                RoomInviteResponseDto inviteResponseDto = RoomInviteResponseDto.builder()
                        .roomId(jsonResponse.get("data").get("roomId").asText())
                        .roomName(jsonResponse.get("data").get("roomName").asText())
                        .password(jsonResponse.get("data").get("password").asText())
                        .build();

                // 초대 알림을 위한 로직 작성 (Notification 저장 및 SSE 전송 등)
                long senderId = requestDto.getSenderId();
                long receiverId = requestDto.getReceiverId();

                return GameInviteRequestDto.builder()
                        .senderId(senderId)
                        .receiverId(receiverId)
                        .roomId(inviteResponseDto.getRoomId())
                        .roomName(inviteResponseDto.getRoomName())
                        .password(inviteResponseDto.getPassword())
                        .build();
            } else {
                throw new RuntimeException("Failed to fetch room information from lobby server");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error occurred while fetching room information");
        }
    }
}
