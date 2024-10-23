import confirm from '../../assets/icon/confirm.png';
import alterd from '../../assets/icon/alert.png';

export default function AlertModal({
  message,
  closeAlterModal,
}: {
  message: string;
  closeAlterModal: () => void;
}) {
  return (
    <div className="yellow-box w-fit h-[180px] border-[#36EAB5] bg-[#FFFEEE] p-8 px-20">
      <div className="flex white-text text-4xl mb-10 justify-center">
        <img src={alterd} alt="" className="mr-6 h-[40px]" />
        <div>{message}</div>
      </div>
      <button onClick={closeAlterModal}>
        <img src={confirm} alt="" />
      </button>
    </div>
  );
}
