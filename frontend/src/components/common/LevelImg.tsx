import bronze1 from '../../assets/level/01_level_bronze.png';
import bronze2 from '../../assets/level/02_level_bronze.png';
import bronze3 from '../../assets/level/03_level_bronze.png';
import silver1 from '../../assets/level/04_level_silver.png';
import silver2 from '../../assets/level/05_level_silver.png';
import silver3 from '../../assets/level/06_level_silver.png';
import gold1 from '../../assets/level/07_level_gold.png';
import gold2 from '../../assets/level/08_level_gold.png';
import gold3 from '../../assets/level/09_level_gold.png';
import platinum1 from '../../assets/level/10_level_platinum.png';
import platinum2 from '../../assets/level/11_level_platinum.png';
import platinum3 from '../../assets/level/12_level_platinum.png';
import dia1 from '../../assets/level/13_level_dia.png';
import dia2 from '../../assets/level/14_level_dia.png';
import dia3 from '../../assets/level/15_level_dia.png';
import ruby1 from '../../assets/level/16_level_ruby.png';
import ruby2 from '../../assets/level/17_level_ruby.png';
import ruby3 from '../../assets/level/18_level_ruby.png';
import master1 from '../../assets/level/19_level_master.png';
import master2 from '../../assets/level/20_level_master.png';
import master3 from '../../assets/level/21_level_master.png';
import grand from '../../assets/level/22_level_grand.png';

const levelImages: { [key: number]: string } = {
  1: bronze1,
  2: bronze2,
  3: bronze3,
  4: silver1,
  5: silver2,
  6: silver3,
  7: gold1,
  8: gold2,
  9: gold3,
  10: platinum1,
  11: platinum2,
  12: platinum3,
  13: dia1,
  14: dia2,
  15: dia3,
  16: ruby1,
  17: ruby2,
  18: ruby3,
  19: master1,
  20: master2,
  21: master3,
  22: grand,
};

function calculateLevel(tierPoint: number): number {
  if (tierPoint >= 150 && tierPoint <= 224) {
    return 2; // 레벨 02
  } else if (tierPoint >= 225 && tierPoint <= 336) {
    return 3; // 레벨 03
  } else if (tierPoint >= 337 && tierPoint <= 505) {
    return 4; // 레벨 04
  } else if (tierPoint >= 506 && tierPoint <= 758) {
    return 5; // 레벨 05
  } else if (tierPoint >= 759 && tierPoint <= 1138) {
    return 6; // 레벨 06
  } else if (tierPoint >= 1139 && tierPoint <= 1707) {
    return 7; // 레벨 07
  } else if (tierPoint >= 1708 && tierPoint <= 2561) {
    return 8; // 레벨 08
  } else if (tierPoint >= 2562 && tierPoint <= 3843) {
    return 9; // 레벨 09
  } else if (tierPoint >= 3844 && tierPoint <= 5765) {
    return 10; // 레벨 10
  } else if (tierPoint >= 5766 && tierPoint <= 8648) {
    return 11; // 레벨 11
  } else if (tierPoint >= 8649 && tierPoint <= 12973) {
    return 12; // 레벨 12
  } else if (tierPoint >= 12974 && tierPoint <= 19460) {
    return 13; // 레벨 13
  } else if (tierPoint >= 19461 && tierPoint <= 29191) {
    return 14; // 레벨 14
  } else if (tierPoint >= 29192 && tierPoint <= 43788) {
    return 15; // 레벨 15
  } else if (tierPoint >= 43789 && tierPoint <= 65683) {
    return 16; // 레벨 16
  } else if (tierPoint >= 65684 && tierPoint <= 98525) {
    return 17; // 레벨 17
  } else if (tierPoint >= 98526 && tierPoint <= 147788) {
    return 18; // 레벨 18
  } else if (tierPoint >= 147789 && tierPoint <= 221682) {
    return 19; // 레벨 19
  } else if (tierPoint >= 221683 && tierPoint <= 332524) {
    return 20; // 레벨 20
  } else if (tierPoint >= 332525 && tierPoint <= 498787) {
    return 21; // 레벨 21
  } else if (tierPoint >= 498788) {
    return 22; // 레벨 22
  }
  return 1; // 기본 값 (1 레벨)
}

export default function LevelImg({ tierPoint }: { tierPoint: number }) {
  const level = calculateLevel(tierPoint);
  return <img src={levelImages[level]} alt={`Level ${level}`} />;
}
