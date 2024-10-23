import LevelImg from '../../common/LevelImg';

interface RankingInfoProps {
  userId: number;
  nickname: string;
  rank: number;
  tierPoint: number;
}

export default function RankingList({
  userId,
  nickname,
  rank,
  tierPoint,
}: RankingInfoProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="text-3xl font-['Galmuri11-bold'] text-yellow-500">
        {rank}.
      </div>
      <div className="ranking-box white-text text-2xl h-[40px] w-10/12 my-0.5 flex justify-between px-1">
        <div>{nickname}</div>
        <div>{tierPoint}</div>
      </div>
    </div>
  );
}
