import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import NavBar from '../components/NavBar';
import axios from 'axios';

const MyPageContainer = styled.div`
  padding: 20px;
`;

const ReservationCard = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
`;

const ReservationDetails = styled.div`
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const ReviewButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: #ff0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #cc0000;
  }
`;

const DetailButton = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const Container = styled.div`
`;

function MyPage() {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function fetchReservations() {
      try {
        const user_id = sessionStorage.getItem("id");
        const response = await axios.get(`http://localhost:3001/book/result/${user_id}`);
        setReservations(response.data);
      } catch (error) {
        console.error('예약 목록 가져오기 실패:', error);
      }
    }

    fetchReservations();
  }, []);

  useEffect(() => {
    if (location.state && location.state.updatedReservation) {
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.book_id === location.state.updatedReservation.book_id
            ? location.state.updatedReservation
            : reservation
        )
      );
    }
  }, [location.state]);

  const handleWriteReview = (reservation) => {
    navigate('/review', { state: { reservation } });
  };

  const handleEditReview = (reservation) => {
    navigate('/review', { state: { reservation, review: reservation.review, bookId: reservation.book_id } });
  };

  const handleCancelReservation = async (bookId) => {
    try {
      await axios.post('http://localhost:3001/book/cancel', { bookId });
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.book_id === bookId ? { ...reservation, cancel: 1, status: '취소' } : reservation
        )
      );
    } catch (error) {
      console.error('예약 취소 실패:', error);
    }
  };

  const handleViewDetails = (campsite_id) => {
    navigate(`/detail/${campsite_id}`);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }

  return (
    <Container>
      <NavBar />
      <MyPageContainer>
        <h2>나의 예약 목록</h2>
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <ReservationCard key={reservation.book_id}>
              <ReservationDetails>
                <h3>{reservation.name}</h3>
                <p>상태: {reservation.status}</p>
                <p>체크인: {formatDate(reservation.check_in_date)} / 체크아웃: {formatDate(reservation.check_out_date)}</p>
                <p>유형: {reservation.site_type} / 수용인원: {reservation.capacity}명</p>
                <p>* 인원 정보 * : 성인 {reservation.adult}명 / 아이 {reservation.child}명</p>
                <p>가격: {reservation.price.toLocaleString()}원</p>
              </ReservationDetails>
              <ButtonContainer>
                {reservation.status === '예약종료' && !reservation.review && (
                  <ReviewButton onClick={() => handleWriteReview(reservation)}>리뷰 작성</ReviewButton>
                )}
                {reservation.status === '예약종료' && reservation.review && (
                  <DetailButton onClick={() => handleViewDetails(reservation.campsite_id)}>상세보기</DetailButton>
                )}
                {reservation.status !== '예약종료' && reservation.cancel === 0 && (
                  <CancelButton onClick={() => handleCancelReservation(reservation.book_id)}>예약 취소</CancelButton>
                )}
              </ButtonContainer>
            </ReservationCard>
          ))
        ) : (
          <p>예약 목록이 없습니다.</p>
        )}
      </MyPageContainer>
    </Container>
  );
}

export default MyPage;