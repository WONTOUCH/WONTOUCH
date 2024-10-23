package wontouch.game.service.game;

import org.springframework.data.redis.core.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static wontouch.game.domain.RedisKeys.GAME_PREFIX;

@Service
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;

    public RedisService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }


    public List<String> scanKeys(String pattern) {

        ScanOptions build = KeyScanOptions.scanOptions().match(pattern).count(100).build();
        // 스캔하여 찾은 키를 저장할 리스트
        List<String> findKeys = new ArrayList<>();

        // RedisTemplate의 execute 메서드를 사용하여 scan 명령 수행
        redisTemplate.execute((RedisCallback<Void>) connection -> {
            Cursor<byte[]> cursor = connection.scan(build);
            cursor.forEachRemaining(key -> findKeys.add(new String(key)));
            return null;
        });
        return findKeys;
    }

    public void deleteGameKeysByPattern(String roomId) {
        String pattern = GAME_PREFIX + roomId + "*";
        try {
            List<String> keys = scanKeys(pattern);
            System.out.println(keys);
            if (!keys.isEmpty()) {
                redisTemplate.delete(keys);
            }
        } catch (Exception e) {
            // 필요 시 예외 처리 로직 추가
            System.err.println("Failed to delete keys for pattern: " + pattern);
            e.printStackTrace();
        }
    }
}
