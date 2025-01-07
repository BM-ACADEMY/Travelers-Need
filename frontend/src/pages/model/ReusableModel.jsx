import React from "react";
import { Modal, Box, Typography } from "@mui/material";

const ReusableModal = ({ isOpen, onClose, children }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStyles}>
        <Box mt={2}>{children}</Box>
      </Box>
    </Modal>
  );
};

const modalStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 500,
  bgcolor: "background.paper",
//   border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

export default ReusableModal;
