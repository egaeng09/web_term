import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../styles/Page';
import NavBar from '../components/NavBar';
import styled from 'styled-components';
import { checkIsAdmin } from '../services/auth';

function OwnerPage() {
  const navigate = useNavigate();

  const IsAdmin = checkIsAdmin();
  useEffect(() => {
    if (!IsAdmin) {
        navigate('/');
      }
  }, []);

  const goToRegisterCamp = () => {
    navigate('/register-camp');
  };

  const goToConfirmReservation = () => {
    navigate('/confirm-reservation');
  };

  const goToUpdateCamp = () => {
    navigate('/update-camp');
  };

  return (
    <StyledContainer>
      <NavBar />
      <Title>내 캠핑장 관리</Title>
      <StyledButton onClick={goToRegisterCamp}>캠핑장 등록</StyledButton>
      <StyledButton onClick={goToUpdateCamp}>캠핑장 수정</StyledButton>
      <StyledButton onClick={goToConfirmReservation}>예약 확정</StyledButton>
    </StyledContainer>
  );
}

export default OwnerPage;

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background-color: #f8f9fa;  // 배경색 추가
`;

const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;  // 폰트 크기 조정
  margin-bottom: 20px;  // 마진 추가
`;

const StyledButton = styled.button`
  padding: 12px 25px;  // 패딩 조정
  font-size: 1.2rem;
  color: white;
  background-color: black;
  border: none;
  border-radius: 5px;  // 둥근 모서리 조정
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;