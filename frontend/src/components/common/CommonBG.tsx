import { Outlet } from 'react-router-dom';
import backgroundImage from '../../assets/background.png';

// 로그인 이후 보일 배경 asset 적용 페이지
function CommonBG() {
  return (
    <div
      className="w-screen h-screen bg-cover"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* 자식 라우트를 렌더링하기 위한 Outlet */}
      <Outlet />
    </div>
  );
}

export default CommonBG;
