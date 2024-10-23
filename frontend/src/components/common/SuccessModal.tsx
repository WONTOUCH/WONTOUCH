import confirm from '../../assets/icon/confirm.png';
import happy from '../../assets/icon/success.png';

export default function SuccessModal({
  message,
  closeSuccessModal,
}: {
  message: string;
  closeSuccessModal: () => void;
}) {
  return (
    <div className="yellow-box w-fit h-[180px] border-[#36EAB5] bg-[#FFFEEE] p-8 px-20">
      <div className="flex white-text text-4xl mb-10 justify-center">
        <img src={happy} alt="" className="mr-6 h-[40px]" />
        <div>{message}</div>
      </div>
      <button onClick={closeSuccessModal}>
        <img src={confirm} alt="" />
      </button>
    </div>
  );
}
