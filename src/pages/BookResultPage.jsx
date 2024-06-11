import styled from "styled-components";
import NavBar from "../components/NavBar";
import { Container, NoticeContainer } from "../styles/Page";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { FaLocationDot } from "react-icons/fa6";
import { IoIosTime } from "react-icons/io";
import { IoTime } from "react-icons/io5";

const baseImgUrl = "images/";

function BookResultPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const { check_in_date, check_out_date, capacity, price } = location.state.book;
  const { name, address } = location.state.camp;
  const { sity_type, thumbnail } = location.state.site;

  const [bookResult, setBookResult] = useState();

  useEffect(() => {
    if (location.state) {
      setBookResult(location.state.isbook);
    }
    else {
      navigate('/');
    }
    
  }, [])

  const detailBtn = () => {
    navigate('/');
  };

  return (
    <Container>
      <NavBar></NavBar>
      {bookResult ? (
        <div>
          <NoticeContainer>
            <p>예약이 완료되었습니다. </p>
          </NoticeContainer>
          <BookResultContainer>
            <BookInfoContainer>
              <ThumbContainer>
                <img src={baseImgUrl + thumbnail}></img>
              </ThumbContainer>
              <InfoContent>
                <InfoLine>
                  <h3>{name}</h3>
                </InfoLine>
                <InfoLine>
                  <FaLocationDot /> <p>{address}</p>
                </InfoLine>
                <InfoLine>
                  <IoIosTime />
                  <p>입실일</p>
                  <p>{check_in_date}</p>
                  <IoTime />
                  <p>퇴실일</p>
                  <p>{check_out_date}</p>
                </InfoLine>
                <InfoLine></InfoLine>
                <InfoLine>
                  <p>{sity_type}</p>
                  <p>{capacity}명</p>
                  <p>{price}원</p>
                </InfoLine>
              </InfoContent>
              <DetailBtn onClick = {detailBtn}>상세보기</DetailBtn>
            </BookInfoContainer>
          </BookResultContainer>
        </div>
      ) : (
        <div>
          <NoticeContainer>
            <p>예약에 실패하였습니다. </p>
          </NoticeContainer>
          <BookResultContainer></BookResultContainer>
        </div>
      )}
    </Container>
  );
}

export default BookResultPage;

const BookResultContainer = styled.div`
  width: 1400px;
  margin : 0 auto;
`;

const BookInfoContainer = styled.div`
  width: 1200px;
  border: 1px solid #cccccc;
  height: 300px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 50px auto;
`;

const InfoLine = styled.div`
  display: flex;
  align-items: center;
  h3,
  p {
    margin: 15px 10px;
  }
  p {
    font-size: 17px;
  }
  svg {
    margin : 5px;
  }
`;

const ThumbContainer = styled.div`
  width: 300px;

  img {
    width: 300px;
    height: 300px;
  }
`;

const InfoContent = styled.div`
  width: 840px;
  padding: 30px 120px;
`;

const DetailBtn = styled.div`
    cursor : pointer;
    width : 100px;
    height : 50px;
    line-height : 50px;
    text-align : center;
    border : 1px solid #000000;
    position : absolute;

    right : 3%;
    bottom : 5%;
    
    color : #FFFFFF;
    background-color : #000000;
    border-radius: 10%;
`