"use client";

import { useCurrency } from "@/context/CurrencyContext";
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
import InvestmentModal from "@/shared/components/Modal/InvestmentModal.component";

type CardType = "income" | "expense" | "investment";

const CardComponent = ({
  title,
  redirect,
  total,
  type,
}: {
  title: string;
  redirect: string;
  total: number;
  type?: CardType;
}) => {
  const { formatAmount } = useCurrency();
  const resolvedType: CardType = type ?? (title.toLowerCase() === "ingresos" ? "income" : "expense");

  return (
    <Card className={`card-wrapper ${resolvedType}`}>
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
            className={`main-total ${resolvedType}`}
          >
            {formatAmount(total || 0)}
          </Typography>
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
        {resolvedType === "investment" ? (
          <InvestmentModal
            buttonText="Añadir Inversión"
            title="Agregar Inversión"
            triggerClassName="action-btn"
          />
        ) : (
          <TransactionModal
            type={resolvedType === "income" ? "income" : "expense"}
            buttonText={resolvedType === "income" ? "Añadir Ingreso" : "Añadir Gasto"}
            title={resolvedType === "income" ? "Agregar Ingreso" : "Agregar Gasto"}
            triggerClassName={`action-btn`}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default CardComponent;
