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

const CardComponent = ({
  title,
  redirect,
  total
}: {
  title: string;
  redirect: string;
  total: number;
}) => {
  const { formatAmount } = useCurrency();
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
