import { useState } from 'react';
import Modal from '../components/common/Modal';
import MakeRoom from '../components/lobby/room/MakeRoom';
import FindRoom from '../components/lobby/room/FindRoom';
import Header from '../components/common/Header';
import Ranking from '../components/lobby/ranking/Ranking';
import RoomList from '../components/lobby/room/RoomList';
import Friend from '../components/lobby/friend/Friend';

import search from '../assets/icon/search.png';
import hammer from '../assets/icon/hammer.png';
import reload from '../assets/icon/reload.png';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

function Lobby() {
  const [showMakeRoom, setShowMakeRoom] = useState<boolean>(false);
  const [showFindRoom, setShowFindRoom] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState<number>(0); // reloadKey 상태 추가

  const roomId = useSelector((state: RootState) => state.room.roomId);
  console.log('로비 roomId: ', roomId);

  // 방 생성 모달
  const openMakeRoom = () => setShowMakeRoom(true);
  const closeMakeRoom = () => setShowMakeRoom(false);

  // 방 찾기 모달
  const openFindRoom = () => setShowFindRoom(true);
  const closeFindRoom = () => setShowFindRoom(false);

  // reload 버튼 클릭 시 reloadKey 변경
  const handleReload = () => {
    setReloadKey((prevKey) => prevKey + 1); // reloadKey 증가시켜 RoomList를 재렌더링
  };

  return (
    <div className="px-10">
      <Header />
      <div className="flex justify-between">
        <section className="yellow-box w-7/12 min-w-[880px] h-5/6 flex flex-col justify-center p-2 px-6 ml-10 pl-6">
          <div className="flex space-x-4 mb-4">
            <div>
              <button
                onClick={openMakeRoom}
                className="ready-button w-52 h-14 text-3xl"
              >
                방 만들기
                <img src={hammer} alt="Create Room" />
              </button>
            </div>
            <div>
              <button
                onClick={openFindRoom}
                className="ready-button w-52 h-14 text-3xl"
              >
                빠른 입장
                <img src={search} alt="Find Room" />
              </button>
            </div>
            <button
              onClick={handleReload}
              className="ready-button w-[60px] h-[50px]"
            >
              <img src={reload} alt="Reload" className="w-[30px]" />
            </button>
          </div>
          <div className="list-box overflow-auto flex flex-wrap justify-between p-2 w-full h-[530px]">
            <RoomList key={reloadKey} />
            {/* reloadKey가 바뀔 때마다 RoomList가 재렌더링 */}
          </div>
        </section>
        <section className="ranking-container w-4/12 h-5/6 flex flex-col items-center pr-10">
          <Ranking />
          <Friend />
        </section>
      </div>

      {showMakeRoom && (
        <Modal>
          <MakeRoom closeMakeRoom={closeMakeRoom} />
        </Modal>
      )}

      {showFindRoom && (
        <Modal>
          <FindRoom closeFindRoom={closeFindRoom} />
        </Modal>
      )}
    </div>
  );
}

export default Lobby;
