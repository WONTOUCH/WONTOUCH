package wontouch.lobby.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wontouch.lobby.dto.*;
import wontouch.lobby.service.RoomService;

@RestController
@RequestMapping("/rooms")
@Slf4j
public class RoomController {

    private final RoomService roomService;

    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // 방 생성 요청 처리
    @PostMapping("/create")
    public ResponseEntity<ResponseDto<RoomResponseDto>> createGameRoom(@RequestBody CreateRoomRequestDto request) {
        System.out.println("안녕하세요");
        System.out.println(request);
        RoomResponseDto room = roomService.createRoom(request);
        ResponseDto<RoomResponseDto> responseDto = ResponseDto.<RoomResponseDto>builder()
                .status(HttpStatus.CREATED.value())
                .message("방 생성 완료")
                .data(room)
                .build();
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    // 방 입장
    @PostMapping("/join/{roomId}")
    public ResponseEntity<ResponseDto<RoomResponseDto>> joinGameRoom(@PathVariable String roomId, @RequestBody RoomRequestDto roomRequestDto) {
        log.debug("roomId: {}, {}", roomId, roomRequestDto);
        RoomResponseDto roomResponseDto = roomService.joinRoom(roomId, roomRequestDto);
        ResponseDto<RoomResponseDto> responseDto = ResponseDto.<RoomResponseDto>builder()
                .status(HttpStatus.OK.value())
                .message("방 입장 완료")
                .data(roomResponseDto)
                .build();
        log.debug("입장 정보 전달: {}", responseDto);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PostMapping("/quick-join")
    public ResponseEntity<ResponseDto<RoomResponseDto>> quickJoinGameRoom(@RequestBody RoomRequestDto roomRequestDto) {
        System.out.println(roomRequestDto);
        RoomResponseDto roomResponseDto = roomService.quickJoin(roomRequestDto);
        ResponseDto<RoomResponseDto> responseDto = ResponseDto.<RoomResponseDto>builder()
                .status(HttpStatus.OK.value())
                .message("방 입장 완료")
                .data(roomResponseDto)
                .build();
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PostMapping("/exit/{roomId}")
    public ResponseEntity<ResponseDto<RoomResponseDto>> exitGameRoom(@PathVariable String roomId, @RequestBody RoomRequestDto roomRequestDto) {
        long playerId = roomRequestDto.getPlayerId();
        log.info("roomId:{} playerId:{} ", roomId, playerId);
        RoomResponseDto roomResponseDto = roomService.exitRoom(roomId, playerId);
        ResponseDto<RoomResponseDto> responseDto = ResponseDto.<RoomResponseDto>builder()
                .status(HttpStatus.OK.value())
                .message("방 퇴장 완료")
                .data(roomResponseDto)
                .build();
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @GetMapping("/info/{roomId}")
    public ResponseDto<RoomResponseDto> getRoomInfo(@PathVariable String roomId) {
        RoomResponseDto roomInfo = roomService.getRoomInfo(roomId);
        return ResponseDto.<RoomResponseDto>builder()
                .status(HttpStatus.OK.value())
                .message("조회 완료")
                .data(roomInfo)
                .build();
    }

    @GetMapping("/invite-info/{roomId}")
    public ResponseEntity<?> inviteFriend(@PathVariable String roomId) {
        RoomInviteResponseDto inviteResponseDto = roomService.inviteFriend(roomId);

        ResponseDto<Object> responseDto = ResponseDto.<Object>builder()
                .status(HttpStatus.OK.value())
                .message("게임방 정보 조회 성공")
                .data(inviteResponseDto)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
}
