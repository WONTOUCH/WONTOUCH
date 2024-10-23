export default function LevelText({ tierPoint }: { tierPoint: number }) {
  const levelTexts: { [key: number]: string } = {
    1: '농민',
    2: '상인',
    3: '부르주아',
    4: '지주',
    5: '남작',
    6: '백작',
    7: '공작',
    8: '군주',
  };

  const calculateLevel = (tierPoint: number): number => {
    if (tierPoint >= 300 && tierPoint <= 599) {
      return 2;
    } else if (tierPoint >= 600 && tierPoint <= 899) {
      return 3;
    } else if (tierPoint >= 900 && tierPoint <= 1199) {
      return 4;
    } else if (tierPoint >= 1200 && tierPoint <= 1499) {
      return 5;
    } else if (tierPoint >= 1500 && tierPoint <= 1799) {
      return 6;
    } else if (tierPoint >= 1800 && tierPoint <= 2099) {
      return 7;
    } else if (tierPoint >= 2100 && tierPoint >= 2100) {
      return 8;
    }
    return 1;
  };

  const level = calculateLevel(tierPoint);

  return <div>{levelTexts[level]}</div>;
}
