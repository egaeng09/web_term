import styled from 'styled-components';
import NavBar from '../components/NavBar';
import { Container } from '../styles/Page'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { login } from '../services/auth';

function LoginPage() {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({email : "", password : ""});
    
    const onChange = (e) => {
        const saveData = {
          ...userData, [e.target.name]:e.target.value 
        }
        setUserData(saveData)
    }

    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            Login();
        }
    };

    const Login = () => {
        login(userData).then(data => {
            if(data.error) {
                alert("회원 정보가 일치하지 않습니다.")
            }
            else if (data.login){
                console.log(data);
                sessionStorage.setItem("name", data.name);
                sessionStorage.setItem("email", data.email);
                sessionStorage.setItem("id", data.id);
                sessionStorage.setItem("type", data.type);
                navigate("/");
            }
        })
    }

    return(
        <Container>
            <NavBar></NavBar>
            <FormContainer>
                <LineContainer>
                    <span>EMAIL </span><input type = "text" name="email" onChange = {onChange} onKeyDown = {onKeyDown}></input>
                </LineContainer>
                <LineContainer>
                    <span>PW </span><input type = "password" name="password" onChange = {onChange} onKeyDown = {onKeyDown}></input>
                </LineContainer>
                <LineContainer>
                    <LoginBtn onClick = {Login}>로그인</LoginBtn>
                </LineContainer>
                <LineContainer>
                    <p onClick = {() => navigate("/signup")}>회원가입</p><p onClick = {() => navigate("/findpassword")}>비밀번호 찾기</p>
                </LineContainer>
            </FormContainer>
        </Container>
    );
}

export default LoginPage;

const FormContainer = styled.div`
    width : 800px;
    height : 600px;
    margin : 0 auto;
    padding-top : 150px;
    input {
        width : 400px;
        height : 30px;
        margin : 0 auto;
    }
    span, p {
        color : #666666;
        width : 150px;
        text-align : center;
    }
    span {
        text-align : right;
        line-height : 30px;
    }
    p {
        cursor : pointer;
    }
`

const LineContainer = styled.div`
    display : flex;
    justify-content : space-evenly;
    margin-bottom : 10px;
`

const LoginBtn = styled.div`
    width : 600px;
    height : 80px;
    margin : 50px 0;
    text-align : center;
    line-height : 80px;
    border : 1px solid #000000;
    cursor : pointer;

    color : #FFFFFF;
    background-color : #000000;
`