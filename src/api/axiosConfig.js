import axios from "axios";

export default axios.create({
    baseURL: 'https://nivakcloudbackend.netlify.app',//'http://localhost:8000',
    withCredentials: true
});