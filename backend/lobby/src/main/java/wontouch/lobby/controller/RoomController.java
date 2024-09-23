package wontouch.lobby.controller;

import org.springframework.beans.factory.annotation.Autowired;
<<<<<<< HEAD
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wontouch.lobby.domain.Room;
import wontouch.lobby.dto.CreateRoomRequestDto;
import wontouch.lobby.dto.JoinRequestDto;
import wontouch.lobby.dto.ResponseDto;
import wontouch.lobby.dto.RoomResponseDto;
import wontouch.lobby.service.RoomService;

import java.util.List;

=======
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import wontouch.lobby.dto.CreateRoomRequest;
import wontouch.lobby.dto.RoomDto;
import wontouch.lobby.service.RoomService;

>>>>>>> 1208bf72810ddd7108d6a2a56d1a3b9e95685dc7
@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

<<<<<<< HEAD
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
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
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
    @PostMapping("/{roomId}/join")
    public ResponseEntity<ResponseDto<RoomResponseDto>> joinGameRoom(@PathVariable String roomId, @RequestBody JoinRequestDto joinRequestDto) {
        System.out.println(joinRequestDto);
        RoomResponseDto roomResponseDto = roomService.joinRoom(roomId, joinRequestDto);
        ResponseDto<RoomResponseDto> responseDto = ResponseDto.<RoomResponseDto>builder()
                .status(HttpStatus.OK.value())
                .message("방 입장 완료")
                .data(roomResponseDto)
                .build();
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
=======
    // 방 생성 요청 처리
    @PostMapping("/create")
    public ResponseEntity<RoomDto> createRoom(@RequestBody CreateRoomRequest request) {
        System.out.println("안녕하세요");
        System.out.println(request);
        roomService.createRoom(request);
        return null;
>>>>>>> 1208bf72810ddd7108d6a2a56d1a3b9e95685dc7
    }
}
