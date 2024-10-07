import Phaser from 'phaser';
import { useEffect, useRef, useState } from 'react';
import { createGameMap } from './GameMap';
import { createPlayerMovement } from './PlayerMovement';
import InteractionModal from './InteractionModal';
import MapModal from './MapModal';
import ResultModal from './ResultModal';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setUserId } from '../../redux/slices/userSlice';
import { setToken } from '../../redux/slices/authSlice';
import { jwtDecode } from 'jwt-decode';

interface GameParticipant {
  userId: number;
  email?: string;
  nickname: string;
  description: string | null;
  characterName: string;
  tierPoint: number;
  mileage: number;
}


interface MapLayers {
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

interface DecodedToken {
  userId: number;
}

const PhaserGame = () => {
  //라운드 정보 가져오기
  const location = useLocation();
  const { roundDuration, roundNumber } = location.state || {};

  const [houseNum, setHouseNum] = useState<number | null>(null);
  const [openMap, setOpenMap] = useState<boolean>(false);
  const houseNumRef = useRef<number | null>(houseNum);

  const [showModal, setShowModal] = useState(false);
  const [round, setRound] = useState(roundNumber);
  const timerRef = useRef<number>(roundDuration); // 타이머 값을 useRef로 관리
  const timeTextRef = useRef<Phaser.GameObjects.Text | null>(null);
  const roundTextRef = useRef<Phaser.GameObjects.Text | null>(null);

  //웹소켓 관련
  const { roomId } = useParams();
  const playerId = useSelector((state: RootState) => state.user.id);
  const token = localStorage.getItem('access_token');
  const dispatch = useDispatch();
  const sceneRef = useRef<Phaser.Scene | null>(null); // Phaser Scene 객체를 저장하는 Ref

  //캐릭터 모음..
  const playerSpritesRef = useRef<{ [key: string]: Phaser.Physics.Arcade.Sprite }>({});
  const playerRef = useRef<Phaser.Physics.Arcade.Sprite | null>(null); // 본인 스프라이트 저장

  //웹소켓 넘기기
  const gameSocketRef = useRef<WebSocket | null>(null);

  //라운드 넘어가기..?
  const readyPlayerRef = useRef<number>(0);
  const nextTimerRef = useRef<number>(60);
  const totalPlayerRef = useRef<number>(0);

  //사람들 정보 불러오기?
  const roomData = useSelector((state: RootState) => state.room.gameParticipants);
  console.log("룸데이터는 이거에용", roomData);

  // 작물 리스트 응답을 저장할 상태
  const [cropList, setCropList] = useState(null);

  // 캐릭터 텍스처 맵핑
  const getCharacterTexture = (characterName: string) => {
    let frameW = 15; // 기본 프레임 너비
    let frameH = 19; // 기본 프레임 높이

    switch (characterName) {
      case 'curlyhair_boy':
        frameW = 19;
        frameH = 19;
        return { texture: 'curlyhair_boy', frameW, frameH };
      case 'flower_girl':
        frameW = 16;
        frameH = 19;
        return { texture: 'flower_girl', frameW, frameH };
      case 'girl':
        frameW = 16;
        frameH = 19;
        return { texture: 'girl', frameW, frameH };
      case 'goblin':
        frameW = 20;
        frameH = 16;
        return { texture: 'goblin', frameW, frameH };
      case 'king_goblin':
        frameW = 20;
        frameH = 20;
        return { texture: 'king_goblin', frameW, frameH };
      case 'ninja_skeleton':
        frameW = 16;
        frameH = 19;
        return { texture: 'ninja_skeleton', frameW, frameH };
      default:
        return { texture: 'boy', frameW, frameH }; // 기본 캐릭터
    }
  };


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
      const gameSocket = new WebSocket(`ws://localhost:8082/socket/ws/game/${roomId}?playerId=${playerId}`);

      gameSocket.onopen = () => {
        console.log('게임 웹소켓 연결 성공');
      };

      gameSocket.onmessage = (event) => {
        try {
          const message = event.data;

          if (typeof message === 'string' && message[0] !== '{') {
            console.log('Received message:', message);
          } else {
            const data = JSON.parse(message);
            console.log(data.type);

            if (data.type === 'ROUND_START') {
              const { duration, round } = data.content;

              // 서버에서 받은 새로운 duration 값으로 타이머 초기화
              timerRef.current = duration;
              console.log("설정된 값은", duration);
              nextTimerRef.current = 60; // 각 라운드마다 60초 제한 초기화
              setRound(round); // 현재 라운드 설정
              roundTextRef.current?.setText(`${round}R`);
              console.log(`새로운 라운드 ${round}, 타이머: ${duration}초`);
            }

            if (data.type === "TOWN_CROP_LIST") {
              console.log(data.content);
              setCropList(data.content);
            }

            if (data.type === 'ROUND_READY') {
              // 준비된 인원 수와 총 플레이어 수 업데이트
              totalPlayerRef.current = data.content.totalPlayers;
              readyPlayerRef.current = data.content.readyPlayers;

              // 모든 플레이어가 준비되었을 때만 다음 라운드로
              if (readyPlayerRef.current === totalPlayerRef.current) {
                console.log('모두 준비됨, 다음 라운드로 진행');
                proceedToNextRound();  // 라운드 진행 함수 호출
              } else {
                console.log(`${readyPlayerRef.current}명이 준비됨 / 총 ${totalPlayerRef.current}명`);
              }
            }

            // 플레이어의 MOVE 이벤트 처리
            if (data.type === 'MOVE') {
              const otherPlayerId = data.content.playerId;
              const scene = sceneRef.current;

              console.log(`otherPlayerId: ${otherPlayerId}, playerId: ${playerId}`);
              if (scene && otherPlayerId !== String(playerId)) {

                const targetX = data.content.x;
                const targetY = data.content.y;

                if (playerSpritesRef.current[otherPlayerId]) {
                  const otherPlayer = playerSpritesRef.current[otherPlayerId];

                  // roomData에서 해당 플레이어의 캐릭터 정보 찾기
                  const otherPlayerData = roomData.find(player => player.userId === parseInt(otherPlayerId));
                  const characterName = otherPlayerData ? otherPlayerData.characterName : 'boy'; // 기본 캐릭터는 'boy'로 설정

                  // 애니메이션 키를 캐릭터에 맞게 동적으로 설정
                  const walkAnimationKey = `walk_${characterName}_${otherPlayerId}`;

                  // 다른 플레이어가 이동할 때 애니메이션 재생
                  if (!otherPlayer.anims.isPlaying || otherPlayer.anims.currentAnim?.key !== walkAnimationKey) {
                    otherPlayer.anims.play(walkAnimationKey, true);
                  }

                  // Tween으로 부드럽게 이동
                  scene.tweens.add({
                    targets: otherPlayer,
                    x: targetX,
                    y: targetY,
                    duration: Phaser.Math.Distance.Between(otherPlayer.x, otherPlayer.y, targetX, targetY) * 10, // 거리 기반으로 시간 조절
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


          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      gameSocket.onclose = () => {
        console.log('WebSocket이 닫혔습니다. 재연결을 시도합니다.');
        setTimeout(() => {
          connectWebSocket(); // 재연결 시도
        }, 1000); // 1초 후에 재연결 시도
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
  }, [houseNum]);

  // round가 변경되면 Phaser 내의 round 텍스트 업데이트
  useEffect(() => {
    if (roundTextRef.current) {
      roundTextRef.current.setText(`${round}R`);
    }
  }, [round]);

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
          debug: true,
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
      const { texture, frameW, frameH } = getCharacterTexture(player.characterName);
      this.load.spritesheet(`${player.characterName}_${player.userId}`, `../src/assets/background/characters/move/${texture}.png`, {
        frameWidth: frameW,
        frameHeight: frameH,
      });
    });

    this.load.tilemapTiledJSON('map', '../src/assets/background/testmap.json');
    this.load.image(
      'tileset',
      '../src/assets/background/spr_tileset_sunnysideworld_16px.png',
    );

    // 동물들 텍스처 로드
    this.load.image(
      'bird_image',
      '../src/assets/background/animals/spr_deco_bird_01_strip4.png',
    );
    this.load.image(
      'blinking_image',
      '../src/assets/background/animals/spr_deco_blinking_strip12.png',
    );
    this.load.image(
      'chicken_image',
      '../src/assets/background/animals/spr_deco_chicken_01_strip4.png',
    );
    this.load.image(
      'cow_image',
      '../src/assets/background/animals/spr_deco_cow_strip4.png',
    );
    this.load.image(
      'duck_image',
      '../src/assets/background/animals/spr_deco_duck_01_strip4.png',
    );
    this.load.image(
      'pig_image',
      '../src/assets/background/animals/spr_deco_pig_01_strip4.png',
    );
    this.load.image(
      'sheep_image',
      '../src/assets/background/animals/spr_deco_sheep_01_strip4.png',
    );

    // 식물, 풍차 등
    this.load.image(
      'mushroom_blue_01_image',
      '../src/assets/background/others/spr_deco_mushroom_blue_01_strip4.png',
    );
    this.load.image(
      'mushroom_blue_02_image',
      '../src/assets/background/others/spr_deco_mushroom_blue_02_strip4.png',
    );
    this.load.image(
      'mushroom_blue_03_image',
      '../src/assets/background/others/spr_deco_mushroom_blue_03_strip4.png',
    );
    this.load.image(
      'mushroom_red_01_image',
      '../src/assets/background/others/spr_deco_mushroom_red_01_strip4.png',
    );
    this.load.image(
      'windmill_image',
      '../src/assets/background/others/spr_deco_windmill_withshadow_strip9.png',
    );

    // 연기
    this.load.image(
      'chimneysmoke_01_01_image',
      '../src/assets/background/others/chimneysmoke_01_strip30_01.png',
    );
    this.load.image(
      'chimneysmoke_04_01_image',
      '../src/assets/background/others/chimneysmoke_04_strip30_01.png',
    );
    this.load.image(
      'chimneysmoke_05_01_image',
      '../src/assets/background/others/chimneysmoke_05_strip30_01.png',
    );
    this.load.image('collides', '../src/assets/background/collides.png');
    this.load.image(
      'timerBackground',
      '../src/assets/background/round/timerBackground.png',
    );
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
      console.log(spriteKey);

      // 스프라이트 생성
      sprite = this.physics.add.sprite(4000, 300, spriteKey);
      sprite.setScale(1);
      sprite.setCollideWorldBounds(true);
      playerSpritesRef.current[player.userId] = sprite;

      // 본인 플레이어 저장
      if (player.userId === playerId) {
        playerRef.current = sprite;  // 본인 스프라이트를 playerRef에 저장
        this.cameras.main.startFollow(sprite, true, 0.5, 0.5);
        this.cameras.main.setZoom(2, 2);
      }

      // 애니메이션 생성
      this.anims.create({
        key: `walk_${spriteKey}`, // 애니메이션의 키를 스프라이트와 동일하게
        frames: this.anims.generateFrameNumbers(spriteKey, { start: 0, end: 7 }), // 프레임 번호 설정
        frameRate: 10,
        repeat: -1,
      });
    });

    // 충돌 설정
    //this.physics.add.collider(player, collidesLayer as Phaser.Tilemaps.TilemapLayer);

    this.physics.world.setBounds(0, 0, 4480, 2560);
    this.cameras.main.setBounds(0, 0, 4480, 2560);

    cursors = this.input.keyboard!.createCursorKeys();
    spaceBar = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    const { width, height } = this.scale;

    //이미지
    const timerBackground = this.add.image(
      width / 2,
      height / 2,
      'timerBackground',
    );
    timerBackground.setDisplaySize(80, 30);
    timerBackground.setScrollFactor(0);
    //라운드 텍스트 생성
    const roundText = this.add.text(width / 2, height / 2, `${round}R`, {
      fontFamily: 'DNFBitBitv2',
      color: '#FFEE00', // 텍스트 색상
      fontSize: '14px',
      stroke: '#000000', // 스토크 색상 (검정색)
      strokeThickness: 4, // 스토크 두께
    });

    roundTextRef.current = roundText;

    // 타이머 텍스트 생성 (화면 중앙에 배치)
    const timeText = this.add.text(
      width / 2,
      height / 2,
      `${Math.floor(timerRef.current / 60)} : ${timerRef.current % 60 < 10 ? '0' : ''}${timerRef.current % 60}`,
      {
        fontFamily: 'DNFBitBitv2',
        fontSize: '14px',
        color: '#ffffff', // 텍스트 색상
        stroke: '#000000', // 스토크 색상 (검정색)
        strokeThickness: 2, // 스토크 두께
      },
    );

    //이미지 위치설정
    timerBackground.setOrigin(0.5, 5.9);
    timerBackground.setDepth(9);

    //라운드 위치 설정
    roundText.setOrigin(0.5, 8.3);
    roundText.setScrollFactor(0);
    roundText.setDepth(10);
    //타이머 위치설정
    timeText.setOrigin(0.5, 8.25);

    // 타이머 텍스트를 화면에 고정
    timeText.setScrollFactor(0);
    timeText.setDepth(10); // 텍스트가 다른 객체 위에 표시되도록 설정

    timeTextRef.current = timeText;

    // 타이머 이벤트
    // 타이머 이벤트 시작 시점 기록
    const startTime = Date.now();
    const duration = timerRef.current * 1000; // 밀리초 단위로 변환하여 초기 타이머 시간 설정

    this.events.on('update', () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = duration - elapsedTime;

      if (remainingTime > 0) {
        // 남은 시간을 분과 초로 변환하여 타이머 텍스트 업데이트
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        timeTextRef.current?.setText(
          `${minutes} : ${seconds < 10 ? '0' : ''}${seconds}`
        );
      } else {
        // 타이머가 종료되면 모달을 표시하고 이벤트 중지
        setShowModal(true);
        this.events.off('update'); // update 이벤트 해제
      }
    });


    //지도열기 설정
    mKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.M);

    this.scale.on('resize', (gameSize: { width: number; height: number }) => {
      const { width, height } = gameSize;
      // 예시로 타이머와 라운드 텍스트 위치 조정
      timerBackground.setPosition(width / 2, height / 2);
      roundText.setPosition(width / 2, height / 2);
      timeText.setPosition(width / 2, height / 2);
    });
  }

  //업데이트
  function update(this: Phaser.Scene, delta: number) {
    if (houseNumRef.current === null) {
      if (playerRef.current) {
        const playerKey = `${roomData.find(player => player.userId === playerId)?.characterName}_${playerId}`;
        createPlayerMovement(this, playerRef.current, cursors, delta, gameSocketRef, playerKey); // playerKey를 추가로 넘겨줌
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
        console.log('1번집입니다.');
      } else if (house2Tile) {
        setHouseNum(2);
        console.log('2번집입니다.');
      } else if (house3Tile) {
        setHouseNum(3);
        console.log('3번집입니다.');
      } else if (house4Tile) {
        setHouseNum(4);
        console.log('4번집입니다.');
      } else if (house5Tile) {
        setHouseNum(5);
        console.log('5번집입니다.');
      } else if (house6Tile) {
        setHouseNum(6);
        console.log('6번집입니다.');
      } else if (exchangeTile) {
        setHouseNum(0);
        console.log('거래소입니다.');
      } else {
        setHouseNum(null);
        console.log('상호작용이 불가능한 위치입니다.');
      }
    }
  }

  let isRoundReadySent = false; // 메시지 전송 여부를 관리하는 변수

  // ROUND_READY 메시지를 보내는 함수
  const handleNextRound = () => {
    if (isRoundReadySent) {
      console.log("이미 ROUND_READY 메시지를 보냈습니다.");
      return; // 이미 메시지를 보낸 경우 실행되지 않음
    }

    console.log("ROUND_READY 메시지 보내기 시작");

    const roundReadyMessage = {
      type: 'ROUND_READY',
    };
    gameSocketRef.current?.send(JSON.stringify(roundReadyMessage));

    isRoundReadySent = true; // 메시지 보냈음을 표시

    setTimeout(() => {
      isRoundReadySent = false; // 재전송 가능하게 초기화
      console.log("이번라운드에 완료버튼을 이미 눌렀어요.");
    }, 60000); // 3초 후 초기화
  };

  useEffect(() => {
    const countdown = setInterval(() => {
      if (nextTimerRef.current > 0) {
        nextTimerRef.current--; // 타이머 1초 감소
      } else {
        console.log("60초 경과, 강제로 라운드를 넘깁니다.");
        clearInterval(countdown); // 타이머 종료
        proceedToNextRound(); // 강제로 라운드 넘기기
      }
    }, 1000);

    return () => clearInterval(countdown); // 컴포넌트 언마운트 시 타이머 정리
  }, [round]); // round가 변경될 때마다 타이머 재설정


  const proceedToNextRound = () => {
    // 라운드 진행 시 타이머와 준비 완료 인원 초기화
    readyPlayerRef.current = 0; // 준비 완료 인원 초기화
    nextTimerRef.current = 60; // 60초 제한 타이머 초기화

    setRound((prev: number) => prev + 1); // 라운드 증가
    setShowModal(false); // 모달 닫기
  };

  const closeModal = () => {
    setHouseNum(null);
  };

  const closeMapModal = () => {
    setOpenMap(!openMap);
  };

  return (
    <div>
      <div id="phaser-game-container" />
      {<InteractionModal houseNum={houseNum} closeModal={closeModal} gameSocket={gameSocketRef.current} cropList={cropList ?? undefined} />}
      {openMap && <MapModal closeMapModal={closeMapModal} />}
      {showModal && <ResultModal round={round} onNextRound={handleNextRound} />}
    </div>
  );
};

export default PhaserGame;
