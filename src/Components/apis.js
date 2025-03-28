import axios from "axios";

const API = axios.create({ baseURL: "https://type-speed-check-1.onrender.com" });

export const signup = (data) => API.post("/api/auth/signup", data);
export const login = (data) => API.post("/api/auth/login", data);

export const getUser = () => API.get("/api/auth/user", { 
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
});

export const saveSession = (data) =>
    API.post("/api/sessions", data, { 
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
    });

export const getSessions = (userId) =>
    API.get(`/api/sessions/${userId}`, { 
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
    });