import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { useEffect } from 'react';
import Lobby from './pages/Lobby';
import WaitingRoom from './pages/WaitingRoom';
import Game from './pages/Game';
import Login from './pages/Login';
import KakaoLoginHandler from './components/login/kakao/KakaoLoginHandler';
import KakaoToSignup from './components/login/kakao/KakaoToSignup';
import SignupWithKakao from './components/signup/kakao/SignupWithKakao';
import CommonBG from './components/common/CommonBG';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import Edit from './pages/Edit';
import BackgroundMusic from './components/common/BackGroundMusic';
import LoginMusic from './assets/music/login.mp3';
import LobbyMusic from './assets/music/lobby.mp3';
import GameMusic from './assets/music/game.mp3';
import SignupMusic from './assets/music/singup.mp3';
import WaitingRoomMusic from './assets/music/waitingRoom.mp3';
import EditMusic from './assets/music/edit.mp3';
import clickSound from './assets/music/click.wav';

// 로그인 하지 않은 사용자의 접근 방지
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return children;
}

// 로그인된 사용자가 로그인 페이지에 접근하지 못하게
function AuthRoute({ children }: { children: JSX.Element }) {
  const token = sessionStorage.getItem('access_token');
  if (token) {
    return <Navigate to="/lobby" />;
  }
  return children;
}

// 닉네임이 등록된 사용자가 가입 페이지에 접근하지 못하게
function SignupProtectedRoute({ children }: { children: JSX.Element }) {
  const userNickname = useSelector((state: RootState) => state.user.nickname);
  if (userNickname) {
    return <Navigate to="/lobby" />;
  }
  return children;
}

function AppRouter() {
  useEffect(() => {
    const handlePlaySound = () => {
      const sound = document.getElementById('clickSound') as HTMLAudioElement;
      if (sound) {
        sound.volume = 0.5;
        sound.play();
      }
    };

    document.addEventListener('click', handlePlaySound);

    return () => {
      document.removeEventListener('click', handlePlaySound);
    };
  }, []);

  return (
    <Router>
      <BackgroundMusic
        loginMusic={LoginMusic}
        lobbyMusic={LobbyMusic}
        waitingRoomMusic={WaitingRoomMusic}
        gameMusic={GameMusic}
        signupMusic={SignupMusic}
        editMusic={EditMusic}
      />

      {/* 클릭 사운드 오디오 추가 */}
      <audio id="clickSound" src={clickSound} preload="auto" />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/login" />
            </ProtectedRoute>
          }
        />

        <Route path="/*" element={<CommonBG />}>
          {/* 로그인 화면 접근 방지 */}
          <Route
            path="login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="auth/kakao"
            element={
              <AuthRoute>
                <KakaoLoginHandler />
              </AuthRoute>
            }
          />

          {/* 가입 화면 접근 방지 */}
          <Route
            path="signup"
            element={
              <SignupProtectedRoute>
                <KakaoToSignup />
              </SignupProtectedRoute>
            }
          />
          <Route
            path="signup/kakao"
            element={
              <SignupProtectedRoute>
                <SignupWithKakao />
              </SignupProtectedRoute>
            }
          />

          {/* 보호된 라우트 */}
          <Route
            path="lobby"
            element={
              <ProtectedRoute>
                <Lobby />
              </ProtectedRoute>
            }
          />
          <Route
            path="wait/:roomId"
            element={
              <ProtectedRoute>
                <WaitingRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit/*"
            element={
              <ProtectedRoute>
                <Edit />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/game/:roomId"
          element={
            <ProtectedRoute>
              <Game />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRouter;
