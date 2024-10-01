import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/common/Modal';
import MakeRoom from '../components/lobby/MakeRoom';
import FindRoom from '../components/lobby/FindRoom';
import Header from '../components/common/Header';
import Ranking from '../components/lobby/Ranking';
import RoomList from '../components/lobby/RoomList';
import Friend from '../components/lobby/Friend';

import search from '../assets/icon/search.png';
import hammer from '../assets/icon/hammer.png';

function Lobby() {
  const [showMakeRoom, setShowMakeRoom] = useState<boolean>(false);
  const [showFindRoom, setShowFindRoom] = useState<boolean>(false);

  // 방 생성 모달
  const openMakeRoom = () => {
    setShowMakeRoom(true);
  };

  const closeMakeRoom = () => {
    setShowMakeRoom(false);
  };

  // 방 찾기 모달
  const openFindRoom = () => {
    setShowFindRoom(true);
  };

  const closeFindRoom = () => {
    setShowFindRoom(false);
  };

  // 방 입장
  const navigate = useNavigate();
  const enterRoom = () => {};

  return (
    <div>
      <Header />
      <div className="flex justify-between">
        <div className="yellow-box w-8/12 h-5/6 flex flex-col justify-center p-2 px-6">
          <div className="flex space-x-4 mb-4">
            <div>
              <button
                onClick={openMakeRoom}
                className="ready-button w-52 h-14 text-3xl"
              >
                방 만들기
                <img src={hammer} alt="" />
              </button>
            </div>
            <div>
              <button
                onClick={openFindRoom}
                className="ready-button w-52 h-14 text-3xl"
              >
                방 찾기
                <img src={search} alt="" />
              </button>
            </div>
          </div>
          <div className="list-box overflow-auto flex flex-wrap justify-between p-2 w-full h-[540px]">
            <RoomList />
          </div>
        </div>
        <div className="ranking-container w-4/12 h-5/6 flex flex-col items-center">
          <Ranking />
          <Friend />
        </div>
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
