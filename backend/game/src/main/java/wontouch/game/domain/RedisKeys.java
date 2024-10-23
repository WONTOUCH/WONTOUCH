package wontouch.game.domain;

public final class RedisKeys {
    private RedisKeys() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }

    // 상수 값 정의
    public static final String GAME_PREFIX = "game:";
    public static final String ROOM_SUFFIX = ":room";
    public static final String PLAYER_PREFIX = "player:";
    public static final String PLAYER_SUFFIX = ":player";
    public static final String CROP_INFIX = ":crop:";
    public static final String CROP_SUFFIX = ":crop";
    public static final String ARTICLE_SUFFIX = ":article";
    public static final String INFO_SUFFIX = ":info";
}
