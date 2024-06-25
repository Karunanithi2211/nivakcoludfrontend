import axios from "axios";

export default axios.create({
    baseURL: 'https://nivakcloudbackend.netlify.app',
    withCredentials: true
});