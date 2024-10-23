import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import Modal from '../../common/Modal';
import AlertModal from '../../common/AlertModal';
import { setPassword, setRoomId } from '../../../redux/slices/roomSlice';
import { useDispatch } from 'react-redux';

import map from '../../../assets/map/map.png';
import lock from '../../../assets/icon/lock.png';
import cancel from '../../../assets/icon/cancel.png';

export default function RoomList() {
  const API_LINK = import.meta.env.VITE_API_URL;
  const userId = useSelector((state: RootState) => state.user.id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [roomList, setRoomList] = useState<any[]>([]); // 방 목록
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null); // 선택한 방 ID
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false); // 비밀번호 모달 표시 여부
  const [enteredPassword, setEnteredPassword] = useState<string>(''); // 입력된 비밀번호
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    message: '',
  });

  // 방 목록 호출 api
  const getRoomList = async () => {
    const response = await axios.get(`${API_LINK}/lobby/list`);
    // console.log(response.data.data);
    setRoomList(response.data.data);
  };

  useEffect(() => {
    getRoomList();
  }, []);

  // 방 클릭
  const clickRoom = (
    roomId: string,
    secret: boolean,
    currentPlayersCount: number,
  ) => {
    if (currentPlayersCount === 8) {
      setAlertModal({
        isVisible: true,
        message: '인원이 꽉찼습니다!',
      });
      return;
    }

    // 비밀방이면 비밀번호 입력 모달 띄우기
    if (secret) {
      setSelectedRoomId(roomId);
      setShowPasswordModal(true);
    } else {
      // 비밀방이 아니면 바로 입장
      enterRoom(roomId, '');
    }
  };

  // 방 입장 api
  const enterRoom = async (roomId: string, password: string) => {
    try {
      await axios.post(`${API_LINK}/room/join/${roomId}`, {
        playerId: userId,
        password: password,
      });
      // console.log(response.data.data);
      setShowPasswordModal(false);
      setEnteredPassword('');

      // store에 비밀번호 저장 -> waitingRoom에서 쓰임
      dispatch(setPassword(password));
      dispatch(setRoomId(roomId));

      // 방으로 이동
      navigate(`/wait/${roomId}`);
    } catch (error) {
      setAlertModal({
        isVisible: true,
        message: '비밀번호를 다시 입력해주세요!',
      });
      // console.log(error);
    }
  };

  // 모달에서 비밀번호 입력 후 입장 버튼 클릭 시
  const clickEnter = () => {
    if (selectedRoomId) {
      enterRoom(selectedRoomId, enteredPassword);
    }
  };

  // 경고 모달 닫기
  const closeAlterModal = () =>
    setAlertModal({ isVisible: false, message: '' });

  return (
    <div className="flex flex-col">
      {roomList.length > 0 ? (
        roomList.reverse().map(
          (room, index) =>
            index % 2 === 0 && (
              <div key={room.roomId} className="flex m-1.5 mx-2">
                {/* 첫번째 방 */}
                <div className="w-full p-2">
                  <button
                    className="room-box p-2"
                    onClick={() =>
                      clickRoom(
                        room.roomId,
                        room.secret,
                        room.currentPlayersCount,
                      )
                    }
                  >
                    <div className="room-info p-0.5 px-4 mb-2 flex justify-start">
                      <span className="text-lg font-['Galmuri11-bold'] text-yellow-300 mr-3">
                        {(index + 1).toString().padStart(3, '0')}
                      </span>
                      <span className="text-lg font-['Galmuri11'] text-white text-center">
                        {room.roomName}
                      </span>
                    </div>
                    <div className="room-info flex p-2 mx-auto">
                      <span className="mr-4 h-16 overflow-hidden">
                        <img src={map} alt="맵 미리보기" className="w-72" />
                      </span>
                      <div className="flex flex-col items-center justify-center">
                        {room.secret ? (
                          <div>
                            <img src={lock} alt="" className="w-6 h-8" />
                          </div>
                        ) : (
                          <div className="w-6 h-8"></div>
                        )}
                        <div>
                          <div className="white-text mt-2">
                            {room.currentPlayersCount}/8
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* 두번째 방 */}
                {roomList[index + 1] && (
                  <div className="w-full p-2">
                    <button
                      className="room-box p-2"
                      onClick={() =>
                        clickRoom(
                          roomList[index + 1].roomId,
                          roomList[index + 1].secret,
                          roomList[index + 1].currentPlayersCount,
                        )
                      }
                    >
                      <div className="room-info p-0.5 px-4 mb-2 flex justify-start">
                        <span className="text-lg font-['Galmuri11-bold'] text-yellow-300 mr-3">
                          {(index + 2).toString().padStart(3, '0')}
                        </span>
                        <span className="text-lg font-['Galmuri11'] text-white text-center">
                          {roomList[index + 1].roomName}
                        </span>
                      </div>
                      <div className="room-info flex p-2 mx-auto">
                        <span className="mr-4 h-16 overflow-hidden">
                          <img src={map} alt="맵 미리보기" className="w-72" />
                        </span>
                        <div className="flex flex-col items-center justify-center">
                          {roomList[index + 1].secret ? (
                            <div>
                              <img src={lock} alt="" className="w-6 h-8" />
                            </div>
                          ) : (
                            <div className="w-6 h-8"></div>
                          )}
                          <div>
                            <div className="white-text mt-2">
                              {roomList[index + 1].currentPlayersCount}/8
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ),
        )
      ) : (
        <div className="white-title text-3xl mx-10 my-6">
          생성된 방이 없습니다.
        </div>
      )}

      {showPasswordModal && (
        <Modal>
          <div className="yellow-box w-2/5 h-[250px] p-4 bg-[#fffeee] border-[#36EAB5]">
            <div className="relative ">
              <div className="mint-title text-4xl mb-6">
                비밀번호를 입력하세요.
              </div>
              <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2"
                onClick={() => {
                  setShowPasswordModal(false);
                  setEnteredPassword('');
                }}
              >
                <img src={cancel} alt="" />
              </button>
            </div>
            <div className="flex flex-col items-center">
              <input
                type="password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                placeholder="비밀번호"
                className="input-tag font-['Galmuri11'] w-4/5 h-[60px] p-4 text-2xl"
              />
              <button
                onClick={clickEnter}
                className="ready-button w-4/12 h-[50px] text-2xl mt-4"
              >
                입장하기
              </button>
            </div>
          </div>
        </Modal>
      )}

      {alertModal.isVisible && (
        <Modal>
          <AlertModal
            message={alertModal.message}
            closeAlterModal={closeAlterModal}
          />
        </Modal>
      )}
    </div>
  );
}
