import React, { useEffect, useState } from "react";

import { Container, Contour } from "../styles/Page";
import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";
import styled from "styled-components";
import SubsiteCard from "../components/SubsiteCard";

import { FaLocationDot, FaToiletPortable } from "react-icons/fa6";
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoIosInformationCircle, IoIosTime } from "react-icons/io";
import { IoTime, IoTimerSharp } from "react-icons/io5";
import ReviewCard from "../components/ReviewCard";
import { getAmenities, getCamp, getCampImg, getCampReviews, getSiteImg, getSiteImgs, getSites } from "../services/campsite";
import { useParams } from "react-router-dom";

export const formatTime = (time) => {
  if (!time) return '';
  const parts = time.split(':');
  return `${parts[0]}:${parts[1]}`;
}

function SiteDetailPage() {
  const [camp, setCamp] = useState({});
  const [amenities, setAmenities] = useState([]);
  const [sites, setSites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [imgUrl, setImgUrl] = useState("");

  const params = useParams();
  const camp_id = params.camp_id;

  const {
    name,
    address,
    contact,
    information,
    check_in_time,
    check_out_time,
    start_manner_time,
    end_manner_time,
  } = camp;

  useEffect(() => {
    async function fetchData() {
      const campData = await getCamp(camp_id);
      setCamp(campData.campsite[0]);

      const sitesData = await getSites(camp_id);
      setSites(sitesData.subsites);

      const amenitiesData = await getAmenities(camp_id);
      setAmenities(amenitiesData.amenities);

      const reviewsData = await getCampReviews(camp_id);
      setReviews(reviewsData.reviews);

      const campImgData = await getCampImg(camp_id);
      const uint8Array = new Uint8Array(campImgData);
      const blob = new Blob([uint8Array], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      setImgUrl(imageUrl);
    }

    fetchData();
  }, [camp_id]);

  return (
    <Container>
      <NavBar></NavBar>
      <InfoContainer>
        <Carousel imgUrl = {imgUrl} sites = {sites}></Carousel>
        <InfoContent>
          <InfoLine>
            <h3>{name}</h3>
          </InfoLine>
          <InfoLine>
            <FaLocationDot /> <p>{address}</p>
          </InfoLine>
          <InfoLine>
            <BsFillTelephoneFill />
            <p>{contact}</p>
          </InfoLine>
          <InfoLine>
            <IoIosInformationCircle />
            <p>{information}</p>
          </InfoLine>
          <InfoLine>
            <IoIosTime />
            <p>체크인</p>
            <p>{formatTime(check_in_time)}</p>
          </InfoLine>
          <InfoLine>
            <IoTime />
            <p>체크아웃</p>
            <p>{formatTime(check_out_time)}</p>
          </InfoLine>
          <InfoLine>
            <IoTimerSharp />
            <p>매너 타임</p>
            <p>
              {formatTime(start_manner_time)} ~ {formatTime(end_manner_time)}
            </p>
          </InfoLine>
          <InfoLine>
            <FaToiletPortable />
            <p>편의시설</p>
          </InfoLine>
          <InfoLine>
            {amenities ?<> {amenities.map((a) => (
              <p>{a.amenity_name}</p>
            ))}</> : <></>}
          </InfoLine>
        </InfoContent>
      </InfoContainer>
      <Contour/>
      <SubsiteContainer>
        {sites.map((m, key) => (
          <SubsiteCard subsite_data={m}/>
        ))}
      </SubsiteContainer>
      <Contour/>
      <ReviewContainer>
        {reviews.map((m) => (
          <ReviewCard review_data={m} />
        ))}
      </ReviewContainer>
    </Container>
  );
}
export default SiteDetailPage;


const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  width: 1200px;
  margin: 0 auto;
  margin-bottom: 50px;
`;

const InfoContent = styled.div`
  width: 500px;
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
  flex-wrap : wrap;
`;

const SubsiteContainer = styled.div`
  width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;

const ReviewContainer = styled.div`
  width: 1100px;
  margin: 0 auto;
`;
