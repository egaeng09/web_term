import styled from "styled-components";
import NavBar from "../components/NavBar";
import { Container, NoticeContainer } from "../styles/Page";
import { useNavigate } from "react-router-dom";

function FindPasswordPage() {
  
  const navigate = useNavigate();

  return (
    <Container>
      <NavBar />
      <NoticeContainer>
        <p>비밀번호 찾기 기능은 현재 지원하지 않습니다. </p>
        <AlertText onClick = {() => navigate("/login")}>로그인으로 이동하기</AlertText>
      </NoticeContainer>
    </Container>
  );
}

export default FindPasswordPage;

const AlertText = styled.p`
    cursor : pointer;
    text-decoration : underline;
`