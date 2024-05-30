import styled from 'styled-components';
import NavBar from '../components/NavBar';
import { Container } from '../styles/Page'
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();

    const Login = () => {

    }

    return(
        <Container>
            <NavBar></NavBar>
            <FormContainer>
                <LineContainer>
                    <span>ID </span><input type = "text"></input>
                </LineContainer>
                <LineContainer>
                    <span>PW </span><input type = "password"></input>
                </LineContainer>
                <LineContainer>
                    <LoginBtn>로그인</LoginBtn>
                </LineContainer>
                <LineContainer>
                    <p onClick = {() => navigate("/")}>회원가입</p><p onClick = {() => navigate("/")}>비밀번호 찾기</p>
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