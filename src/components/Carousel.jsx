import React, { useEffect, useState } from "react";

import { styled } from "styled-components";
import { getSiteImg } from "../services/campsite";


function Carousel({sites, imgUrl}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [TOTAL_SLIDES, setTOTAL_SLIDES] = useState(0);
  const [siteImgs, setSiteImgs] = useState([]);
  
  useEffect(() => {
    async function fetchSiteImages() {
      const imagePromises = sites.map(async (site) => {
        const data = await getSiteImg(site.id);
        const uint8Array = new Uint8Array(data);
        const blob = new Blob([uint8Array], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
      });

      const images = await Promise.all(imagePromises);
      setSiteImgs(images);
      setTOTAL_SLIDES(1 + sites.length);
    }

    if (sites.length > 0) {
      fetchSiteImages();
    }
  }, [sites]);


  const move = (e) => {
    const btnType = e.target.dataset.btntype;

    if (btnType === "next") {
      setCurrentSlide((currentSlide + 1) % TOTAL_SLIDES); // 오일러 연산?
    }
    if (btnType === "prev") {
      setCurrentSlide(
        currentSlide - 1 < 0 ? TOTAL_SLIDES - 1 : currentSlide - 1
      );
    }
  };

  return (
    <Container>
      <CarouselContainer
        style={{ transform: `translateX(-${currentSlide}00%)` }}
      >
        <img src= {imgUrl} alt={"main"} />
        {siteImgs.map((m, key) => (
          <img key={m.id} src= {m} alt={`picture ${m.id}`} />
          
        ))}
      </CarouselContainer>
      <ButtonContainer className="button-container">
        <ChangeButton onClick={move} data-btntype={"prev"}>
          &#60;
        </ChangeButton>
        <p>{currentSlide + 1} / {TOTAL_SLIDES}</p>
        <ChangeButton onClick={move} data-btntype={"next"}>
          &#62;
        </ChangeButton>
      </ButtonContainer>
    </Container>
  );
}

export default Carousel;

const Container = styled.div`
  width: 500px;
  margin: 0 auto;
  overflow: hidden;
  text-align: center;
`;

const CarouselContainer = styled.div`
  margin: 0 auto;
  margin-bottom: 2em;
  display: flex;
  transition-duration: 0.5s;

  img {
    width: 500px;
    height: 500px;
    min-width : 500px;
    min-height: 500px;
  }
`;

const ButtonContainer = styled.div`
    margin: 0 auto;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items : center;
    p {
    }
`;

const ChangeButton = styled.button`
    font-size: large;
    padding: 10px;
    border: none;
    border-radius: 10%;
    margin: 0px 10px;

    width : 40px;
    height : 40px;

    color : #FFFFFF;
    background-color : #000000;
`