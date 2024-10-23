import { useEffect, useState } from 'react';
import axios from 'axios';

import RankingList from './RankingList';

const API_LINK = import.meta.env.VITE_API_URL;

interface RankingInfoProps {
  userId: number;
  nickname: string;
  rank: number;
  tierPoint: number;
}

export default function Ranking() {
  const [ranking, setRanking] = useState<RankingInfoProps[]>([]);

  const getRankingList = async () => {
    try {
      const response = await axios.get(`${API_LINK}/rank/list`, {
        params: {
          size: 7,
        },
      });
      setRanking(response.data.data);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    getRankingList();
  }, []);

  return (
    <div className="yellow-box min-w-[335px] w-11/12 ml-6 mb-6 h-[390px]">
      <div className="mint-title my-1">주간 랭킹 TOP7</div>
      <div className="mx-6">
        {ranking.map((user) => (
          <RankingList
            key={user.userId}
            userId={user.userId}
            nickname={user.nickname}
            rank={user.rank}
            tierPoint={user.tierPoint}
          />
        ))}
      </div>
    </div>
  );
}
