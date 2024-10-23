export interface GameParticipant {
  userId: number;
  email?: string;
  nickname: string;
  description: string | null;
  characterName: string;
  tierPoint: number;
  mileage: number;
}

export interface MapLayers {
  backgroundLayer: Phaser.Tilemaps.TilemapLayer | null;
  groundLayer: Phaser.Tilemaps.TilemapLayer | null;
  animals_topLayer: Phaser.Tilemaps.TilemapLayer | null;
  animals_bottomLayer: Phaser.Tilemaps.TilemapLayer | null;
  collidesLayer: Phaser.Tilemaps.TilemapLayer | null;
  shadow_seaLayer: Phaser.Tilemaps.TilemapLayer | null;
  river_lakeLayer: Phaser.Tilemaps.TilemapLayer | null;
  dropfruitsLayer: Phaser.Tilemaps.TilemapLayer | null;
  fencesLayer: Phaser.Tilemaps.TilemapLayer | null;
  plantLayer: Phaser.Tilemaps.TilemapLayer | null;
  vegetableLayer: Phaser.Tilemaps.TilemapLayer | null;
  shadow_topLayer: Phaser.Tilemaps.TilemapLayer | null;
  house_bottom2Layer: Phaser.Tilemaps.TilemapLayer | null;
  house_bottomLayer: Phaser.Tilemaps.TilemapLayer | null;
  house_topLayer: Phaser.Tilemaps.TilemapLayer | null;
  shadow_bottomLayer: Phaser.Tilemaps.TilemapLayer | null;
  house1Layer: Phaser.Tilemaps.TilemapLayer | null;
  house2Layer: Phaser.Tilemaps.TilemapLayer | null;
  house3Layer: Phaser.Tilemaps.TilemapLayer | null;
  house4Layer: Phaser.Tilemaps.TilemapLayer | null;
  house5Layer: Phaser.Tilemaps.TilemapLayer | null;
  house6Layer: Phaser.Tilemaps.TilemapLayer | null;
  exchangeLayer: Phaser.Tilemaps.TilemapLayer | null;
}

export interface DecodedToken {
  userId: number;
}

export interface Crop {
  id: string;
  type: string;
  name: string;
  price: number;
  description: string;
  imgUrl: string;
}

export interface GameState {
  roundDuration: number;
  roundNumber: number;
  crops: Crop[];
}

export interface CropList {
  [cropName: string]: number;
}

export interface DataChart {
  [roundNum: number]: number;
}

export interface ModalProps {
  houseNum: number | null;
  closeModal: () => void;
  gameSocket: WebSocket | null;
  cropList?: CropList | null; // null을 허용
  dataChart?: DataChart | null;
}

export interface MapProps {
  closeMapModal: () => void;
}

// 애니메이션 프레임에 대한 타입 정의
export interface TileAnimationFrame {
  duration: number;
  tileid: number;
}

// 타일 애니메이션 정보에 대한 타입 정의
export interface TileAnimationData {
  animation: TileAnimationFrame[];
}

// 전체 타일셋 데이터에 대한 타입 정의
export interface TileData {
  [key: number]: TileAnimationData;
}

export interface ResultModalProps {
  round: number;
  onNextRound: () => void;
}

// ArticleInfo 타입 정의 (info 객체의 구조)
export interface ArticleInfo {
  id: string;
  crop: string;
  aspect: string;
  title: string;
  body: string;
  author: string;
  future_articles: string | null;
}

// Article 타입 정의
export interface Article {
  type: string;
  info: ArticleInfo | null; // info 속성 추가, null일 수 있으므로 | null 처리
  town: string;
  playerGold: number;
}

export interface ArticleResult {
  title: string;
  body: string;
  author: string;
  change_rate: number;
  spawn_rate: number;
  sub_crops: Array<{ id: string; name: string; change_rate: number }>;
}

export interface ArticleState {
  purchasedArticles: ArticleResult[];
  articleResults: ArticleResult[]; // 새로운 상태 추가
}

export interface CropPriceMap {
  [cropName: string]: number;
}

export interface CropResultState {
  originPriceMap: CropPriceMap;
  newPriceMap: CropPriceMap;
}

export interface Message {
  type: string;
  content: {
    type: string;
    message: string;
    playerId: string;
  };
}

export interface TimeState {
  duration: number;
  round: number;
  timerRunning: boolean;
  preparationTime: number; // 대기시간을 위한 상태 추가
  isPreparation: boolean; // 대기시간이 진행 중인지 여부
}

export interface Crop {
  id: string;
  type: string;
  name: string;
  price: number;
  description: string;
  imgUrl: string;
}

export interface CropsState {
  crops: Crop[];
}

export interface CropQuantity {
  id: string;
  quantity: number;
  count: number;
}

export interface CropQuantityState {
  cropsQuantities: CropQuantity[];
}

export interface Message {
  type: string;
  content: {
    type: string;
    message: string;
    playerId: string;
  };
}
