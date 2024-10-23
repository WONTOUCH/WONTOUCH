package wontouch.socket.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import wontouch.socket.service.SocketServerService;
import wontouch.socket.service.WebSocketSessionService;

@Configuration
@EnableWebSocket
@Slf4j
public class WebSocketConfig implements WebSocketConfigurer {

    private final WebSocketSessionService sessionService;
    private final SocketServerService socketServerService;
    private final MessageHandlerFactory messageHandlerFactory;

    public WebSocketConfig(WebSocketSessionService sessionService, MessageHandlerFactory messageHandlerFactory, SocketServerService socketServerService) {
        this.sessionService = sessionService;
        this.socketServerService = socketServerService;
        this.messageHandlerFactory = messageHandlerFactory;
    }

    @Bean
    public GameWebSocketHandler gameWebSocketHandler() {
        log.info("game handler register");
        return
                new GameWebSocketHandler(sessionService,
                        socketServerService, messageHandlerFactory); // Bean으로 직접 등록
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(gameWebSocketHandler(), "ws/game/{roomId}").setAllowedOrigins("*");
    }
}
