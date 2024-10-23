import { useNavigate } from 'react-router-dom';

import arrow from '../../assets/icon/arrow_left.png';
import { removeRoomId } from '../../redux/slices/roomSlice';
import { useDispatch } from 'react-redux';

export default function BackButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const clickButton = () => {
    dispatch(removeRoomId());
    navigate('/lobby');
  };
  return (
    <div>
      <button onClick={clickButton}>
        <img src={arrow} alt="" />
      </button>
    </div>
  );
}
