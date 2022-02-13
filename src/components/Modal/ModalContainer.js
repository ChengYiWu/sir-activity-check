import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { modalActions } from "../../actions";
import modalTypes from "./index";

const MODAL_TYPES = {
  SUCCESS: modalTypes.SUCCESS,
  ERROR: modalTypes.ERROR,
  CONFIRM: modalTypes.CONFIRM
};

const ModalContainer = () => {
  const { modalType, modalProps } = useSelector(state => state.modal);
  const dispatch = useDispatch();

  if (!modalType) {
    return null;
  }

  const Modal = MODAL_TYPES[modalType];
  const handleCloseModal = () => {
    dispatch(modalActions.hide());
  };

  return Modal ? <Modal onCloseModal={handleCloseModal} {...modalProps} /> : null;
};

export default ModalContainer;
