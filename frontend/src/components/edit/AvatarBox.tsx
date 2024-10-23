import { characterImages } from '../../assets/avatarImages';
import Lock from '../../assets/icon/lock.png';

interface AvatarBoxProps {
  characterName: string;
  description: string | undefined;
  equipped: boolean;
  owned: boolean;
  onClick: () => void;
}

function AvatarBox({
  characterName,
  description,
  equipped,
  owned,
  onClick,
}: AvatarBoxProps) {
  return (
    <div onClick={onClick} className="mr-5 flex-none">
      {/* 장착 시 테두리 색상 변경 */}
      {owned ? (
        <div
          className={`items-center relative bg-[#FFFEEE] border-[5px] rounded-[20px] ${equipped ? 'border-[#36eab5]' : 'border-white'}`}
        >
          <img src={characterImages[characterName]} alt={description} />
          {equipped ? (
            <div className="w-1/2 absolute top-0 bg-[#36eab5] rounded-br-[5px] white-text text-center">
              장착 중
            </div>
          ) : (
            ''
          )}
        </div>
      ) : (
        <div className="items-center border-[5px] rounded-[20px] border-white bg-[#DAC2A8] relative">
          <img src={characterImages[characterName]} alt={description} />
          <div className="bg-[#896A65] w-[110%] h-[110%] border-white border-[5px] opacity-80 absolute top-[-5%] left-[-5%] rounded-[20px]"></div>
          <img
            src={Lock}
            alt="잠금"
            className="absolute top-[25%] left-[35%] w-1/3"
          />
        </div>
      )}
    </div>
  );
}

export default AvatarBox;
