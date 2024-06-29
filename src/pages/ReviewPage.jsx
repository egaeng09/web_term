import React, { useState } from 'react';
import styled from 'styled-components';
import NavBar from '../components/NavBar';
import { Container } from '../styles/Page';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReviewContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ReservationDetails = styled.div`
  margin-bottom: 20px;
`;

const RatingContainer = styled.div`
  margin-bottom: 10px;
`;

const RatingStar = styled.span`
  font-size: 24px;
  color: ${(props) => (props.active ? '#ffc107' : '#ccc')};
  cursor: pointer;
`;

const ReviewInput = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
`;

const ImageInput = styled.input`
  margin-top: 10px;
`;

function ReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { reservation } = location.state;
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);

  const handleSubmitReview = async () => {
    try {
      const user_id = sessionStorage.getItem("id");
      console.log(user_id);
      if (!user_id) {
        throw new Error("User ID not found in session storage");
      }

      const formData = new FormData();
      formData.append('reservationId', reservation.book_id);
      formData.append('reviewContent', reviewContent);
      formData.append('userId', user_id);
      formData.append('star', rating);
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post('http://localhost:3001/review', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const updatedReservation = { ...reservation, review: { content: reviewContent, star: rating } };
        navigate('/mypage', { state: { updatedReservation } });
      } else {
        console.error('리뷰 등록 실패:', response.status);
      }
    } catch (error) {
      console.error('리뷰 등록 중 오류 발생:', error);
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }

  return (
    <Container>
      <NavBar />
      <h2>리뷰 작성</h2>
      <ReviewContainer>
        <ReservationDetails>
          <h3>{reservation.campsite_name}</h3>
          <p>
            체크인: {formatDate(reservation.check_in_date)} / 체크아웃: {formatDate(reservation.check_out_date)}
          </p>
          <p>
            유형: {reservation.site_type} / 수용인원: {reservation.capacity}명
          </p>
          <p>가격: {reservation.price.toLocaleString()}원</p>
        </ReservationDetails>
        <RatingContainer>
          <span>평점:</span>
          {[1, 2, 3, 4, 5].map((value) => (
            <RatingStar
              key={value}
              active={value <= rating}
              onClick={() => setRating(value)}
            >
              &#9733;
            </RatingStar>
          ))}
        </RatingContainer>
        <ReviewInput
          placeholder="리뷰 내용을 입력하세요."
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
        />
        <ImageInput
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <SubmitButton onClick={handleSubmitReview}>리뷰 제출</SubmitButton>
      </ReviewContainer>
    </Container>
  );
}

export default ReviewPage;
