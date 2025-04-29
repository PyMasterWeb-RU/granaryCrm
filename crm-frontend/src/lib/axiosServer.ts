// src/lib/axiosServer.ts
import axios from 'axios'

const axiosServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // полный путь типа http://localhost:4200/api
  withCredentials: true, // если нужны куки на сервере тоже
})

export default axiosServer
