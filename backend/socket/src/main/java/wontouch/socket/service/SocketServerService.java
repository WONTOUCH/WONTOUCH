package wontouch.socket.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import wontouch.socket.dto.MessageType;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

@Service
@Slf4j
public class SocketServerService {
    // 다른 서버를 거치지 않는 소켓 서버 내의 로직들

    private static final int MAP_WIDTH = 4480;
    private static final int MAP_HEIGHT = 2560;

    private final WebSocketSessionService sessionService;
    private final Map<String, ReentrantLock> playerLocks = new ConcurrentHashMap<>();

    public SocketServerService(WebSocketSessionService sessionService) {
        this.sessionService = sessionService;
    }

    public Object moveUser(String roomId, String playerId, Map<String, Object> msgMap) throws IOException {
        playerLocks.putIfAbsent(playerId, new ReentrantLock());
        ReentrantLock lock = playerLocks.get(playerId);

        lock.lock();
        try {
            int newDir = (Integer) msgMap.get("dir");
            int newX = (Integer) msgMap.get("x");
            int newY = (Integer) msgMap.get("y");

            if (isValidMove(newX, newY)) {
                // 방에 있는 다른 플레이어들에게 브로드캐스트
                Map<String, Object> moveMessage = new HashMap<>();
                moveMessage.put("playerId", playerId);
                moveMessage.put("dir", newDir);
                moveMessage.put("x", newX);
                moveMessage.put("y", newY);
                sessionService.broadcastMessage(roomId, MessageType.MOVE, moveMessage);
                return moveMessage;
            }
        } finally {
            lock.unlock();
        }
        return null;
    }

    private boolean isValidMove(int x, int y) {
        return (x >= 0 && y >= 0 && x <= MAP_WIDTH && y <= MAP_HEIGHT);
    }

    // 플레이어가 방을 떠날 때 락 제거
    public void removePlayerLock(String playerId) {
        playerLocks.remove(playerId);
        log.debug("Lock removed for playerId: {}", playerId);
    }
}
