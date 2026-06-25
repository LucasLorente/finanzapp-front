"use client";

import React, { useState } from "react";
import axios from "@/config/api";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { ExpenseCategory, ExpenseType, InvestmentCategory, InvestmentType } from "@/types";
import CategoryModal from "./category-modal";
import styles from "./settings-list.module.scss";

interface SettingsListProps {
  expenseCategories: ExpenseCategory[];
  expenseTypes: ExpenseType[];
  investmentCategories: InvestmentCategory[];
  investmentTypes: InvestmentType[];
}

type EntityRow = { id: number; name: string };

interface TabConfig {
  label: string;
  endpoint: string;
  rows: EntityRow[];
}

const tabSx = {
  color: "#94a3b8",
  fontWeight: 600,
  "&.Mui-selected": { color: "#6290C8" },
};

const tableCellHeadSx = {
  color: "#94a3b8",
  fontWeight: 700,
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "transparent",
};

const tableCellSx = {
  color: "#cbd5e1",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};

const iconButtonSx = {
  color: "#64748b",
  "&:hover": { color: "#6290C8", backgroundColor: "rgba(98,144,200,0.1)" },
};

const deleteIconButtonSx = {
  color: "#64748b",
  "&:hover": { color: "#f87171", backgroundColor: "rgba(248,113,113,0.1)" },
};

export default function SettingsList({
  expenseCategories,
  expenseTypes,
  investmentCategories,
  investmentTypes,
}: SettingsListProps) {
  const [activeTab, setActiveTab] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalEndpoint, setModalEndpoint] = useState("");
  const [editRow, setEditRow] = useState<EntityRow | undefined>(undefined);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ endpoint: string; row: EntityRow } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const tabs: TabConfig[] = [
    { label: "Categorías de Gastos", endpoint: "/expenses-category", rows: expenseCategories },
    { label: "Tipos de Gastos", endpoint: "/expenses-type", rows: expenseTypes },
    { label: "Categorías de Inversiones", endpoint: "/investment-category", rows: investmentCategories },
    { label: "Tipos de Inversiones", endpoint: "/investment-type", rows: investmentTypes },
  ];

  const openCreate = (endpoint: string) => {
    setEditRow(undefined);
    setModalEndpoint(endpoint);
    setModalOpen(true);
  };

  const openEdit = (endpoint: string, row: EntityRow) => {
    setEditRow(row);
    setModalEndpoint(endpoint);
    setModalOpen(true);
  };

  const openDelete = (endpoint: string, row: EntityRow) => {
    setDeleteTarget({ endpoint, row });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axios.delete(`${deleteTarget.endpoint}/${deleteTarget.row.id}`);
      setDeleteDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Configuración</h1>

      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          "& .MuiTabs-indicator": { backgroundColor: "#6290C8" },
        }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map((tab) => (
          <Tab key={tab.endpoint} label={tab.label} sx={tabSx} />
        ))}
      </Tabs>

      {tabs.map((tab, index) => (
        <div key={tab.endpoint} hidden={activeTab !== index} className={styles.tabPanel}>
          {activeTab === index && (
            <>
              <div className={styles.panelHeader}>
                <span className={styles.panelTitle}>{tab.label}</span>
                <Button
                  variant="contained"
                  onClick={() => openCreate(tab.endpoint)}
                  sx={{
                    borderRadius: "12px",
                    fontWeight: 800,
                    textTransform: "none",
                    fontSize: "1rem",
                    padding: "10px",
                  }}
                >
                  + Agregar
                </Button>
              </div>

              <div className={styles.tableWrapper}>
                {tab.rows.length === 0 ? (
                  <div className={styles.emptyState}>Sin registros. Agregá uno con el botón de arriba.</div>
                ) : (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={tableCellHeadSx}>Nombre</TableCell>
                        <TableCell sx={{ ...tableCellHeadSx, width: 100 }} align="right">
                          Acciones
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tab.rows.map((row) => (
                        <TableRow
                          key={row.id}
                          sx={{ "&:last-child td": { border: 0 } }}
                        >
                          <TableCell sx={tableCellSx}>{row.name}</TableCell>
                          <TableCell sx={tableCellSx} align="right">
                            <IconButton
                              size="small"
                              sx={iconButtonSx}
                              onClick={() => openEdit(tab.endpoint, row)}
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
                              onClick={() => openDelete(tab.endpoint, row)}
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
                    </TableBody>
                  </Table>
                )}
              </div>
            </>
          )}
        </div>
      ))}

      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => window.location.reload()}
        endpoint={modalEndpoint}
        initialValues={editRow}
      />

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
        <DialogTitle sx={{ color: "#f1f5f9", fontWeight: 700 }}>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#94a3b8" }}>
            ¿Eliminar &quot;{deleteTarget?.row.name}&quot;? Esta acción no se puede deshacer.
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
              "&:hover": { borderColor: "rgba(255,255,255,0.5)", backgroundColor: "rgba(255,255,255,0.05)" },
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
}
