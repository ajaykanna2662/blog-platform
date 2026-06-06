import axios from "axios";

const API = axios.create({
    baseURL: "https://blog-platform-0vxp.onrender.com/api",
});

export default API;