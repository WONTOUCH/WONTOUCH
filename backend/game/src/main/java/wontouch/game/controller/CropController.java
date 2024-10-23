package wontouch.game.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import wontouch.game.entity.Crop;
import wontouch.game.service.CropService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/crop")
@Slf4j
public class CropController {

    private final CropService cropService;

    public CropController(CropService cropService) {
        this.cropService = cropService;
    }

    @PostMapping
    public Crop addCrop(@RequestBody Crop crop) {
        log.debug("addCrop crop: {}", crop);
        return cropService.saveCrop(crop);
    }

    @PostMapping("/chart/{roomId}")
    public Map<Object, Object> getCropChart(@PathVariable String roomId, @RequestBody Map<String ,Object> cropInfo) {
        log.debug("getCropChart");
        Map<Object, Object> cropId = cropService.getCropChart(roomId, (String) cropInfo.get("cropId"));
        return cropId;
    }
}
