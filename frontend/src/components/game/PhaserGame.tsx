import Phaser from 'phaser';
import { useEffect, useRef, useState } from 'react';
import { createGameMap } from './GameMap';
import { createPlayerMovement } from './PlayerMovement';
import InteractionModal from './InteractionModal';
import MapModal from './MapModal';
//import ResultModal from './ResultModal';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setUserId } from '../../redux/slices/userSlice';
import { setToken } from '../../redux/slices/authSlice';
import { jwtDecode } from 'jwt-decode';
import Modal from '../common/Modal';
import AlertModal from '../common/AlertModal';
import SuccessModal from '../common/SuccessModal';

//캐릭터
import boy from '../../assets/background/characters/move/boy.png';
import curlyhairBoy from '../../assets/background/characters/move/curlyhair_boy.png';
import flowerGirl from '../../assets/background/characters/move/flower_girl.png';
import girl from '../../assets/background/characters/move/girl.png';
import goblin from '../../assets/background/characters/move/goblin.png';
import kingGoblin from '../../assets/background/characters/move/king_goblin.png';
import ninjaSkeleton from '../../assets/background/characters/move/ninja_skeleton.png';
import skeleton from '../../assets/background/characters/move/skeleton.png';

// 타일맵 및 타일셋
import tileset from '../../assets/background/spr_tileset_sunnysideworld_16px.png';

// 동물들 텍스처
import birdImage from '../../assets/background/animals/spr_deco_bird_01_strip4.png';
import blinkingImage from '../../assets/background/animals/spr_deco_blinking_strip12.png';
import chickenImage from '../../assets/background/animals/spr_deco_chicken_01_strip4.png';
import cowImage from '../../assets/background/animals/spr_deco_cow_strip4.png';
import duckImage from '../../assets/background/animals/spr_deco_duck_01_strip4.png';
import pigImage from '../../assets/background/animals/spr_deco_pig_01_strip4.png';
import sheepImage from '../../assets/background/animals/spr_deco_sheep_01_strip4.png';

// 식물, 풍차 등
import mushroomBlue01Image from '../../assets/background/others/spr_deco_mushroom_blue_01_strip4.png';
import mushroomBlue02Image from '../../assets/background/others/spr_deco_mushroom_blue_02_strip4.png';
import mushroomBlue03Image from '../../assets/background/others/spr_deco_mushroom_blue_03_strip4.png';
import mushroomRed01Image from '../../assets/background/others/spr_deco_mushroom_red_01_strip4.png';
import windmillImage from '../../assets/background/others/spr_deco_windmill_withshadow_strip9.png';

// 연기
import chimneySmoke01Image from '../../assets/background/others/chimneysmoke_01_strip30_01.png';
import chimneySmoke04Image from '../../assets/background/others/chimneysmoke_04_strip30_01.png';
import chimneySmoke05Image from '../../assets/background/others/chimneysmoke_05_strip30_01.png';

// 충돌 관련 이미지
import collidesImage from '../../assets/background/collides.png';
import { addArticle, clearArticles } from '../../redux/slices/articleSlice';
import {
  addArticleResult,
  clearArticleResults,
} from '../../redux/slices/articleResultSlice';
import { updateCropPrices } from '../../redux/slices/cropResultSlice';
import { DecodedToken, GameParticipant, MapLayers } from './types';
import TimerModal from './TimerModal';
import {
  setPreparationStart,
  setRoundStart,
} from '../../redux/slices/timeSlice';
import ResultModal from './ResultModal';
import { clearCrops, updateCrop } from '../../redux/slices/cropQuantitySlice';
import { setGameResult } from '../../redux/slices/gameResultSlice';
import GameResultModal from './GameResultModal';
import BalanceDisplay from './BalanceDisplay';
import { clearBalance, updateBalance } from '../../redux/slices/balanceSlice';
import {
  setPlayerCrops,
  updateCropAmount,
} from '../../redux/slices/playerCropSlice';
import PlayerCropModal from './PlayerCropModal';
import { setChartData } from '../../redux/slices/chartSlice';
import GameChat from './GameChat';

