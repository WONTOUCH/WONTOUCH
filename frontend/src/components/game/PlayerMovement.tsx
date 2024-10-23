let lastSendTime = 0; // 마지막으로 데이터를 전송한 시간
let lastPosition = { x: 1150, y: 1400 }; // 마지막으로 전송한 위치 정보

export const createPlayerMovement = (
  _scene: Phaser.Scene,
  player: Phaser.Physics.Arcade.Sprite,
  cursors: Phaser.Types.Input.Keyboard.CursorKeys,
  delta: number, // 델타 타임 추가
  gameSocketRef: React.RefObject<WebSocket | null>,
  playerKey: string // playerKey를 추가로 받음
) => {
  const baseSpeed = 1; // 기본 속도 (필요시 조정)
  const maxDelta = 200; // 최대 delta 값 제한 (100ms = 10 FPS)
  const clampedDelta = Math.min(delta, maxDelta);
  let vx = 0;
  let vy = 0;

  player.setVelocity(0);
  let moving = false;
  let direction = -1;

  if (cursors.left.isDown) {
    vx = -baseSpeed;
    player.flipX = true;
    moving = true;
    direction = 2;
  }
  if (cursors.right.isDown) {
    vx = baseSpeed;
    player.flipX = false;
    moving = true;
    direction = 3;
  }
  if (cursors.up.isDown) {
    vy = -baseSpeed;
    moving = true;
    direction = 0;
  }
  if (cursors.down.isDown) {
    vy = baseSpeed;
    moving = true;
    direction = 1;
  }

  if (vx !== 0 && vy !== 0) {
    vx *= Math.SQRT1_2;
    vy *= Math.SQRT1_2;
  }

  // 속도에 델타 적용
  player.setVelocity(vx * clampedDelta, vy * clampedDelta);

  const currentTime = Date.now();
  const sendInterval = 1000; // 1초마다 데이터 전송
  const positionThreshold = 16; // 최소 변화량 (16픽셀 이상 차이날 때만 전송)

  // 현재 좌표 정수화
  const currentPosition = { x: Math.round(player.x), y: Math.round(player.y) };

  if (moving && gameSocketRef.current && gameSocketRef.current.readyState === 1) {
    // 이전 위치와 현재 위치 비교, 일정 거리 이상 이동한 경우에만 전송
    const distanceMoved = Math.sqrt(
      Math.pow(currentPosition.x - lastPosition.x, 2) +
      Math.pow(currentPosition.y - lastPosition.y, 2)
    );

    if (currentTime - lastSendTime > sendInterval || distanceMoved > positionThreshold) {
      const playerPosition = {
        type: 'MOVE',
        x: currentPosition.x,
        y: currentPosition.y,
        dir: direction,
      };
      gameSocketRef.current.send(JSON.stringify(playerPosition));
      lastSendTime = currentTime; // 전송 시간 업데이트
      lastPosition = currentPosition; // 마지막 위치 업데이트
    }
  }

  if (moving) {
    // 애니메이션을 실행할 때 playerKey를 사용하여 애니메이션을 찾음
    if (!player.anims?.isPlaying || player.anims.currentAnim?.key !== `walk_${playerKey}`) {
      player.anims.play(`walk_${playerKey}`, true);
    }
  } else {
    player.anims.stop();
    player.setFrame(0);
  }
};
