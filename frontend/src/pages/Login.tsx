import { useState } from 'react';
import wontouchLogo from '../assets/login/logo.gif';
import KakaoLogin from '../components/login/kakao/KakaoLogin';
import LoginButton from '../components/login/LoginButton';

function Login() {
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  const handleLoginClick = () => {
    setShowLoginOptions(true);
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <div className="mb-24">
        <img src={wontouchLogo} alt="원터치 게임 로고" />
      </div>
      <div className="min-h-[100px]">
        {!showLoginOptions ? (
          <LoginButton onClick={handleLoginClick} />
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <KakaoLogin />
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
