import React from "react";

import { Container } from '../styles/Page'
import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";
import styled from "styled-components";
import SubsiteCard from "../components/SubsiteCard";

import { FaLocationDot, FaToiletPortable } from "react-icons/fa6";
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoIosInformationCircle, IoIosTime  } from "react-icons/io";
import { IoTime, IoTimerSharp  } from "react-icons/io5";

const baseImgUrl = "images/";

const info_data = {
    name : "진진당 캠핑장",
    address : "경상북도 구미시 대학로 3길",
    contact : "010-4212-1212",
    information : "낙동강을 끼고 즐기는 산장 캠핑",
    check_in_time : "15:00",
    check_out_time : "11:00",
    thumbnail : "img_tent2.png",
    start_manner_time : "00:00",
    end_manner_time : "05:00",
    amenities : [
        {
            name : "wifi"
        },
        {
            name : "화장실"
        },
        {
            name : "샤워실"
        }
    ]
};

const subsite_data = [
    {
        id : "1",
        sity_type : "카라반",
        capacity : 3,
        price : 100000,
        thumbnail : "img_tent4.png",
    },
    {
        id : "2",
        sity_type : "캠핑카",
        capacity : 5,
        price : 200000,
        thumbnail : "img_tent5.png",
    },
];

function SiteDetailPage(props) {
    const {name, address, contact, information, check_in_time, check_out_time, thumbnail, start_manner_time, end_manner_time, amenities} = info_data;

    return (
      <Container>
          <NavBar></NavBar>
          <InfoContainer>
            <Carousel/>
            <InfoContent>
                <InfoLine><h3>{name}</h3></InfoLine>
                <InfoLine><FaLocationDot/> <p>{address}</p></InfoLine>
                <InfoLine><BsFillTelephoneFill/><p>{contact}</p></InfoLine>
                <InfoLine><IoIosInformationCircle/><p>{information}</p></InfoLine>
                <InfoLine><IoIosTime/><p>체크인</p><p>{check_in_time}</p></InfoLine>
                <InfoLine><IoTime/><p>체크아웃</p><p>{check_out_time}</p></InfoLine>
                <InfoLine><IoTimerSharp/><p>매너 타임</p><p>{start_manner_time} ~ {end_manner_time}</p></InfoLine>
                <InfoLine><FaToiletPortable/><p>편의시설</p></InfoLine>
                <InfoLine>{amenities.map(a => <p>{a.name}</p>)}</InfoLine>
            </InfoContent>
          </InfoContainer>
          <SubsiteContainer>
            {subsite_data.map(m => <SubsiteCard subsite_data = {m} />)}
          </SubsiteContainer>
      </Container>
    );
  }
  
  export default SiteDetailPage;

  const InfoContainer = styled.div`
    display : flex;
    margin-bottom : 30px;
  `

  const InfoContent = styled.div`
    width : 600px;
  `

  const InfoLine = styled.div`
    display : flex;
    align-items : center;
    h3, p {
      margin : 15px 10px;
    }
    p {
      font-size : 17px;
    }
  `

  const SubsiteContainer = styled.div`
    width : 70%;
    margin : 0 auto;
  `