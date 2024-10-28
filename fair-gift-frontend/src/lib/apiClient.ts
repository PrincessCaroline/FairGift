import axios from "axios";

// Création d'une instance Axios avec configuration par défaut
const apiClient = axios.create({
  baseURL: "http://localhost:3000", // URL de base de ton backend NestJS
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


export default apiClient;
