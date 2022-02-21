import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";
import ConfirmModal from "./ConfirmModal";
import InfoModal from "./InfoModal";

const ModalTypes = Object.freeze({
  SUCCESS: SuccessModal,
  ERROR: ErrorModal,
  CONFIRM: ConfirmModal,
  INFO: InfoModal
});

export default ModalTypes;
