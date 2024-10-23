function RoomHowTo() {
  return (
    <div className="yellow-box text-center my-[10px] px-5 pb-3">
      <div className="mint-title my-1">게임 방법</div>
      <p className="white-title">
        5라운드 동안 가장 많이
        <br /> 자산을 불리는 사람이 승리!
      </p>
      <p className="text-[14px] font-galmuri11">
        1. 라운드 마다 마을에 대한 기사가 작성돼요.
        <br /> 2.기사를 보고, 구매할 작물을 정해요.
        <br />
        3.다음 라운드가 되면, 결과에 따라 시세가 변동 돼요.
        <br /> (악성 기사를 조심해요!)
        <br />
        4.모든 라운드가 끝나면 자산이 가장 높은 플레이어가 우승!
      </p>
    </div>
  );
}

export default RoomHowTo;
