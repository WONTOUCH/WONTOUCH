import React, { useState } from 'react';
import wontouchLogo from '../assets/login/logo.gif';

import GoogleLogin from '../components/login/google/GoogleLogin';
import KakaoLogin from '../components/login/kakao/KakaoLogin';
import LoginButton from '../components/login/LoginButton';
import GoogleLoginTwo from '../components/login/google/GoogleLoginTwo';

function Login() {
  // useState로 로그인 버튼을 숨기고 로그인 옵션 보여주기
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  const handleLoginClick = () => {
    setShowLoginOptions(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="mb-20">
        <img src={wontouchLogo} alt="원터치 게임 로고" />
      </div>
      {!showLoginOptions ? (
        <LoginButton onClick={handleLoginClick} />
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <KakaoLogin />
          <GoogleLogin />
          <GoogleLoginTwo />
        </div>
      )}
    </div>
  );
}

export default Login;
