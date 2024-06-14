import styled from "styled-components";
import NavBar from "../components/NavBar";
import { Container } from "../styles/Page";
import { useLocation, useNavigate } from "react-router-dom";
import BookCalendar from "../components/BookCalendar";
import { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosTime } from "react-icons/io";
import { IoTime } from "react-icons/io5";
import { book, getAcceptBookedDates, getBookedDates, getCampFromSite, getSite, getWaitBookedDates } from "../services/campsite";
import { formatTime } from "./SiteDetailPage";
import checkIsLogin from "../services/auth";

const baseImgUrl = "images/";

function BookPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const isLogin = checkIsLogin();
  
  const { id } = location.state.subsite_id;

  const [camp, setCamp] = useState({});
  const [site, setSite] = useState({});
  const [bookedDates, setBookedDates] = useState([]);
  const [waitBookedDates, setWaitBookedDates] = useState([]);

  const [selectedDates, setSelectedDates] = useState([null, null]);

  const [numOfDate, setNumOfDate] = useState(0);
  const [numOfAdult, setNumOfAdult] = useState(1);
  const [numOfKid, setNumOfKid] = useState(0);

  const { name, address, check_in_time, check_out_time } = camp;
  const { site_type, capacity, price, thumbnail } = site;

  useEffect(() => {
    if (!isLogin) {
      navigate('/login');
    }
    getCampFromSite(id).then(data => {setCamp(data.campsite[0])})
    getSite(id).then(data => {setSite(data.subsite[0])})
    getAcceptBookedDates(id).then(data => handleBookedDates(data.dates, "accept"))
    getWaitBookedDates(id).then(data => handleBookedDates(data.dates, "wait"))
  }, [])

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
    setNumOfDate(result.length);
  };

  const handleBookedDates = (dates, type) => {
    let reserved = [];
    
    dates.map((d) => {
      let tempDate = new Date(d.check_in_date);
      while (tempDate < new Date(d.check_out_date)) {
        tempDate.setDate(tempDate.getDate() + 1);
        reserved.push(tempDate.toISOString().slice(0, 10));
      }
      if (type === "accept") {
        setBookedDates(reserved);
      }
      if (type === "wait") {
        setWaitBookedDates(reserved);
      }
    })
  }

  const handleNOPChange = (operator, type) => {
    if (operator === "minus") {
      if ((numOfAdult + numOfKid) > 0) {
        if (type === "adult") {
          if (numOfAdult > 1) {
            setNumOfAdult(numOfAdult - 1);
          }
        }
        else {
          if (numOfKid > 0) {
            setNumOfKid(numOfKid - 1);
          }
        }
      }
    }
    if (operator === "plus") {
      if ((numOfAdult + numOfKid) < capacity) {
        if (type === "adult") {
          setNumOfAdult(numOfAdult + 1);
        }
        else {
          setNumOfKid(numOfKid + 1);
        }
      }
    }
  };

  const handleBook = () => {
    if (selectedDates[1] == null) {
      alert("날짜를 선택해주세요. ");
      return;
    } else {
      const bookData = {
        user_id : sessionStorage.getItem("id"),
        subsite_id : id,
        check_in_date : `${selectedDates[0].getFullYear()}-${String(selectedDates[0].getMonth() + 1).padStart(2, '0')}-${String(selectedDates[0].getDate()).padStart(2, '0')}`,
        check_out_date : `${selectedDates[1].getFullYear()}-${String(selectedDates[1].getMonth() + 1).padStart(2, '0')}-${String(selectedDates[1].getDate()).padStart(2, '0')}`,
        adults : numOfAdult,
        kids : numOfKid,
        price : price * numOfDate,
        accept : 0,
      };
      book(bookData).then(data => { 
        if(data) {
          navigate("/book/result", {state:{isbook : true, book:bookData, camp : camp, site : site}});
        }
        else {
          navigate("/book/result", {state:{isbook : false}});
        }
    })
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
            <p>{formatTime(check_in_time)}</p>  
            <IoTime />
            <p>체크아웃</p>
            <p>{formatTime(check_out_time)}</p>
          </InfoLine>
          <InfoLine></InfoLine>
          <InfoLine>
            <p>{site_type}</p>
            <p>{capacity}명</p>
            <p>{price}원</p>
          </InfoLine>
        </InfoContent>
      </BookInfoContainer>
      <BookContainer>
        <BookCalendar
          onChange={handleDateChange}
          getDateRange = {getDateRange}
          reservedDates={bookedDates}
          waitDates = {waitBookedDates}
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
              <span>성인</span>
              <span>유아</span>
            </BoxTextLine>
            <BoxTextLine>
              <ControlBtn onClick={() => handleNOPChange("minus", "adult")}>&#60;</ControlBtn>
              <p>{numOfAdult}</p>
              <ControlBtn onClick={() => handleNOPChange("plus", "adult")}>&#62;</ControlBtn>
              <ControlBtn onClick={() => handleNOPChange("minus", "kid")}>&#60;</ControlBtn>
              <p>{numOfKid}</p>
              <ControlBtn onClick={() => handleNOPChange("plus", "kid")}>&#62;</ControlBtn>
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
