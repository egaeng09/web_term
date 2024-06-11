import axios from 'axios';

export async function login(data) {
    try {
        const { email, password } = data;
        const response = await axios.post(`http://127.0.0.1:3001/login`, {
            email : email,
            password : password,
        }, {
            withCredentials: true
        })
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function logout() {
    try {
        const response = await axios.post(`http://127.0.0.1:3001/logout`, {}, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

const checkIsLogin = () => {
    if (!sessionStorage.getItem("id")) {
        alert("로그인이 필요합니다.");
        return false;
    }
    else {
        return true;
    }
}
export default checkIsLogin;