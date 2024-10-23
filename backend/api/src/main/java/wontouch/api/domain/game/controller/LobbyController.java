package wontouch.api.domain.game.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import wontouch.api.global.dto.ResponseDto;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/lobby")
@Slf4j
public class LobbyController {
    private final RestTemplate restTemplate = new RestTemplate();

    // 로비서버 기본 주소
    @Value("${lobby.server.name}:${lobby.server.path}")
    private String lobbyServerUrl;

    public LobbyController() {
    }
    // 게임방 목록 조회(페이지네이션)
    @GetMapping("/list")
    public ResponseEntity<ResponseDto<?>> getGameRoomList(Pageable pageable) {
        String targetUrl = lobbyServerUrl + "/lobby/list";

        URI uri = UriComponentsBuilder.fromHttpUrl(targetUrl)
                .queryParam("page", pageable.getPageNumber())
                .queryParam("size", pageable.getPageSize())
                // 정렬 조건 추가
                .queryParam("sort", getSortParameters(pageable.getSort()))
                .build()
                .encode()
                .toUri();

        // 로비 서버로 GET 요청 보내기
        ResponseDto response = restTemplate.getForObject(uri, ResponseDto.class);
        log.debug("response: {}", response.toString());
        return ResponseEntity.ok(response);
    }

    // 정렬 조건을 쿼리 파라미터로 변환하는 헬퍼 메서드
    private List<String> getSortParameters(Sort sort) {
        List<String> sortParams = new ArrayList<>();
        for (Sort.Order order : sort) {
            sortParams.add(order.getProperty() + "," + order.getDirection().name());
        }
        return sortParams;
    }

}
