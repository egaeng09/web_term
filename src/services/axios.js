import axios from 'axios';

const myAxios = axios.create({
    baseURL: process.env.REACT_APP_API_KEY,
});

export default myAxios;