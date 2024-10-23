import { jwtDecode } from 'jwt-decode';
import { setUserId } from '../../../redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import google from '../../../assets/login/google_login.png';
import { setToken } from '../../../redux/slices/authSlice';

interface DecodedToken {
  userId: number;
}

function GoogleLoginTwo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // 본인 구글 토큰 입력
    const accessToken = import.meta.env.VITE_GOOGLE_TOKEN_TWO;

    sessionStorage.setItem('access_token', accessToken);
    const decodedToken = jwtDecode<DecodedToken>(accessToken);

    // 상태 업데이트
    dispatch(setUserId(decodedToken.userId));
    dispatch(setToken(accessToken)); // 토큰을 Redux 상태에 저장

    // console.log('구글 로그인 성공, Access Token:', accessToken);
    // console.log('userId: ', decodedToken.userId);

    navigate('/lobby');
  };

  return (
    <div>
      <img src={google} alt="구글 로그인 이미지" onClick={handleGoogleLogin} />
    </div>
  );
}

export default GoogleLoginTwo;
