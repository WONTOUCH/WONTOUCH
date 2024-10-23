import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import LevelImg from './LevelImg';

export default function Nickname() {
  const userNickname = useSelector((state: RootState) => state.user.nickname);
  const userTierPoint = useSelector((state: RootState) => state.user.tierPoint);

  return (
    <div className="flex items-center brown-box w-fit h-12 justify-between px-3">
      <div className="white-text text-2xl mr-2">{userNickname}</div>
      <div className="w-8">
        <LevelImg tierPoint={userTierPoint ? userTierPoint : 0} />
      </div>
    </div>
  );
}
