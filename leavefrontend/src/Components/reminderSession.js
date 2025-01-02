import React, { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
//comment added
Modal.setAppElement('#root');

const ReminderSession = () => {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const navigate = useNavigate();

  const closeModal = () => {
    setModalIsOpen(false);
    
  };

  const handleLogin = () => {
    navigate('/');
     localStorage.removeItem("userToken");
          localStorage.removeItem("userDetails");
          localStorage.removeItem("navigateState");
          localStorage.removeItem("isLoggedIn");
    window.location.reload();
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        contentLabel="Session Timeout Reminder"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
          },
        }}
      >
        <h2>Your session has expired. Please click here to log in.</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
        >
          Login
        </Button>
      </Modal>
    </div>
  );
};

export default ReminderSession;
