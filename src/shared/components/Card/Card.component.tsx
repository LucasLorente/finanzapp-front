"use client";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import Link from "next/link";
import React from "react";
import "./Card.styles.scss";
import TransactionModal from "@/shared/components/Modal/TransactionModal.component";

const CardComponent = ({
  title,
  redirect,
  total,
  weekly,
  monthly,
}: {
  title: string;
  redirect: string;
  total: number;
  weekly: number;
  monthly: number;
}) => {
  const isIncome = title.toLowerCase() === "ingresos";
  const typeClass = isIncome ? "income" : "expense";

  return (
    <Card className={`card-wrapper ${typeClass}`}>
      <CardContent className="card-content">
        <Box className="header-container">
          <Typography
            variant="h5"
            color="text.primary"
            className="card-title"
          >
            {title}
          </Typography>
        </Box>

        <Box className="total-container">
          <Typography
            variant="h3"
            className={`main-total ${typeClass}`}
          >
            ${total?.toLocaleString("es-AR") || 0}
          </Typography>
        </Box>

        <Box className="stats-grid">
          <Box className="stat-box">
            <Typography variant="caption" display="block" color="text.secondary" className="stat-label">
              Mensual
            </Typography>
            <Typography variant="subtitle1" color="text.primary" className="stat-value">
              ${monthly?.toLocaleString("es-AR") || 0}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem className="divider" />
          <Box className="stat-box">
            <Typography variant="caption" display="block" color="text.secondary" className="stat-label">
              Semanal
            </Typography>
            <Typography variant="subtitle1" color="text.primary" className="stat-value">
              ${weekly?.toLocaleString("es-AR") || 0}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions className="card-actions">
        <Link href={redirect} passHref className="action-link">
          <Button
            variant="outlined"
            disableElevation
            className={`action-btn details-button`}
          >
            Ver Detalles
          </Button>
        </Link>
        <TransactionModal
          type={isIncome ? "income" : "expense"}
          buttonText={isIncome ? "Añadir Ingreso" : "Añadir Gasto"}
          title={isIncome ? "Agregar Ingreso" : "Agregar Gasto"}
          triggerClassName={`action-btn`}
        />
      </CardActions>
    </Card>
  );
};

export default CardComponent;
