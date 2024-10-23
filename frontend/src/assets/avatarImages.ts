import boy from './background/characters/stand/boy.png';
import curlyhairBoy from './background/characters/stand/curlyhair_boy.png';
import flowerGirl from './background/characters/stand/flower_girl.png';
import girl from './background/characters/stand/girl.png';
import goblin from './background/characters/stand/goblin.png';
import kingGoblin from './background/characters/stand/king_goblin.png';
import ninjaSkeleton from './background/characters/stand/ninja_skeleton.png';
import skeleton from './background/characters/stand/skeleton.png';

// 걷는 이미지
import boyWalk from './background/characters/walk/boy.gif';
import curlyhairBoyWalk from './background/characters/walk/curlyhair_boy.gif';
import flowerGirlWalk from './background/characters/walk/flower_girl.gif';
import girlWalk from './background/characters/walk/girl.gif';
import goblinWalk from './background/characters/walk/goblin.gif';
import kingGoblinWalk from './background/characters/walk/king_goblin.gif';
import ninjaSkeletonWalk from './background/characters/walk/ninja_skeleton.gif';
import skeletonWalk from './background/characters/walk/skeleton.gif';

const characterImages: { [key: string]: string } = {
  boy: boy,
  curlyhair_boy: curlyhairBoy,
  flower_girl: flowerGirl,
  girl: girl,
  goblin: goblin,
  king_goblin: kingGoblin,
  ninja_skeleton: ninjaSkeleton,
  skeleton: skeleton,
};

const walkImages: { [key: string]: string } = {
  boy: boyWalk,
  curlyhair_boy: curlyhairBoyWalk,
  flower_girl: flowerGirlWalk,
  girl: girlWalk,
  goblin: goblinWalk,
  king_goblin: kingGoblinWalk,
  skeleton: skeletonWalk,
  ninja_skeleton: ninjaSkeletonWalk,
};

export { characterImages, walkImages };
