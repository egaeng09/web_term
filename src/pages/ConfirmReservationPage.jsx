import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container } from '../styles/Page';
import NavBar from '../components/NavBar';
import styled from 'styled-components';

function ConfirmReservationPage() {
  const [reservations, setReservations] = useState([]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/reservations/${sessionStorage.getItem("id")}`);
        console.log("데이터 출력: ", data);

        const enrichedReservations = await Promise.all(data.map(async (reservation) => {
          const siteResponse = await axios.get(`http://localhost:3001/api/subsitesSubId/${reservation.subsite_id}`);
          const site = siteResponse.data[0];  // 데이터가 배열인 경우 [0]을 추가
          console.log("사이트 데이터 출력: ", site);

          const campsiteResponse = await axios.get(`http://localhost:3001/api/campsitesCampId/${site.campsite_id}`);
          const campsite = campsiteResponse.data;
          console.log("캠핑장 데이터 출력: ", campsite);

          const userResponse = await axios.get(`http://localhost:3001/api/usersUserId/${reservation.user_id}`);
          const user = userResponse.data;
          console.log("유저 데이터 출력: ", user);

          return {
            ...reservation,
            userName: user.name,
            siteType: site.site_type, // 올바르게 할당되었는지 확인
            campName: campsite.name,
            check_in_date: formatDate(reservation.check_in_date),
            check_out_date: formatDate(reservation.check_out_date)
          };
        }));
        setReservations(enrichedReservations);
      } catch (error) {
        console.error('예약 정보를 불러오는데 실패했습니다.', error);
      }
    };

    fetchReservations();
  }, []);

  const confirmReservation = async (bookId) => {
    try {
      await axios.patch(`http://localhost:3001/api/reservations/${bookId}`, { accept: 1 });
      alert(`예약 id ${bookId}가 확정되었습니다.`);
      setReservations(reservations.map(res => res.book_id === bookId ? { ...res, accept: 1 } : res));
    } catch (error) {
      console.error('예약 확정 실패:', error);
      alert('예약 확정에 실패했습니다.');
    }
  };

  return (
    <StyledContainer>
      <NavBar />
      <Title>예약 확정</Title>
      <List>
        {reservations.filter(reservation => reservation.accept === 0 && reservation.cancel === 0).map(reservation => (
          <ListItem key={reservation.book_id}>
            <div>예약자: {reservation.userName} - 입실: {reservation.check_in_date}, 퇴실: {reservation.check_out_date}</div>
            <div>캠핑장 이름: {reservation.campName}</div>
            <div>사이트 유형: {reservation.siteType}</div>
            {console.log(reservation)}
            <div>인원수: 성인 {reservation.adult}명, 유아 {reservation.child}명</div>
            <div>가격: {reservation.price}원</div>
            <div>확정 상태: {reservation.accept ? '확정됨' : '미확정'}</div>
            {!reservation.accept && (
              <ConfirmButton onClick={() => confirmReservation(reservation.book_id)}>확정</ConfirmButton>
            )}
          </ListItem>
        ))}
      </List>
    </StyledContainer>
  );
}

export default ConfirmReservationPage;

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 30px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const ListItem = styled.li`
  background-color: #f8f9fa;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: start;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ConfirmButton = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  align-self: center;
  margin-top: 10px;

  &:hover {
    background-color: #45a049;
  }
`;
