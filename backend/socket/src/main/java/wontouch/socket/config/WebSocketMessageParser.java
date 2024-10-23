package wontouch.socket.config;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

public class WebSocketMessageParser {
    private static final ObjectMapper mapper = new ObjectMapper();

    public static Map<String, Object> parseMessage(String payload) throws Exception {
        return mapper.readValue(payload, Map.class);
    }
}
