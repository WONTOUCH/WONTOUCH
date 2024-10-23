package wontouch.game.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import wontouch.game.dto.town.CropTransactionRequestDto;
import wontouch.game.dto.town.CropTransactionResult;
import wontouch.game.service.CropService;
import wontouch.game.service.TownService;

import java.util.Map;

@RestController
@RequestMapping("/town")
@Slf4j
public class TownController {

    private final TownService townService;
    private final CropService cropService;

    public TownController(TownService townService, CropService cropService) {
        this.townService = townService;
        this.cropService = cropService;
    }

    // 작물 구매
    @PostMapping("/buy/crop/{roomId}")
    public CropTransactionResult buyCrops(@PathVariable String roomId, @RequestBody CropTransactionRequestDto requestDto) {
        CropTransactionResult cropTransactionResult = townService.buyCrop(roomId, requestDto);
        log.debug("거래 완료 {}", cropTransactionResult);
        return cropTransactionResult;
    }

    // 작물 판매
    @PostMapping("/sell/crop/{roomId}")
    public CropTransactionResult sellCrops(@PathVariable String roomId, @RequestBody CropTransactionRequestDto requestDto) {
        CropTransactionResult cropTransactionResult = townService.sellCrop(roomId, requestDto);
        log.debug("거래 완료 {}", cropTransactionResult);
        return cropTransactionResult;
    }

    // 마을의 작물 조회
    @GetMapping("/crop/list/{roomId}/{type}")
    public Map<Object, Object> getCrops(@PathVariable String roomId, @PathVariable String type) {
        return cropService.getTownCropList(roomId, type);
    }
}
