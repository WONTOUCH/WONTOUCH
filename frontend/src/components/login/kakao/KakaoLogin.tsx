import kakao from "../../../assets/login/kakao.png";

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${
  import.meta.env.VITE_API_KEY
}&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}`;

function KakaoLoginButton() {
  const handleLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <button onClick={handleLogin}>
      <img src={kakao} alt="카카오 로그인" />
    </button>
  );
}

export default KakaoLoginButton;
