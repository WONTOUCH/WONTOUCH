import LevelImg from '../common/LevelImg';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { characterImages } from '../../assets/avatarImages';

interface UserInfoProps {
  isHost: boolean; // 방장 여부
  playerId: number; // 사용자
  nickname: string | undefined;
  isReady: boolean; // 준비 여부
  character: string;
  tierPoint: number;
}

// 대기방 접속자 정보
function RoomUserInfo({
  isHost,
  playerId,
  isReady,
  character,
  nickname,
  tierPoint,
}: UserInfoProps) {
  const gameParticipants = useSelector(
    (state: RootState) => state.room.gameParticipants,
  );

  const participant = gameParticipants.find(
    (participant) => participant.userId === Number(playerId),
  );

  if (!participant) {
    // 유저가 없을 경우 (친구 초대 버튼)
    return (
      <div className="w-[157px] h-[178px] rounded-[20px] border-[#FFF] border-[5px] bg-[#FFF2D1] px-[21px] py-[10px] flex items-center justify-center">
        <div className="plus-invite">+</div>
      </div>
    );
  }

  if (!playerId) {
    // 유저가 없을 경우 (친구 초대 버튼)
    return (
      <div className="w-[157px] h-[178px] rounded-[20px] border-[#FFF] border-[5px] bg-[#FFF2D1] px-[21px] py-[10px] flex items-center justify-center">
        <div className="plus-invite">+</div>
      </div>
    );
  } else {
    // 사용자가 있는 경우
    return (
      <div className="text-center">
        <div
          className={`flex flex-col justify-center items-center w-[157px] h-[178px] rounded-[20px] border-[5px] bg-[#FFF2D1] py-[5px] relative
            ${isHost ? 'border-[#FE0]' : isReady ? 'border-[#36eab5]' : 'border-[#FFF] '}`}
        >
          <div className="w-7 absolute right-4 top-0">
            <LevelImg tierPoint={tierPoint ? Number(tierPoint) : 0} />
          </div>
          <img
            src={characterImages[character]}
            alt="아바타"
            className="h-full"
          />
          <div className="user-name">{nickname}</div>
          {isHost ? (
            <div className="host-user absolute bottom-5 left-11">방장</div>
          ) : isReady ? (
            <div className="ready-user absolute bottom-5 left-3">준비 완료</div>
          ) : null}
        </div>
      </div>
    );
  }
}
export { RoomUserInfo };
