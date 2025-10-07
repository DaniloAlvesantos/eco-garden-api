import axios from "axios";

export const CEP = axios.create({
  baseURL: "https://viacep.com.br/ws",
});

