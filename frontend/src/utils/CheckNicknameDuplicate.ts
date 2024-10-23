import axios from 'axios';

export const CheckNicknameDuplicate = async (
  nickname: string,
): Promise<string | null> => {
  const API_LINK = import.meta.env.VITE_API_URL;

  // 닉네임 미입력
  if (!nickname) {
    return '닉네임을 입력해주세요.';
  }

  // api로 중복체크
  try {
    await axios.post(`${API_LINK}/user-profile/nickname/duplicate-check`, {
      nickname: nickname,
    });
    return 'isOK';
  } catch (error) {
    return '닉네임 중복 확인 불가';
  }
};
