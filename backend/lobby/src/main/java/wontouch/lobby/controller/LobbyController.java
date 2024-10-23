package wontouch.lobby.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import wontouch.lobby.dto.ResponseDto;
import wontouch.lobby.dto.RoomResponseDto;
import wontouch.lobby.service.RoomService;

import java.util.List;

@RestController
@RequestMapping("/lobby")
@Slf4j
public class LobbyController {

    private final RoomService roomService;

    @Autowired
    public LobbyController(RoomService roomService) {
        this.roomService = roomService;
    }

    // 방 목록 조회
    @GetMapping("/list")
    public ResponseEntity<ResponseDto<List<RoomResponseDto>>> getGameRoomList(Pageable pageable) {
        System.out.println("HELLO LIST!!!");
        System.out.println(pageable);
        List<RoomResponseDto> roomByPage = roomService.findRoomByPage(pageable);
//        Page<RoomResponseDto> response = rooms.map(RoomResponseDto::fromEntity);
        ResponseDto<List<RoomResponseDto>> responseDto = ResponseDto.<List<RoomResponseDto>>builder()
                .status(HttpStatus.OK.value())
                .message("게임방 목록 조회 완료")
                .data(roomByPage)
                .build();

        log.debug("response: {}", responseDto);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
}
