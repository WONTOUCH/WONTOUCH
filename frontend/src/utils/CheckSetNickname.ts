export const CheckSetNickname = (nickname: string) => {
  const isKoreanConsonants = /^[ㄱ-ㅎ]+$/.test(nickname); // 한글 자음만
  const isKoreanVowels = /^[ㅏ-ㅣ]+$/.test(nickname); // 한글 모음만
  const isEnglish = /^[a-zA-Z]+$/.test(nickname); // 영어만
  const isNumeric = /^[0-9]+$/.test(nickname); // 숫자만
  const isKoreanAndEnglish = /^[가-힣a-zA-Z]+$/.test(nickname); // 한글 + 영어
  const isKoreanAndNumeric = /^[가-힣0-9]+$/.test(nickname); // 한글 + 숫자
  const isEnglishAndNumeric = /^[a-zA-Z0-9]+$/.test(nickname); // 영어 + 숫자
  const isValidNickname = /^[가-힣a-zA-Z0-9]+$/.test(nickname); // 한글, 영어, 숫자 혼합 가능
  const hasSpecialCharacters = /[^가-힣a-zA-Z0-9]/.test(nickname); // 특수문자 포함 여부 확인

  // 한글 + 한글 자음
  const koreanLetters = nickname.match(/[가-힣]/g); // 한글 문자 추출
  const koreanConsonants = nickname.match(/[ㄱ-ㅎ]/g); // 한글 자음 추출
  const koreanVowels = nickname.match(/[ㅏ-ㅣ]/g); // 한글 모음 추출

  const totalLength =
    (koreanLetters ? koreanLetters.length : 0) +
    (koreanConsonants ? koreanConsonants.length : 0) +
    (koreanVowels ? koreanVowels.length : 0);

  // 유효성 검사
  if (isKoreanConsonants) {
    return '닉네임 설정 불가 : 한글 자음만 입력할 수 없습니다.';
  } else if (isKoreanVowels) {
    return '닉네임 설정 불가 : 한글 모음만 입력할 수 없습니다.';
  } else if (totalLength > 6) {
    return '닉네임 설정 불가 : 한글은 최대 6자까지 입력할 수 있습니다.';
  } else if (isEnglish && nickname.length > 10) {
    return '닉네임 설정 불가 : 영어는 최대 10자까지 입력할 수 있습니다.';
  } else if (isNumeric && nickname.length > 10) {
    return '닉네임 설정 불가 : 숫자는 최대 10자까지 입력할 수 있습니다.';
  } else if (isKoreanAndEnglish && nickname.length > 8) {
    return '닉네임 설정 불가 : 한글과 영어 조합은 최대 8자까지 입력할 수 있습니다.';
  } else if (isKoreanAndNumeric && nickname.length > 8) {
    return '닉네임 설정 불가 : 한글과 숫자 조합은 최대 8자까지 입력할 수 있습니다.';
  } else if (isEnglishAndNumeric && nickname.length > 10) {
    return '닉네임 설정 불가 : 영어와 숫자 조합은 최대 10자까지 입력할 수 있습니다.';
  } else if (isValidNickname && nickname.length > 8) {
    return '닉네임 설정 불가 : 한글, 영어, 숫자 혼합은 최대 8자까지 입력할 수 있습니다.';
  } else if (hasSpecialCharacters) {
    return '닉네임 설정 불가 : 특수문자는 사용할 수 없습니다.';
  } else {
    return 'isOK';
  }
};
