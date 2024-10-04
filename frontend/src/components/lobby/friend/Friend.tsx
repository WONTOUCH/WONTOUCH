import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useEffect } from 'react';
import FriendInfo from '../../common/FriendInfo';
import Modal from '../../common/Modal';
import FriendPlus from './FriendPlus';
import axios from 'axios';

interface FriendInfoProps {
  friendId: number;
  nickname: string;
  description: string;
  characterName: string;
  tierPoint: number;
}

const API_LINK = import.meta.env.VITE_API_URL;

export default function Friend() {
  const [friends, setFriends] = useState<FriendInfoProps[]>([]);
  const [findFriend, setFindFriend] = useState<boolean>(false);

  const userId = useSelector((state: RootState) => state.user.id);

  // 친구 목록 불러오기
  const getFriendsList = async () => {
    try {
      const response = await axios.get(`${API_LINK}/friend/${userId}`);
      setFriends(response.data.data);
    } catch {}
  };

  useEffect(() => {
    getFriendsList();
  }, []);

  const openFindFriend = () => {
    setFindFriend(true);
  };

  const closeFindFriend = () => {
    setFindFriend(false);
  };

  return (
    <div className="yellow-box w-11/12 h-[218px] ml-6">
      <div className="relative">
        <div className="flex justify-center mint-title">친구 목록</div>
        <div
          className="absolute right-2 plus-friend text-5xl top-1/2 transform -translate-y-1/2"
          onClick={openFindFriend}
        >
          +
        </div>
      </div>
      <div className="mx-8">
        {friends.map((friend) => (
          <FriendInfo
            key={friend.friendId}
            friendId={friend.friendId} // friendId를 key로 사용
            nickname={friend.nickname} // nickname을 name으로 매핑
            description={friend.description}
            characterName={friend.characterName} // characterName을 character로 매핑
            tierPoint={friend.tierPoint}
          />
        ))}
      </div>

      {findFriend && (
        <Modal>
          <FriendPlus closeFriend={closeFindFriend} />
        </Modal>
      )}
    </div>
  );
}
