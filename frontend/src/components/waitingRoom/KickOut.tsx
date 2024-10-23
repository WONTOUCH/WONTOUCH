import CancelIcon from "../../assets/icon/cancel.png";
import ConfirmIcon from "../../assets/icon/confirm.png";

function KickOut() {
  return (
    <div>
      <div>님을 정말 퇴장시킬까요?</div>
      <div>
        <button>
          <img src={ConfirmIcon} alt="승인" />
        </button>
        <button>
          <img src={CancelIcon} alt="취소" />
        </button>
      </div>
    </div>
  );
}

export default KickOut;
