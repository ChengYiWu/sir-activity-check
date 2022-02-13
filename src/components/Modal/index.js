import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";
import ConfirmModal from "./ConfirmModal";

const ModalTypes = Object.freeze({
  SUCCESS: SuccessModal,
  ERROR: ErrorModal,
  CONFIRM: ConfirmModal
});

export default ModalTypes;
