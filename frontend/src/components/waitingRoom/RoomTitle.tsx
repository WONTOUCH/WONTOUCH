import LockImg from '../../assets/icon/lock.png';

interface RoomTitleProps {
  roomName: string | null;
  roomId: string | undefined;
  isPrivate: Boolean;
}

function RoomTitle({ roomName, roomId, isPrivate }: RoomTitleProps) {
  return (
    <>
      {/* 방번호-제목 */}
      <div className="flex justify-between w-[418px] h-[50px] absolute top-[-20px] left-8 items-center bg-[#896A65] rounded-[10px] px-[8px]">
        <div className="flex items-center gap-2">
          <div className="font-galmuri11 text-white text-[18px] ml-4">{roomName}</div>
        </div>

        {isPrivate ? (
          <img src={LockImg} alt="비밀방 여부" className="w-6 mr-2" />
        ) : (
          ''
        )}
      </div>
    </>
  );
}

export default RoomTitle;
