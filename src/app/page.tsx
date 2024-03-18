import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React from "react";

const card = (
  <React.Fragment>
    <CardHeader
      title={
        <Typography color="white" variant="h4" align="center">
          Gastos
        </Typography>
      }
    ></CardHeader>
    <CardContent>
      <Typography color="white">Mensuales: $100.256</Typography>
      <Typography color="white">Semanales: $100.256</Typography>
      <Typography color="white">Promedio: $100.256</Typography>
    </CardContent>
    <CardActions className="flex items-center justify-center">
      <Link href="/expenses">
        <Button size="large" variant="text">
          <Typography color="white">Ver Más</Typography>
        </Button>
      </Link>
    </CardActions>
  </React.Fragment>
);

const HomePage = () => {
  return (
    <>
      <Typography variant="h1" gutterBottom>
        Finance
      </Typography>
      <Container className="flex justify-around">
        <Card className="secondary-color p-3" variant="outlined">
          {card}
        </Card>
        <Card className="secondary-color p-3" variant="outlined">
          {card}
        </Card>
      </Container>
      <Link href="/expenses"></Link>
    </>
  );
};

export default HomePage;
