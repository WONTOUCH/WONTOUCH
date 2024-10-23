import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import mileage from '../../assets/icon/coin_mint_mini.png';

export default function Mileage() {
  const userMileage = useSelector((state: RootState) => state.user.mileage);
  const formattedMileage = userMileage.toLocaleString();

  return (
    <div className="flex justify-between items-center brown-box w-fit h-12 px-3">
      <div className="mileage-text text-xl mr-2">{formattedMileage}</div>
      <div>
        <img src={mileage} alt="마일리지" />
      </div>
    </div>
  );
}
