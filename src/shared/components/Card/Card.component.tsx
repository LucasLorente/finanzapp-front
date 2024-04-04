"use client";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React from "react";

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
  return (
    <Card className="secondary-color p-3" variant="outlined">
      <CardHeader
        title={
          <Typography color="white" variant="h4" align="center">
            {title}
          </Typography>
        }
      ></CardHeader>
      <CardContent>
        <Typography color="white">Mensuales: ${monthly || 0}</Typography>
        <Typography color="white">Semanales: ${weekly || 0}</Typography>
        <Typography color="white">Promedio: ${total || 0}</Typography>
      </CardContent>
      <CardActions className="flex items-center justify-center">
        <Link href={redirect}>
          <Button size="large" variant="text">
            <Typography color="white">Ver Más</Typography>
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default CardComponent;
