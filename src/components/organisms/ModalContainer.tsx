'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { closeModal } from '@/store/slices/uiSlice';
import { CapsuleDetailsModal } from '@/components/molecules/Modal';

/**
 * A central component to manage all modals in the application
 * This component should be included once in the app layout
 */
const ModalContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { modal } = useSelector((state: RootState) => state.ui);
  const { currentCapsule } = useSelector((state: RootState) => state.capsule);
  
  const handleCloseModal = () => {
    dispatch(closeModal());
  };
  
  if (!modal.isOpen) return null;
  
  switch (modal.type) {
    case 'viewCapsule': {
      const capsule = modal.data || currentCapsule;
      if (!capsule) return null;
      return (
        <CapsuleDetailsModal
          isOpen={true}
          onClose={handleCloseModal}
          capsule={capsule}
        />
      );
    }
    default:
      return null;
  }
};

export default ModalContainer;
