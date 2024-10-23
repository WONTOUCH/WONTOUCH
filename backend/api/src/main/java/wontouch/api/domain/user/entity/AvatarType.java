package wontouch.api.domain.user.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import wontouch.api.global.exception.CustomException;
import wontouch.api.global.exception.ExceptionResponse;

@Getter
@AllArgsConstructor
public enum AvatarType {
    BOY("boy", "남자아이", 0),
    GIRL("girl", "여자아이", 0),
    GOBLIN("goblin", "고블린", 1500),
    SKELETON("skeleton", "해골",  2500),
    CURLYHAIR_BOY("curlyhair_boy", "파마머리 남자", 2500),
    FLOWER_GIRL("flower_girl", "꽃을 든 여자", 2500),
    KING_GOBLIN("king_goblin", "킹 고블린", 4500),
    NINJA_SKELETON("ninja_skeleton", "닌자 해골", 5000),
    ;

    private String name;
    private String description;
    private int price;

    public static AvatarType getByCharacterName(String characterName) {
        for (AvatarType avatarType : AvatarType.values()) {
            if (avatarType.getName().equals(characterName))
                return avatarType;
        }
        throw new ExceptionResponse(CustomException.NOT_FOUND_AVATAR_EXCEPTION);
    }

}
