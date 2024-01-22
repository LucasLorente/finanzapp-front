import axios from "axios";

const axiosInstance = axios.create({
  // Configuración adicional, si es necesario
  baseURL: "http://localhost:8000",
  timeout: 5000, // Tiempo de espera en milisegundos
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
