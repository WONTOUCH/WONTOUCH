import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useLocation } from 'react-router';

const BackgroundMusic = ({
  loginMusic,
  lobbyMusic,
  gameMusic,
  signupMusic,
  waitingRoomMusic,
  editMusic,
}: {
  loginMusic: string;
  lobbyMusic: string;
  gameMusic: string;
  signupMusic: string;
  waitingRoomMusic: string;
  editMusic: string;
}) => {
  const isMusicOn = useSelector((state: RootState) => state.music.isMusicOn);
  const location = useLocation();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isMusicOn) {
      audio?.pause(); // 음악이 꺼진 상태면 중지
      return;
    }

    let src = '';
    if (location.pathname.startsWith('/lobby')) {
      src = lobbyMusic; // 로비 페이지에서 재생할 음악
    } else if (location.pathname.startsWith('/wait')) {
      src = waitingRoomMusic; // 대기 페이지에서 재생할 음악
    } else if (location.pathname.startsWith('/game')) {
      src = gameMusic;
    } else if (location.pathname.startsWith('/signup')) {
      src = signupMusic;
    } else if (location.pathname.startsWith('/edit')) {
      src = editMusic;
    }

    if (!audio) {
      // 음악이 처음 생성될 때만 오디오 객체를 새로 생성
      const newAudio = new Audio(src);
      newAudio.loop = true; // 반복 재생 설정
      newAudio.volume = 0.5;
      newAudio.play(); // 음악 재생

      setAudio(newAudio); // 오디오 객체 저장
    } else if (audio.src !== src) {
      // 새로운 src를 설정하고 음악이 바뀔 때만 다시 재생
      audio.src = src;
      audio.volume = 0.5;
      audio.play();
    }

    return () => {
      audio?.pause(); // 컴포넌트가 언마운트될 때 음악을 멈춤
    };
  }, [
    isMusicOn,
    location,
    loginMusic,
    lobbyMusic,
    waitingRoomMusic,
    gameMusic,
    signupMusic,
    editMusic,
    audio,
  ]);

  return null; // UI에는 아무것도 표시하지 않음
};

export default BackgroundMusic;
