import { Button, Container, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <Container className="flex flex-col items-center justify-center">
      <Typography variant="h1" gutterBottom>
        Title
      </Typography>
      <Link href="/expenses">
        <Button variant="contained" size="large">
          Expenses
        </Button>
      </Link>
    </Container>
  );
};

export default HomePage;
