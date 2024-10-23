package wontouch.game.repository.crop;

import java.util.List;

public interface CropCustomRepository {
    List<String> findDistinctTypes();
}
