import { useDispatch } from 'react-redux';
import { setFriends } from '../../../redux/slices/friendSlice';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useEffect } from 'react';
import FriendInfo from '../../common/FriendInfo';
import Modal from '../../common/Modal';
import FriendPlus from './FriendPlus';
import axios from 'axios';

export default function Friend() {
  const API_LINK = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();

  const [findFriend, setFindFriend] = useState<boolean>(false);

  const userId = useSelector((state: RootState) => state.user.id);
  const friends = useSelector((state: RootState) => state.friend.friends);

  // 친구 목록 불러오기
  const getFriendsList = async () => {
    try {
      const response = await axios.get(`${API_LINK}/friend/${userId}`);
      dispatch(setFriends(response.data.data));
    } catch {}
  };

  useEffect(() => {
    getFriendsList();
  }, [userId]);

  const openFindFriend = () => {
    setFindFriend(true);
  };

  const closeFindFriend = () => {
    setFindFriend(false);
  };

  return (
    <div className="yellow-box min-w-[335px] w-11/12 h-[218px] ml-6">
      <div className="relative">
        <div className="flex justify-center mint-title my-1">친구 목록</div>
        <div
          className="absolute right-2 plus-friend text-5xl top-1/2 transform -translate-y-1/2"
          onClick={openFindFriend}
        >
          <button>+</button>
        </div>
      </div>
      <div className="mx-8 h-[130px] overflow-y-auto px-1">
        {friends.map((friend) => (
          <FriendInfo
            key={friend.friendId} // friendId를 key로 사용
            friendId={friend.friendId}
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
