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
        <SignUpText onClick = {() => navigate("/signup")}>회원가입으로 이동하기</SignUpText>
      </NoticeContainer>
    </Container>
  );
}

export default FindPasswordPage;

const SignUpText = styled.p`
    cursor : pointer;
    text-decoration : underline;
`