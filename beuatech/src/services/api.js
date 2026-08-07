import axios from "axios";

export const api_jsonfake = axios.create(
    {
        baseURL: "http://localhost:8000",
        timeout:5000,
    }
)