interface ChatMessage {
  playerId: string;
  message: string;
}

const PhaserGame = () => {
  const navigation = useNavigate();
  const SOCKET_LINK = import.meta.env.VITE_SOCKET_URL;

  const [houseNum, setHouseNum] = useState<number | null>(null);
  const [openMap, setOpenMap] = useState<boolean>(false);
  const houseNumRef = useRef<number | null>(houseNum);

  const [showModal, setShowModal] = useState(false);
  const showModalRef = useRef(showModal);
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    message: '',
  });
  const [successModal, setSuccessModal] = useState({
    isVisible: false,
    message: '',
  });

  // 경고 모달 닫기
  const closeAlterModal = () =>
    setAlertModal({ isVisible: false, message: '' });
  // 성공 모달 닫기
  const closeSuccessModal = () => {
    setSuccessModal({ isVisible: false, message: '' });
  };



  //웹소켓 관련
  const { roomId } = useParams();
  const playerId = useSelector((state: RootState) => state.user.id);
  const token = sessionStorage.getItem('access_token');
  const dispatch = useDispatch();
  const sceneRef = useRef<Phaser.Scene | null>(null); // Phaser Scene 객체를 저장하는 Ref

  //캐릭터 모음..
  const playerSpritesRef = useRef<{
    [key: string]: Phaser.Physics.Arcade.Sprite;
  }>({});
  const playerRef = useRef<Phaser.Physics.Arcade.Sprite | null>(null); // 본인 스프라이트 저장

  //웹소켓 넘기기
  const gameSocketRef = useRef<WebSocket | null>(null);

  //모든 작물의 정보 불러오기
  // const allCropList = useSelector((state: RootState) => state.crop.crops);
  // console.log(allCropList);
  //작물에 대한 수량 불러오기
  const allCropsQuantityList = useSelector(
    (state: RootState) => state.cropQuantity,
  );

  //사람들 정보 불러오기?
  const roomData = useSelector(
    (state: RootState) => state.room.gameParticipants,
  );

  //라운드 정보 가져오기
  const round = useSelector((state: RootState) => state.time.round);
  //채팅
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]); // 채팅 내역 저장
  // 작물 리스트 응답을 저장할 상태
  const [cropList, setCropList] = useState(null);
  // 작물 차트를 저장할 상태
  const [dataChart, setDataChart] = useState(null);

  //게임 결과창
  const [showResultModal, setShowResultModal] = useState(false);

  //플레이어 작물
  const [showPlayerCrop, setShowPlayerCrop] = useState(false);

  // Redux 상태에서 playerCrops 가져오기
  //const playerCrops = useSelector((state: RootState) => state.playerCrop.crops);
  // 컴포넌트 내부에서
  const noReConnectRef = useRef(false); // useRef로 noReConnect 상태 관리

  const handleGameResult = (message: any) => {
    // message.content 안에 game-result가 있는지 확인
    if (message.content && message.content['game-result']) {
      const gameResult = message.content['game-result'];

      const resultsArray = Object.keys(gameResult).map((key) => ({
        playerId: key,
        totalGold: gameResult[key].totalGold,
        tierPoint: gameResult[key].tierPoint,
        rank: gameResult[key].rank,
        mileage: gameResult[key].mileage,
      }));

      // Redux에 게임 결과 저장
      dispatch(setGameResult(resultsArray));
    } else {
      console.error('Invalid GAME_RESULT message format: ', message);
    }
  };

  // 캐릭터 텍스처 맵핑
  const getCharacterTexture = (characterName: string) => {
    let frameW = 15; // 기본 프레임 너비
    let frameH = 19; // 기본 프레임 높이

    switch (characterName) {
      case 'curlyhair_boy':
        frameW = 19;
        frameH = 19;
        return { texture: curlyhairBoy, frameW, frameH };
      case 'flower_girl':
        frameW = 16;
        frameH = 19;
        return { texture: flowerGirl, frameW, frameH };
      case 'girl':
        frameW = 16;
        frameH = 19;
        return { texture: girl, frameW, frameH };
      case 'goblin':
        frameW = 20;
        frameH = 16;
        return { texture: goblin, frameW, frameH };
      case 'king_goblin':
        frameW = 20;
        frameH = 20;
        return { texture: kingGoblin, frameW, frameH };
      case 'ninja_skeleton':
        frameW = 16;
        frameH = 19;
        return { texture: ninjaSkeleton, frameW, frameH };
      case 'skeleton':
        frameW = 16;
        frameH = 19;
        return { texture: skeleton, frameW, frameH };
      default:
        return { texture: boy, frameW, frameH }; // 기본 캐릭터
    }
  };

  useEffect(() => {
    showModalRef.current = showModal;
  }, [showModal]);

  // 로컬스토리지에서 토큰 읽어오기
  useEffect(() => {
    if (token) {
      dispatch(setToken(token));
      const decodedToken = jwtDecode<DecodedToken>(token);
      dispatch(setUserId(decodedToken.userId));
    }
  }, []);

  useEffect(() => {
    const connectWebSocket = () => {
      const gameSocket = new WebSocket(
        `${SOCKET_LINK}/ws/game/${roomId}?playerId=${playerId}`,
      );

      gameSocket.onopen = () => {
        //console.log('게임 웹소켓 연결 성공');

        // 웹소켓 연결 후 PLAYER_CROP_LIST 요청을 보냄
        const cropListRequest = {
          type: 'PLAYER_CROP_LIST',
        };
        gameSocket.send(JSON.stringify(cropListRequest));
        // console.log('PLAYER_CROP_LIST 요청을 보냈습니다.');
      };

      gameSocket.onmessage = (event) => {
        try {
          const message = event.data;
          //console.log(message);

          if (typeof message === 'string' && message[0] !== '{') {
            //console.log('Received message:', message);
          } else {
            const data = JSON.parse(message);

            if (data.type === 'CHAT') {
              const newMessage = {
                playerId: data.content.playerId,
                message: data.content.message,
              };

              // 새로운 메시지를 내역에 추가
              setChatHistory((prev) => [...prev, newMessage]);
            }

            if (data.type === 'ROUND_START') {
              const { duration, round } = data.content;
              //보여줬던 정보를 전부 삭제, 라운드마다 초기화되어야하니까
              dispatch(clearArticles());
              dispatch(clearArticleResults());
              //시간과 라운드 설정
              dispatch(setRoundStart({ duration: duration, round: round }));
              //모달이 열려있으면 닫아야함
              setShowModal(false);
            }

            if (data.type === 'ROUND_END') {
              //console.log('ROUND_END 메시지 수신, 카운트다운 시작');
              //모달 열려야해
              setShowModal(true);
            }

            if (data.type === 'TOWN_CROP_LIST') {
              const response = data.content as Record<string, number>;
              setCropList(data.content);

              // cropData를 순회하면서 각각의 작물 수량을 업데이트
              Object.entries(response).forEach(([cropId, quantity]) => {
                dispatch(updateCrop({ id: cropId, newQuantity: quantity }));
              });

            }

            if (data.type === 'CROP_CHART') {
              if (JSON.stringify(dataChart) !== JSON.stringify(data.content)) {
                setDataChart(data.content);
                dispatch(setChartData(data.content));
              }
            }

            if (data.type === 'PLAYER_CROP_LIST') {
              dispatch(setPlayerCrops(data.content));
            }

            if (data.type === 'SELL_CROP') {
              //console.log(data.content);
              if (data.content.type === 'SUCCESS') {
                const crop = allCropsQuantityList.cropsQuantities.find(
                  (crop) => crop.id === data.content.info.cropId,
                );
                //console.log(crop!.count);

                dispatch(
                  updateCrop({
                    id: crop!.id,
                    newQuantity: data.content.info.townQuantity,
                  }),
                );
                dispatch(updateBalance(data.content.info.playerGold));
                dispatch(
                  updateCropAmount({
                    cropName: crop!.id,
                    newQuantity: data.content.info.playerQuantity,
                  }),
                );
                setSuccessModal({
                  isVisible: true,
                  message: '판매 성공!',
                });
              } else {
                setAlertModal({
                  isVisible: true,
                  message: '판매 실패.. 수량을 확인해주세요!',
                });
              }
            }

            if (data.type === 'BUY_CROP') {
              //console.log(data.content);
              if (data.content.type === 'SUCCESS') {
                const crop = allCropsQuantityList.cropsQuantities.find(
                  (crop) => crop.id === data.content.info.cropId,
                );
                dispatch(
                  updateCrop({
                    id: crop!.id,
                    newQuantity: data.content.info.townQuantity,
                  }),
                );
                dispatch(updateBalance(data.content.info.playerGold));
                dispatch(
                  updateCropAmount({
                    cropName: crop!.id,
                    newQuantity: data.content.info.playerQuantity,
                  }),
                );
                setSuccessModal({
                  isVisible: true,
                  message: '구매 성공!',
                });
              } else if (data.content.type === 'INSUFFICIENT_STOCK') {
                const req = {
                  type: 'TOWN_CROP_LIST',
                  townName: data.content.info.town,
                };

                //다시 마을 작물을 부르는 요청
                gameSocket.send(JSON.stringify(req));
                setAlertModal({
                  isVisible: true,
                  message: '상품의 재고를 확인해주세요!',
                });
              } else {
                setAlertModal({
                  isVisible: true,
                  message: '금액이 부족합니다..',
                });
              }
            }

            if (data.type === 'BUY_RANDOM_ARTICLE') {
              //기사를 리덕스에 저장하기
              if (data.content.type === 'SUCCESS') {
                //성공일때만..
                dispatch(addArticle(data.content));
                dispatch(updateBalance(data.content.playerGold));
              } else {
                setAlertModal({
                  isVisible: true,
                  message: '잔액이 부족합니다..',
                });
              }
            }

            if (data.type === 'ROUND_READY') {
              //(data.content);

              const totalReadyPlayer = data.content.totalPlayers;
              const readyReadyPlayer = data.content.readyPlayers;

              //다 같으면 준비됐다는거니까
              if (totalReadyPlayer === readyReadyPlayer) {
                //바로 꺼버리고 다음으로!
                setShowModal(false);
              }
            }

            if (data.type === 'PREPARATION_START') {
              const { preparationTime } = data.content;
              dispatch(
                setPreparationStart({ preparationTime: preparationTime }),
              );
            }

            if (data.type === 'ROUND_RESULT') {
              //console.log(data.content);
              dispatch(
                updateCropPrices({
                  originPriceMap: data.content.originPriceMap,
                  newPriceMap: data.content.newPriceMap,
                }),
              );
            }

            if (data.type === 'ARTICLE_RESULT') {
              //console.log(data.content);
              dispatch(addArticleResult(data.content)); // Redux로 결과값 저장
            }

            // 플레이어의 MOVE 이벤트 처리
            if (data.type === 'MOVE') {
              const otherPlayerId = data.content.playerId;
              const scene = sceneRef.current;

              //console.log(`otherPlayerId: ${otherPlayerId}, playerId: ${playerId}`);
              if (scene && otherPlayerId !== String(playerId)) {
                const targetX = data.content.x;
                const targetY = data.content.y;

                if (playerSpritesRef.current[otherPlayerId]) {
                  const otherPlayer = playerSpritesRef.current[otherPlayerId];

                  // roomData에서 해당 플레이어의 캐릭터 정보 찾기
                  const otherPlayerData = roomData?.find(
                    (player) => player.userId === parseInt(otherPlayerId),
                  );
                  const characterName = otherPlayerData
                    ? otherPlayerData.characterName
                    : 'boy'; // 기본 캐릭터는 'boy'로 설정

                  // 애니메이션 키를 캐릭터에 맞게 동적으로 설정
                  const walkAnimationKey = `walk_${characterName}_${otherPlayerId}`;

                  // 다른 플레이어가 이동할 때 애니메이션 재생
                  if (
                    !otherPlayer.anims?.isPlaying ||
                    otherPlayer.anims.currentAnim?.key !== walkAnimationKey
                  ) {
                    otherPlayer.anims.play(walkAnimationKey, true);
                  }

                  // Tween으로 부드럽게 이동
                  scene.tweens.add({
                    targets: otherPlayer,
                    x: targetX,
                    y: targetY,
                    duration:
                      Phaser.Math.Distance.Between(
                        otherPlayer.x,
                        otherPlayer.y,
                        targetX,
                        targetY,
                      ) * 10, // 거리 기반으로 시간 조절
                    onComplete: () => {
                      // 도착하면 애니메이션 멈춤
                      otherPlayer.anims.stop();
                    },
                  });

                  // 방향에 따른 좌우 반전 처리
                  if (data.content.dir === 2) {
                    otherPlayer.flipX = true; // 왼쪽으로 이동하면 좌우 반전
                  } else if (data.content.dir === 3) {
                    otherPlayer.flipX = false; // 오른쪽으로 이동하면 정상 방향
                  }

                  //otherPlayer.anims.play(walkAnimationKey, true); // 동적으로 설정된 애니메이션 키 사용
                }
              }
            }

            if (data.type === 'GAME_RESULT') {
              handleGameResult(data);
              setShowResultModal(true); // 모달을 열기 위한 상태 관리

              dispatch(clearCrops());
              dispatch(clearArticles());
              dispatch(clearArticleResults());
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      gameSocket.onclose = () => {
        if (!noReConnectRef.current) {
          //console.log('WebSocket이 닫혔습니다. 재연결을 시도합니다.');
          setTimeout(() => {
            connectWebSocket(); // 재연결 시도
          }, 1000); // 1초 후에 재연결 시도
        }
      };

      gameSocketRef.current = gameSocket; // WebSocket을 gameSocketRef에 저장

      // beforeunload 이벤트를 이용해 새로 고침 또는 창 닫기 시 웹소켓 연결 해제
      const handleBeforeUnload = () => {
        gameSocket.close();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        // 컴포넌트 언마운트 시 웹소켓 연결 해제 및 이벤트 리스너 제거
        gameSocket.close();
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    };

    connectWebSocket();
  }, [roomId, playerId]);

  // houseNum이 변경될 때마다 houseNumRef를 업데이트
  useEffect(() => {
    houseNumRef.current = houseNum;
    //console.log(houseNum);
  }, [houseNum]);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          fps: 60,
          tileBias: 16,
        },
      },
      scene: {
        preload,
        create,
        update,
      },
      render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true,
      },
    };

    const game = new Phaser.Game(config);

    const resize = () => {
      game.scale.resize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', resize);

    return () => {
      game.destroy(true);
      window.removeEventListener('resize', resize);
    };
  }, []);

  let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  let spaceBar: Phaser.Input.Keyboard.Key;
  let mapLayers: MapLayers | undefined | null;
  let mKey: Phaser.Input.Keyboard.Key | undefined | null;

  function preload(this: Phaser.Scene) {
    roomData.forEach((player: GameParticipant) => {
      const { texture, frameW, frameH } = getCharacterTexture(
        player.characterName,
      );
      this.load.spritesheet(
        `${player.characterName}_${player.userId}`,
        texture,
        {
          frameWidth: frameW,
          frameHeight: frameH,
        },
      );
    });

    this.load.tilemapTiledJSON('map', '/map1.json');
    this.load.image('tileset', tileset);
    this.load.image('bird_image', birdImage);
    this.load.image('blinking_image', blinkingImage);
    this.load.image('chicken_image', chickenImage);
    this.load.image('cow_image', cowImage);
    this.load.image('duck_image', duckImage);
    this.load.image('pig_image', pigImage);
    this.load.image('sheep_image', sheepImage);
    this.load.image('mushroom_blue_01_image', mushroomBlue01Image);
    this.load.image('mushroom_blue_02_image', mushroomBlue02Image);
    this.load.image('mushroom_blue_03_image', mushroomBlue03Image);
    this.load.image('mushroom_red_01_image', mushroomRed01Image);
    this.load.image('windmill_image', windmillImage);
    this.load.image('chimneysmoke_01_01_image', chimneySmoke01Image);
    this.load.image('chimneysmoke_04_01_image', chimneySmoke04Image);
    this.load.image('chimneysmoke_05_01_image', chimneySmoke05Image);
    this.load.image('collides', collidesImage);
  }

  //생성
  function create(this: Phaser.Scene) {
    // 현재 씬을 sceneRef에 저장
    sceneRef.current = this;
    mapLayers = createGameMap(this);
    //mapLayer가 정의되지 않았으면 빈 객체로 처리해준다.
    const {
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
    } = mapLayers ?? {};

    void backgroundLayer;
    void groundLayer;
    void animals_topLayer;
    void animals_bottomLayer;
    void collidesLayer;
    void dropfruitsLayer;
    void fencesLayer;
    void plantLayer;
    void vegetableLayer;
    void shadow_bottomLayer;
    void shadow_seaLayer;
    void shadow_topLayer;
    void house_bottom2Layer;
    void house_bottomLayer;
    void house_topLayer;
    void river_lakeLayer;

    let sprite: Phaser.Physics.Arcade.Sprite;

    roomData.forEach((player: GameParticipant) => {
      const spriteKey = `${player.characterName}_${player.userId}`;
      //console.log(spriteKey, '떴냐!!!!!!!!!!!');

      // 스프라이트 생성
      sprite = this.physics.add.sprite(1150, 1400, spriteKey);
      sprite.setScale(1);
      sprite.setCollideWorldBounds(true);
      playerSpritesRef.current[player.userId] = sprite;

      // 본인 플레이어 저장
      if (player.userId === playerId) {
        playerRef.current = sprite; // 본인 스프라이트를 playerRef에 저장
        this.cameras.main.startFollow(sprite, true, 0.5, 0.5);
        this.cameras.main.setZoom(2, 2);
      }

      // 애니메이션 생성
      this.anims.create({
        key: `walk_${spriteKey}`, // 애니메이션의 키를 스프라이트와 동일하게
        frames: this.anims.generateFrameNumbers(spriteKey, {
          start: 0,
          end: 7,
        }), // 프레임 번호 설정
        frameRate: 10,
        repeat: -1,
      });

      // 충돌 설정 - 이 부분을 다시 확인
      if (collidesLayer) {
        this.physics.add.collider(
          sprite,
          collidesLayer as Phaser.Tilemaps.TilemapLayer,
        );
      }
    });

    // // 충돌 설정
    // if (playerRef.current) {
    //   this.physics.add.collider(playerRef.current, collidesLayer as Phaser.Tilemaps.TilemapLayer, () => {
    //     console.log('충돌 발생!');  // 플레이어가 타일맵과 충돌할 때 실행되는 콜백
    //   });
    // }

    this.physics.world.setBounds(0, 0, 4480, 2560);
    this.cameras.main.setBounds(0, 0, 4480, 2560);

    cursors = this.input.keyboard!.createCursorKeys();
    spaceBar = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    //지도열기 설정
    mKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.M);
  }

  //업데이트
  function update(this: Phaser.Scene, delta: number) {
    // showModal이 true일 때는 키 입력을 무시
    if (showModalRef.current) {
      playerRef.current?.setVelocity(0);
      playerRef.current?.stop();
      return; // 키 입력을 모두 무시하고 아무것도 하지 않음
    }

    if (houseNumRef.current === null) {
      if (playerRef.current) {
        const playerKey = `${roomData.find((player) => player.userId === playerId)?.characterName}_${playerId}`;
        createPlayerMovement(
          this,
          playerRef.current,
          cursors,
          delta,
          gameSocketRef,
          playerKey,
        ); // 여기서 캐릭터 이동 처리
      }
    }

    //지도 열기 기능
    if (mKey && Phaser.Input.Keyboard.JustDown(mKey)) {
      setOpenMap(!openMap);
    }

    //거래소 및 마을에서의 상호작용 기능
    if (mapLayers && Phaser.Input.Keyboard.JustDown(spaceBar)) {
      const {
        house1Layer,
        house2Layer,
        house3Layer,
        house4Layer,
        house5Layer,
        house6Layer,
        exchangeLayer,
      } = mapLayers;

      const playerTileX = Math.floor(playerRef.current!.x / 16);
      const playerTileY = Math.floor(playerRef.current!.y / 16);

      const house1Tile = house1Layer?.hasTileAt(playerTileX, playerTileY);
      const house2Tile = house2Layer?.hasTileAt(playerTileX, playerTileY);
      const house3Tile = house3Layer?.hasTileAt(playerTileX, playerTileY);
      const house4Tile = house4Layer?.hasTileAt(playerTileX, playerTileY);
      const house5Tile = house5Layer?.hasTileAt(playerTileX, playerTileY);
      const house6Tile = house6Layer?.hasTileAt(playerTileX, playerTileY);
      const exchangeTile = exchangeLayer?.hasTileAt(playerTileX, playerTileY);

      if (house1Tile) {
        setHouseNum(1);
      } else if (house2Tile) {
        setHouseNum(2);
      } else if (house3Tile) {
        setHouseNum(3);
      } else if (house4Tile) {
        setHouseNum(4);
      } else if (house5Tile) {
        setHouseNum(5);
      } else if (house6Tile) {
        setHouseNum(6);
      } else if (exchangeTile) {
        setHouseNum(0);
      } else {
        setHouseNum(null);
      }
    }
  }

  const closeModal = () => {
    setHouseNum(null);
  };

  const closeMapModal = () => {
    setOpenMap(!openMap);
  };

  const handleNextRound = () => {
    //준비됐다는 요청
    const readyMessage = {
      type: 'ROUND_READY',
    };

    //메세지를 보내
    gameSocketRef.current?.send(JSON.stringify(readyMessage));
  };

  const goToLobby = () => {
    noReConnectRef.current = true; // 재연결을 막기 위한 플래그 설정
    setShowResultModal(false);

    // 웹소켓이 열려 있는 경우 안전하게 종료
    if (gameSocketRef.current) {
      gameSocketRef.current.close(); // 웹소켓 연결 끊기
      // console.log('웹소켓 연결이 종료되었습니다.');
    }

    // 잔액 초기화
    dispatch(clearBalance());

    // 로비로 이동
    navigation('/lobby');
  };

  const openPlayerCropModal = () => {
    setShowPlayerCrop(true);
  };
  const closePlayerCropModal = () => {
    setShowPlayerCrop(false);
  };

  return (
    <div>
      <div id="phaser-game-container" />
      <TimerModal /> {/* Phaser 화면 위에 타이머 모달 추가 */}
      <BalanceDisplay />
      <GameChat
        gameSocket={gameSocketRef.current} // WebSocket을 GameChat에 넘겨줌
        chatHistory={chatHistory} // 채팅 내역도 넘겨줌
      />
      <button
        className="fixed top-[85px] right-10 w-[90px] h-[40px] bg-[#d9b48f] text-black border-4 border-[#4e342e] rounded-lg shadow-md flex items-center justify-center font-extrabold pixel-font"
        onClick={openPlayerCropModal}
      >
        인벤토리
      </button>

      {houseNum !== null && (
        <InteractionModal
          houseNum={houseNum}
          closeModal={closeModal}
          gameSocket={gameSocketRef.current}
          cropList={cropList}
          dataChart={dataChart} // 여기서 dataChart 상태가 제대로 전달되고 있는지 확인
        />
      )}
      {openMap && <MapModal closeMapModal={closeMapModal} />}
      {showModal && round <= 4 && (
        <ResultModal round={round} onNextRound={handleNextRound} />
      )}
      {showResultModal && <GameResultModal onClose={goToLobby} />}
      {showPlayerCrop && (
        <PlayerCropModal
          onClose={closePlayerCropModal}
          gameSocket={gameSocketRef.current}
        />
      )}
      {alertModal.isVisible && (
        <Modal>
          <AlertModal
            message={alertModal.message}
            closeAlterModal={closeAlterModal}
          />
        </Modal>
      )}
      {successModal.isVisible && (
        <Modal>
          <SuccessModal
            message={successModal.message}
            closeSuccessModal={closeSuccessModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default PhaserGame;
