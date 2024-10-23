import Phaser from 'phaser';
import { TileData } from './types.ts';

export const createGameMap = (scene: Phaser.Scene) => {
  const map = scene.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage(
    'spr_tileset_sunnysideworld_16px',
    'tileset',
    16,
    16,
  );

  //동물 타일셋 생성
  const birdTileset = map.addTilesetImage('bird_fast', 'bird_image', 16, 16);
  const birdTileset2 = map.addTilesetImage('bird_slow', 'bird_image', 16, 16);
  const duckTileset = map.addTilesetImage('duck_fast', 'duck_image', 16, 16);
  const duckTileset2 = map.addTilesetImage('duck_slow', 'duck_image', 16, 16);
  const chickenTileset = map.addTilesetImage(
    'chicken_fast',
    'chicken_image',
    32,
    32,
  );
  const chickenTileset2 = map.addTilesetImage(
    'chicken_slow',
    'chicken_image',
    32,
    32,
  );
  const cowTileset = map.addTilesetImage('cow_fast', 'cow_image', 32, 32);
  const cowTileset2 = map.addTilesetImage('cow_slow', 'cow_image', 32, 32);
  const pigTilewset = map.addTilesetImage('pig_fast', 'pig_image', 32, 32);
  const pigTilewset2 = map.addTilesetImage('pig_slow', 'pig_image', 32, 32);
  const sheepTileset = map.addTilesetImage('sheep_fast', 'sheep_image', 32, 32);
  const sheepTileset2 = map.addTilesetImage(
    'sheep_slow',
    'sheep_image',
    32,
    32,
  );
  const blinkingTileset = map.addTilesetImage(
    'blinking',
    'blinking_image',
    16,
    16,
  );

  //식물 풍차 타일 생성
  const mushroomBlueTileset = map.addTilesetImage(
    'mushroom_blue_01',
    'mushroom_blue_01_image',
    16,
    16,
  );
  const mushroomBlueTileset2 = map.addTilesetImage(
    'mushroom_blue_02',
    'mushroom_blue_02_image',
    16,
    16,
  );
  const mushroomBlueTileset3 = map.addTilesetImage(
    'mushroom_blue_03',
    'mushroom_blue_03_image',
    16,
    16,
  );
  const mushroomRedTileset = map.addTilesetImage(
    'mushroom_red',
    'mushroom_red_01_image',
    16,
    16,
  );
  const windmillTileset = map.addTilesetImage(
    'windmill_withshadow',
    'windmill_image',
    112,
    112,
  );

  //연기
  const chimneysmokeTileset_01 = map.addTilesetImage(
    'chimneysmoke_01',
    'chimneysmoke_01_01_image',
    15,
    47,
  );
  const chimneysmokeTileset4_01 = map.addTilesetImage(
    'chimneysmoke_04',
    'chimneysmoke_04_01_image',
    20,
    42,
  );
  const chimneysmokeTileset5_01 = map.addTilesetImage(
    'chimneysmoke_05',
    'chimneysmoke_05_01_image',
    24,
    32,
  );

  //충돌
  const collidesTileset = map.addTilesetImage('collides', 'collides', 16, 16);

  if (
    !tileset ||
    !birdTileset ||
    !collidesTileset ||
    !birdTileset2 ||
    !duckTileset ||
    !duckTileset2 ||
    !chickenTileset ||
    !chickenTileset2 ||
    !pigTilewset ||
    !pigTilewset2 ||
    !cowTileset ||
    !cowTileset2 ||
    !sheepTileset ||
    !sheepTileset2 ||
    !blinkingTileset ||
    !mushroomBlueTileset ||
    !mushroomBlueTileset2 ||
    !mushroomBlueTileset3 ||
    !mushroomRedTileset ||
    !windmillTileset ||
    !chimneysmokeTileset_01 ||
    !chimneysmokeTileset4_01 ||
    !chimneysmokeTileset5_01
  ) {
    console.error('불러올 수 없음');
    return;
  }

  const backgroundLayer = map.createLayer('Background', tileset) || null;
  const groundLayer = map.createLayer('ground', tileset) || null;
  const seaLayer = map.createLayer('seasea', tileset) || null;
  const shadow_seaLayer = map.createLayer('Shadow_sea', tileset) || null;
  const river_lakeLayer = map.createLayer('river, lake', tileset) || null;
  const dropfruitsLayer = map.createLayer('dropfruits', tileset) || null;
  const fencesLayer = map.createLayer('fences', tileset) || null;
  const plantLayer = map.createLayer('wheat, animal, tree, line', tileset) || null;
  const othersssLayer = map.createLayer('othersss', tileset) || null;
  const animals_bottomLayer = map.createLayer('animals_bottom', [
    birdTileset,
    birdTileset2,
    duckTileset,
    duckTileset2,
    chickenTileset,
    chickenTileset2,
    cowTileset,
    cowTileset2,
    sheepTileset,
    sheepTileset2,
    blinkingTileset,
  ]) || null;
  const vegetableLayer = map.createLayer('fruits, vegetables', tileset) || null;
  const shadow_bottomLayer = map.createLayer('Shadow_bottom', tileset) || null;
  const house_bottom2Layer = map.createLayer('house_bottom2', tileset) || null;
  const house_bottomLayer = map.createLayer('house_bottom', tileset) || null;
  const house_topLayer = map.createLayer('house_top', [
    tileset,
    chimneysmokeTileset_01,
    chimneysmokeTileset4_01,
    chimneysmokeTileset5_01,
  ]) || null;
  const shadow_topLayer = map.createLayer('Shadow_top', tileset) || null;
  const animals_topLayer = map.createLayer('animals_top', [
    birdTileset,
    birdTileset2,
    duckTileset,
    duckTileset2,
    chickenTileset,
    chickenTileset2,
    cowTileset,
    cowTileset2,
    sheepTileset,
    sheepTileset2,
    pigTilewset,
    pigTilewset2,
    windmillTileset,
  ]) || null;
  const collidesLayer = map.createLayer('collides/notpass', collidesTileset) || null;
  const house1Layer = map.createLayer('collides/house_01', collidesTileset) || null;
  const house2Layer = map.createLayer('collides/house_02', collidesTileset) || null;
  const house3Layer = map.createLayer('collides/house_03', collidesTileset) || null;
  const house4Layer = map.createLayer('collides/house_04', collidesTileset) || null;
  const house5Layer = map.createLayer('collides/house_05', collidesTileset) || null;
  const house6Layer = map.createLayer('collides/house_06', collidesTileset) || null;
  const exchangeLayer = map.createLayer('collides/exchange', collidesTileset) || null;
  collidesLayer?.setCollisionByProperty({ collides: true });



  const tileAnimations = map.tilesets[0].tileData as TileData;
  Object.keys(tileAnimations).forEach((tileIdKey) => {
    const tileId = parseInt(tileIdKey, 10);

    if (tileAnimations[tileId] && tileAnimations[tileId].animation) {
      const animationFrames = tileAnimations[tileId].animation.map(
        (frame) => frame.tileid,
      );
      let frameIndex = 0;

      scene.time.addEvent({
        delay: tileAnimations[tileId].animation[0].duration,
        callback: () => {
          [seaLayer, othersssLayer].forEach((layer) => {
            layer?.replaceByIndex(
              animationFrames[frameIndex],
              animationFrames[(frameIndex + 1) % animationFrames.length],
            );
          });
          frameIndex = (frameIndex + 1) % animationFrames.length;
        },
        loop: true,
      });
    }
  });

  //레이어 층 결정하는 부분
  backgroundLayer?.setDepth(-3);
  seaLayer?.setDepth(-2);
  shadow_seaLayer?.setDepth(-2);
  groundLayer?.setDepth(-1);
  river_lakeLayer?.setDepth(0);
  dropfruitsLayer?.setDepth(0);
  fencesLayer?.setDepth(0);
  plantLayer?.setDepth(0);
  othersssLayer?.setDepth(0);
  animals_bottomLayer?.setDepth(0);
  vegetableLayer?.setDepth(0);
  shadow_bottomLayer?.setDepth(0);
  house_bottom2Layer?.setDepth(1);
  house_bottomLayer?.setDepth(1);
  house_topLayer?.setDepth(1);
  shadow_topLayer?.setDepth(1);
  animals_topLayer?.setDepth(1);
  collidesLayer?.setDepth(-4);


  return {
    backgroundLayer,
    groundLayer,
    animals_topLayer,
    animals_bottomLayer,
    collidesLayer,
    shadow_seaLayer,
    river_lakeLayer,
    dropfruitsLayer,
    fencesLayer,
    plantLayer,
    vegetableLayer,
    shadow_topLayer,
    house_bottom2Layer,
    house_bottomLayer,
    house_topLayer,
    shadow_bottomLayer,
    house1Layer,
    house2Layer,
    house3Layer,
    house4Layer,
    house5Layer,
    house6Layer,
    exchangeLayer,
  };
};
