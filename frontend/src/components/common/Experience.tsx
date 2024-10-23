function calculateLevel(tierPoint: number): number {
  if (tierPoint >= 150 && tierPoint <= 224) {
    return 225; // 레벨 02
  } else if (tierPoint >= 225 && tierPoint <= 336) {
    return 337; // 레벨 03
  } else if (tierPoint >= 337 && tierPoint <= 505) {
    return 506; // 레벨 04
  } else if (tierPoint >= 506 && tierPoint <= 758) {
    return 759; // 레벨 05
  } else if (tierPoint >= 759 && tierPoint <= 1138) {
    return 1139; // 레벨 06
  } else if (tierPoint >= 1139 && tierPoint <= 1707) {
    return 1708; // 레벨 07
  } else if (tierPoint >= 1708 && tierPoint <= 2561) {
    return 2562; // 레벨 08
  } else if (tierPoint >= 2562 && tierPoint <= 3843) {
    return 3844; // 레벨 09
  } else if (tierPoint >= 3844 && tierPoint <= 5765) {
    return 5766; // 레벨 10
  } else if (tierPoint >= 5766 && tierPoint <= 8648) {
    return 8649; // 레벨 11
  } else if (tierPoint >= 8649 && tierPoint <= 12973) {
    return 12974; // 레벨 12
  } else if (tierPoint >= 12974 && tierPoint <= 19460) {
    return 19461; // 레벨 13
  } else if (tierPoint >= 19461 && tierPoint <= 29191) {
    return 29192; // 레벨 14
  } else if (tierPoint >= 29192 && tierPoint <= 43788) {
    return 43789; // 레벨 15
  } else if (tierPoint >= 43789 && tierPoint <= 65683) {
    return 65684; // 레벨 16
  } else if (tierPoint >= 65684 && tierPoint <= 98525) {
    return 98526; // 레벨 17
  } else if (tierPoint >= 98526 && tierPoint <= 147788) {
    return 147789; // 레벨 18
  } else if (tierPoint >= 147789 && tierPoint <= 221682) {
    return 221683; // 레벨 19
  } else if (tierPoint >= 221683 && tierPoint <= 332524) {
    return 332525; // 레벨 20
  } else if (tierPoint >= 332525 && tierPoint <= 498787) {
    return 498788; // 레벨 21
  } else if (tierPoint >= 498788) {
    return 7481828; // 레벨 22
  }
  return 150; // 기본 값 (1 레벨)
}

export default function Experience({ tierPoint }: { tierPoint: number }) {
  const level = calculateLevel(tierPoint);
  const percentage = (tierPoint / level) * 100; // 퍼센트 계산

  return (
    <div className="relative mt-6 w-80 h-[35px]">
      <div className="absolute exp-text z-10 w-80 h-[35px]">
        {tierPoint}/{level} ({percentage.toFixed(2)}%)
      </div>
      {/* percentage가 10보다 크거나 같을 때만 exp div 렌더링 */}
      {percentage >= 10 && (
        <div
          className="absolute z-5 h-[35px] exp"
          style={{ width: `${percentage}%` }}
        ></div>
      )}
      <div className="exp-background w-80 h-[35px]"></div>
    </div>
  );
}
