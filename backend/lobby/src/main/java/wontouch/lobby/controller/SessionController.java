package wontouch.lobby.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import wontouch.lobby.dto.SessionDeleteDto;
import wontouch.lobby.dto.SessionSaveDto;
import wontouch.lobby.service.RoomService;

@RestController
@RequestMapping("/api/session")
@Slf4j
public class SessionController {

    private final RoomService roomService;

    @Autowired
    public SessionController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping("/save")
    public void save(@RequestBody SessionSaveDto session) {
        roomService.addSession(session);
    }

    @PostMapping("/remove")
    public void remove(@RequestBody SessionDeleteDto session) {
        try {
            log.debug("Removing session: {}", session);
            roomService.removeSession(session);
            log.debug("Removed session: {}", session);
        }catch (Exception e) {
            log.error(e.getMessage());
        }
    }
}
