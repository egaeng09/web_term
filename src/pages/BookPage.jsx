import styled from "styled-components";
import NavBar from "../components/NavBar";
import { Container } from "../styles/Page";
import { useLocation, useNavigate } from "react-router-dom";
import BookCalendar from "../components/BookCalendar";
import { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosTime } from "react-icons/io";
import { IoTime } from "react-icons/io5";

const baseImgUrl = "images/";

const temp_camp_data = {
  name: "진진당 캠핑장",
  address: "경상북도 구미시 대학로 3길",
  contact: "010-4212-1212",
  information: "낙동강을 끼고 즐기는 산장 캠핑",
  check_in_time: "15:00",
  check_out_time: "11:00",
  thumbnail: "img_tent2.png",
  start_manner_time: "00:00",
  end_manner_time: "05:00",
  amenities: [
    {
      name: "wifi",
    },
    {
      name: "화장실",
    },
    {
      name: "샤워실",
    },
  ],
};

const temp_site_data = {
  sity_type: "카라반",
  capacity: 3,
  price: 100000,
  thumbnail: "img_tent4.png",
};

const reservedDates = [
  new Date(2024, 5, 15), // 예: 2024년 6월 15일
  new Date(2024, 5, 20), // 예: 2024년 6월 20일
  // 추가적인 예약된 날짜를 이곳에 추가
];

function BookPage() {
  const navigate = useNavigate();

  const location = useLocation();
  
  const { id } = location.state.subsite_id;
  const { name, address, check_in_time, check_out_time } = temp_camp_data;
  const { sity_type, capacity, price, thumbnail } = temp_site_data;

  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [dateList, setDateList] = useState([]);
  const [numOfDate, setNumOfDate] = useState(0);
  const [numOfPeople, setNumOfPeople] = useState(1);

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

  const getDateRange = (start, end) => {
    let result = [];
    let tempDate = new Date(start); // tempDate를 start로 초기화

    while (tempDate < end) {
    // while (tempDate <= end) { 마지막 날짜 포함
        tempDate.setDate(tempDate.getDate() + 1); // tempDate를 하루 증가
        result.push(tempDate.toISOString().slice(0, 10));
    }
    setDateList(result);
    setNumOfDate(result.length);
  };

  const handleNOPChange = (type) => {
    if (type === 0) {
      if (numOfPeople <= 1) {
        setNumOfPeople(1);
      } else {
        setNumOfPeople(numOfPeople - 1);
      }
    }
    if (type === 1) {
      if (numOfPeople >= capacity) {
        setNumOfPeople(capacity);
      } else {
        setNumOfPeople(numOfPeople + 1);
      }
    }
  };

  const handleBook = () => {
    if (selectedDates[1] == null) {
      alert("날짜를 선택해주세요. ");
      return;
    } else {
      navigate("/book/result");
      console.log(dateList);
    }
  };

  return (
    <Container>
      <NavBar></NavBar>
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
            <p>체크인</p>
            <p>{check_in_time}</p>  
            <IoTime />
            <p>체크아웃</p>
            <p>{check_out_time}</p>
          </InfoLine>
          <InfoLine></InfoLine>
          <InfoLine>
            <p>{sity_type}</p>
            <p>{capacity}명</p>
            <p>{price}원</p>
          </InfoLine>
        </InfoContent>
      </BookInfoContainer>
      <BookContainer>
        <BookCalendar
          onChange={handleDateChange}
          getDateRange = {getDateRange}
          reservedDates={reservedDates}
        />
        <SelectedInfoContainer>
          <SelectedInfo>
            <BoxTextLine>
              <span>입실일</span>
              <span>퇴실일</span>
            </BoxTextLine>
            <BoxTextLine>
              <p>
                {selectedDates[0]
                  ? selectedDates[0].toLocaleDateString()
                  : "----. --. --."}
              </p>
              <p>~</p>
              <p>
                {selectedDates[1]
                  ? selectedDates[1].toLocaleDateString()
                  : "----. --. --."}
              </p>
            </BoxTextLine>
          </SelectedInfo>
          <SelectedInfo>
            <BoxTextLine>
              <span>인원</span>
            </BoxTextLine>
            <BoxTextLine>
              <ControlBtn onClick={() => handleNOPChange(0)}>&#60;</ControlBtn>
              <p>{numOfPeople}</p>
              <ControlBtn onClick={() => handleNOPChange(1)}>&#62;</ControlBtn>
            </BoxTextLine>
          </SelectedInfo>
        </SelectedInfoContainer>
        <BookBtn onClick={handleBook}>예약하기</BookBtn>
      </BookContainer>
      <TotalAmount>
        <BoxTextLine>
          <p>총</p>
          <p>{price * numOfDate}원</p>
        </BoxTextLine>
      </TotalAmount>
    </Container>
  );
}

export default BookPage;

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
  padding: 30px 100px;

`;

const BookBtn = styled.div`
  cursor: pointer;
  width: 100px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  border: 1px solid #000000;
  position: absolute;

  right: 19%;
  bottom: 5%;

  color: #ffffff;
  background-color: #000000;
  border-radius: 10%;
`;

const ControlBtn = styled.div`
  font-size: 18px;
  padding: 10px;
  border: none;
  border-radius: 10%;
  margin: 0px 10px;

  width: 20px;
  height: 20px;
  line-height: 20px;

  color: #ffffff;
  background-color: #000000;
`;

const BookContainer = styled.div`
  width: 1200px;
  display: flex;
  margin: 0 auto;
`;

const SelectedInfoContainer = styled.div`
  width: 600px;
`;

const SelectedInfo = styled.div`
  width: 600px;
  height: 100px;
  border: 1px solid #cccccc;
  margin-bottom: 50px;
`;

const BoxTextLine = styled.div`
  display: flex;
  margin: 0 auto;
  text-align: center;
  justify-content: center;

  p {
    font-size: 21px;
    margin: 5px 10px;
  }

  span {
    font-size: 18px;
    margin: 10px 40px;
  }
`;

const TotalAmount = styled.div`
  position: absolute;

  font-size: 18px;
  right: 27%;
  bottom: 6%;
`;
