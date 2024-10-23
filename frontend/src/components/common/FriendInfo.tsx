import { useState } from 'react';
import Modal from './Modal';
import FriendProfile from '../lobby/friend/FriendProfile';
import LevelImg from './LevelImg';

interface FriendInfoProps {
  friendId: number;
  nickname: string;
  description: string;
  characterName: string;
  tierPoint: number;
}

export default function FriendInfo({
  friendId,
  nickname,
  description,
  characterName,
  tierPoint,
}: FriendInfoProps) {
  const [showProfile, setShowProfile] = useState<boolean>(false);

  // 사용자 프로필 모달
  const openProfile = () => {
    setShowProfile(true);
  };

  const closeProfile = () => {
    setShowProfile(false);
  };

  return (
    <div>
      <button
        className="ranking-box white-text text-2xl h-[40px] w-full mb-1 flex justify-between px-2"
        onClick={openProfile}
      >
        <div>{nickname}</div>
        <div className="w-6">
          <LevelImg tierPoint={tierPoint} />
        </div>
      </button>

      {showProfile && (
        <Modal>
          <FriendProfile closeProfile={closeProfile} friendId={friendId} />
        </Modal>
      )}
    </div>
  );
}
