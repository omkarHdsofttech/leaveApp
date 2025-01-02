import React from "react";
import { Modal, Box, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";

const MedicalCertificateModal = ({ open, handleClose, imageSrc }) => {
  // Function to handle image download
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = "medical_certificate.jpg"; // You can customize the filename
    link.click();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="medical-certificate-modal"
      aria-describedby="view-large-medical-certificate"
      disableBackdropClick // Disables closing on outside click
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxHeight: "80vh",
          maxWidth: "90%",
          overflow: "auto",
          position: "relative", // Ensure proper button placement
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 10,
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Download Button */}
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            zIndex: 10,
          }}
        >
          Download
        </Button>

        {/* Image Display */}
        <img
          src={imageSrc}
          alt="Medical Document"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
            maxHeight: "80vh",
          }}
        />
      </Box>
    </Modal>
  );
};

export default MedicalCertificateModal;
