"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { Expense, ExpenseCategory, ExpenseType } from "@/types";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useState } from "react";
import { deleteExpense } from "@/services/api.expenses";
import { deleteIncome } from "@/services/api.incomes";
import TransactionModal from "@/shared/components/Modal/TransactionModal.component";
import "./Table.component.scss";

interface TransactionTableProps {
  title: string;
  data: Expense[];
  type: "income" | "expense";
  total: number;
  categories?: ExpenseCategory[];
  types?: ExpenseType[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  title,
  data,
  type,
  total,
  categories,
  types,
}) => {
  const { formatAmount } = useCurrency();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [editTarget, setEditTarget] = useState<Expense | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const getCategoryName = (id: number) =>
    categories?.find((c) => c.id === id)?.name;

  const getTypeName = (id: number) =>
    types?.find((t) => t.id === id)?.name;

  const openEdit = (item: Expense) => {
    setEditTarget(item);
    setEditModalOpen(true);
  };

  const openDelete = (item: Expense) => {
    setDeleteTarget(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (isIncome) {
        await deleteIncome(deleteTarget.id);
      } else {
        await deleteExpense(deleteTarget.id);
      }
      setDeleteDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar:", error);
    } finally {
      setDeleting(false);
    }
  };

  const isIncome = type === "income";
  const amountClass = isIncome ? "income-amount" : "expense-amount";
  const colCount = isIncome ? 4 : 6;

  const iconButtonSx = {
    color: "#64748b",
    "&:hover": { color: "#6290C8", backgroundColor: "rgba(98,144,200,0.1)" },
  };

  const deleteIconButtonSx = {
    color: "#64748b",
    "&:hover": { color: "#f87171", backgroundColor: "rgba(248,113,113,0.1)" },
  };

  return (
    <div className="w-full animate-fade-in-up">
      <TableContainer component={Paper} className="transaction-container" elevation={0}>
        <div className="table-header">
          <div>
            <h2 className="table-title">{title}</h2>
            <p className="table-subtitle">{data.length} registros</p>
          </div>
        </div>

        <Table className="transaction-table w-full">
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Descripción</TableCell>
              {!isIncome && <TableCell>Tipo</TableCell>}
              {!isIncome && <TableCell>Categoría</TableCell>}
              <TableCell align="right">Monto</TableCell>
              <TableCell align="center" sx={{ width: 80 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="date-cell">
                    {dayjs(item.date).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell className="description-cell">
                    {item.description || <span className="text-slate-500 italic">Sin descripción</span>}
                  </TableCell>
                  {!isIncome && (
                    <TableCell>
                      {item.type_id && (
                        <Chip label={getTypeName(item.type_id)} size="small" className="type-chip" />
                      )}
                    </TableCell>
                  )}
                  {!isIncome && (
                    <TableCell>
                      {item.category_id && (
                        <Chip label={getCategoryName(item.category_id)} size="small" className="category-chip" />
                      )}
                    </TableCell>
                  )}
                  <TableCell align="right" className={amountClass}>
                    {formatAmount(item.amount)}
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                    <IconButton
                      size="small"
                      sx={iconButtonSx}
                      onClick={() => openEdit(item)}
                      aria-label="Editar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={deleteIconButtonSx}
                      onClick={() => openDelete(item)}
                      aria-label="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={colCount} align="center">
                  <div className="empty-state">
                    <p className="empty-title">No hay registros aún</p>
                    <p className="empty-subtitle">Añade tu primer registro usando el botón de abajo</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={colCount}>
                <div className="summary-bar">
                  <div className="summary-item summary-total">
                    <span className="summary-label">Total acumulado</span>
                    <span className={`summary-value ${amountClass}`}>{formatAmount(total || 0)}</span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          className="transaction-pagination"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </TableContainer>

      {editTarget && (
        <TransactionModal
          type={type}
          buttonText=""
          title={isIncome ? "Editar Ingreso" : "Editar Gasto"}
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditTarget(null);
          }}
          initialData={{
            id: editTarget.id,
            description: editTarget.description,
            amount: editTarget.amount,
            date: editTarget.date,
            categoryId: editTarget.category_id,
            typeId: editTarget.type_id,
          }}
        />
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            background: "linear-gradient(145deg, #161c2d, #1a2236)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            color: "#f1f5f9",
          },
        }}
      >
        <DialogTitle sx={{ color: "#f1f5f9", fontWeight: 700 }}>
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#94a3b8" }}>
            ¿Eliminar &quot;{deleteTarget?.description || "este registro"}&quot;? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "1rem 1.5rem" }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{
              borderColor: "rgba(255,255,255,0.25)",
              color: "#94a3b8",
              borderRadius: "10px",
              "&:hover": {
                borderColor: "rgba(255,255,255,0.5)",
                backgroundColor: "rgba(255,255,255,0.05)",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleting}
            sx={{ borderRadius: "10px" }}
          >
            {deleting ? "Eliminando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TransactionTable;
