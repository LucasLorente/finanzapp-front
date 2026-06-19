import { Card, CardContent, Typography, Box } from "@mui/material";
import dayjs from "dayjs";
import { fetchDolarOficial } from "@/services/api.dolar";
import "../Card/Card.styles.scss";

const DolarRate = async () => {
  const dolar = await fetchDolarOficial();

  return (
    <Card className="card-wrapper positive">
      <CardContent className="card-content">
        <Box className="header-container">
          <Typography variant="h5" className="card-title">
            Dólar Oficial
          </Typography>
        </Box>

        <Box className="stats-grid">
          <Box className="stat-box">
            <Typography variant="caption" className="stat-label">
              Compra
            </Typography>
            <Typography variant="h6" className="stat-value">
              ${dolar.compra.toLocaleString("es-AR")}
            </Typography>
          </Box>
          <Box className="stat-box">
            <Typography variant="caption" className="stat-label">
              Venta
            </Typography>
            <Typography variant="h6" className="stat-value">
              ${dolar.venta.toLocaleString("es-AR")}
            </Typography>
          </Box>
        </Box>

        <Typography variant="caption" sx={{ color: "#64748b", mt: 1 }}>
          Actualizado: {dayjs(dolar.fechaActualizacion).format("DD/MM/YYYY HH:mm")}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DolarRate;
