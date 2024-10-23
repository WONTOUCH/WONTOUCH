import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileImg from '../common/ProfileImg';
import LevelImg from '../common/LevelImg';
import LevelText from '../common/LevelText';
import Experience from '../common/Experience';
import Modal from '../common/Modal';
import DeleteUser from './DeleteUser';
import {
  setUserDescription,
  setUserNickname,
  postUserMileage,
} from '../../redux/slices/userSlice';
import { CheckNicknameDuplicate } from '../../utils/CheckNicknameDuplicate';
import { CheckSetNickname } from '../../utils/CheckSetNickname';
import AlertModal from '../common/AlertModal';

import confirm from '../../assets/icon/confirm.png';

export default function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const API_LINK = import.meta.env.VITE_API_URL;

  const userId = useSelector((state: RootState) => state.user.id);
  const userCharacterName = useSelector(
    (state: RootState) => state.user.characterName,
  );
  const userNickname = useSelector((state: RootState) => state.user.nickname);
  const tierPoint = useSelector((state: RootState) => state.user.tierPoint);
  const userDescription = useSelector(
    (state: RootState) => state.user.description,
  );
  const userMileage = useSelector((state: RootState) => state.user.mileage);

  const [deleteUser, setDeleteUser] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>('');
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<
    boolean | null
  >(null);
  const [description, setDescription] = useState<string>('');
  const [complete, setComplete] = useState<boolean>(false);
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    message: '',
  });

  const goBack = () => {
    setComplete(false);
    navigate('/lobby');
  };

  const openDeleteModal = () => setDeleteUser(true);
  const closeDeleteModal = () => setDeleteUser(false);

  useEffect(() => {
    setNickname(userNickname);
    setDescription(userDescription);
  }, [userNickname, userDescription]);

  // 닉네임이 변경되었다면 닉네임 중복 체크
  const handleCheckNickname = async () => {
    if (userNickname !== nickname) {
      const availability = await CheckNicknameDuplicate(nickname);
      if (availability === 'isOK') {
        setIsNicknameAvailable(true);
      } else if (!nickname) {
        setAlertModal({ isVisible: true, message: '닉네임을 입력해주세요.' });
      } else {
        setAlertModal({
          isVisible: true,
          message: '닉네임 중복 확인이 불가능합니다.',
        });
      }
    }
  };

  // 닉네임, 한 줄 소개 변경
  const patchInfo = async () => {
    // 변경 가능 여부
    let isUpdateAllowed = true;

    // 닉네임이 변경되었다면
    if (userNickname !== nickname) {
      // 닉네임이 비어있는 경우
      if (!nickname) {
        setAlertModal({ isVisible: true, message: '닉네임을 입력해주세요.' });
        isUpdateAllowed = false;
      } else if (isNicknameAvailable === false) {
        // 닉네임이 중복된 경우
        setAlertModal({ isVisible: true, message: '중복된 닉네임입니다.' });
        isUpdateAllowed = false;
      } else if (userMileage < 10000) {
        // 마일리지 검사
        setAlertModal({
          isVisible: true,
          message: '닉네임 변경 : 마일리지가 부족합니다.',
        });
        isUpdateAllowed = false;
      }

      // 유효성 검사
      const checkNickname = CheckSetNickname(nickname);
      if (checkNickname !== 'isOK') {
        setAlertModal({
          isVisible: true,
          message: checkNickname,
        });
        isUpdateAllowed = false;
      }

      if (isUpdateAllowed) {
        try {
          await axios.patch(`${API_LINK}/user-profile/nickname/update`, {
            userId: userId,
            nickname: nickname,
          });
          dispatch(setUserNickname(nickname));

          // 닉네임 변경 시 10000 마일리지 차감
          dispatch(postUserMileage(10000));
        } catch (error) {
          setNickname(userNickname);
          setIsNicknameAvailable(null);
          setDescription(userDescription);
          isUpdateAllowed = false;
        }
      }
    }

    // 한 줄 소개가 변경되었다면
    if (userDescription !== description) {
      if (description.length > 15) {
        setAlertModal({
          isVisible: true,
          message: '한 줄 소개는 15자를 넘을 수 없습니다.',
        });
        isUpdateAllowed = false;
      }

      if (isUpdateAllowed) {
        try {
          await axios.patch(`${API_LINK}/user-profile/description`, {
            userId: userId,
            description: description,
          });
          dispatch(setUserDescription(description));
        } catch (error) {
          isUpdateAllowed = false;
        }
      }
    }

    if (isUpdateAllowed) {
      setComplete(true);
    }
  };

  // 경고 모달 닫기
  const closeAlterModal = () =>
    setAlertModal({ isVisible: false, message: '' });

  return (
    <div>
      <div className="flex flex-col items-center px-10">
        <div className="mint-title mb-6">회원 정보 수정</div>
        <div className="yellow-box min-w-[900px] w-8/12 h-[550px] p-10 px-20">
          <div className="flex justify-between items-center px-10 mb-10">
            <div className="profile-img w-[190px] h-[190px] flex items-center justify-center">
              <ProfileImg characterName={userCharacterName} />
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="yellow-box p-3 px-8 w-10/12 flex justify-center flex-col bg-[#fffffe]">
                <div className="flex items-center justify-center mb-2">
                  <div className="mr-2 text-xl level-text">
                    <LevelText tierPoint={Number(tierPoint)} />
                  </div>
                  <div className="w-6">
                    <LevelImg tierPoint={Number(tierPoint)} />
                  </div>
                </div>
                <div className="white-text text-3xl">{userNickname}</div>
              </div>
              <div>
                <Experience tierPoint={Number(tierPoint)} />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex flex-col items-center justify-center w-4/12">
              <div className="text-[#10AB7D] text-3xl">닉네임</div>
              <div className="text-[#10AB7D] text-xs">
                (수정 시 10,000 마일리지 필요)
              </div>
            </div>
            <input
              className="font-['Galmuri11'] w-5/12 h-[45px] mr-6 p-3 signup-input px-6 text-xl"
              id="nickname"
              placeholder="한글 6자, 영어 10자, 혼용 10자 제한"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
            ></input>
            <div className="w-3/12">
              <button
                className="ready-button w-[130px] h-[15px] text-2xl border-[#10AB7D] border-2"
                onClick={handleCheckNickname}
              >
                중복확인
              </button>
            </div>
          </div>
          <div className="text-left ml-56 font-['Galmuri11'] min-h-[24px] mb-6">
            {isNicknameAvailable === true && (
              <p className="text-green-600">중복되지 않은 닉네임입니다.</p>
            )}
            {isNicknameAvailable === false && (
              <p className="text-red-600">이미 사용 중인 닉네임입니다.</p>
            )}
          </div>
          <div className="flex items-center mb-6">
            <div className="text-[#10AB7D] text-3xl w-4/12 flex justify-center">
              한 줄 소개
            </div>
            <input
              className="font-['Galmuri11'] w-8/12 h-[45px] mr-6 p-3 signup-input px-6 text-xl"
              id="description"
              placeholder="한글 기준 최대 15자 입력 가능"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            ></input>
          </div>
          <div className="flex justify-between px-24">
            <button
              className="cancel-button w-5/12 h-[50px] text-3xl"
              onClick={goBack}
            >
              취소
            </button>
            <button
              className="logout-button w-5/12 h-[50px] text-3xl"
              onClick={patchInfo}
            >
              저장
            </button>
          </div>
          <div className="flex justify-center mt-3 font-['Galmuri11'] text-[#888888]">
            <button onClick={openDeleteModal}>회원 탈퇴</button>
          </div>
        </div>

        {deleteUser && (
          <Modal>
            <DeleteUser closeDeleteModal={closeDeleteModal} />
          </Modal>
        )}

        {complete && (
          <Modal>
            <div className="yellow-box min-w-[500px] w-2/5 h-[200px] border-[#36EAB5] bg-[#FFFEEE] p-8">
              <div className="white-text text-4xl mb-10">
                수정이 완료되었습니다!
              </div>
              <button onClick={goBack}>
                <img src={confirm} alt="" />
              </button>
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
    </div>
  );
}
