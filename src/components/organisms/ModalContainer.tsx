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
  
  // Handler to close the modal
  const handleCloseModal = () => {
    dispatch(closeModal());
  };
  
  // Return null if no modal is open
  if (!modal.isOpen) return null;
  
  // Render the appropriate modal based on the type
  switch (modal.type) {
    case 'viewCapsule':
      return (
        <CapsuleDetailsModal
          isOpen={true}
          onClose={handleCloseModal}
          capsule={modal.data || currentCapsule}
        />
      );
    // Add more modal types here as needed
    default:
      return null;
  }
};

export default ModalContainer;