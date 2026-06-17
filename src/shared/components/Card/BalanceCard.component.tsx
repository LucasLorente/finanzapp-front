"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";
import React from "react";
import "./Card.styles.scss";

const BalanceCard = ({ total }: { total: number }) => {
  return (
    <Card className={`card-wrapper`}>
      <CardContent className="card-content">
        <Box className="header-container">
          <Typography variant="h5" color="text.primary" className="card-title">
            Saldo Disponible
          </Typography>
        </Box>

        <Box className="total-container" sx={{ mb: 0 }}>
          <Typography variant="h3" className={`main-total text-blue-400`}>
            ${total?.toLocaleString("es-AR") || 0}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
