"use client";

import React from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import AddExpensesForm from "./add-expenses-form";

export default function AddExpensesModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        className="m-3 text-white secondary-color"
        variant="outlined"
        onClick={handleOpen}
      >
        Añadir Gasto
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex flex-col items-center justify-center"
      >
        <>
          <AddExpensesForm></AddExpensesForm>
        </>
      </Modal>
    </>
  );
}
