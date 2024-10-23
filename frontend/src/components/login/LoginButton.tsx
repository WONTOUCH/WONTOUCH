import React from 'react';

interface LoginButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="ready-button w-[340px] h-[100px] text-6xl"
    >
      게임 시작
    </button>
  );
};

export default LoginButton;
