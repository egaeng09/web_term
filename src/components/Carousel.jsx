import React, { useState } from "react";

import { styled } from "styled-components";

const baseImgUrl = "images/";
const imgData = [
  {
    id: 0,
    url: "img_tent1.png",
  },
  {
    id: 1,
    url: "img_tent2.png",
  },
  {
    id: 2,
    url: "img_tent3.png",
  },
];

const TOTAL_SLIDES = imgData.length;

function Carousel(props) {
  const [currentSlide, setCurrentSlide] = useState(0);

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
        {imgData.map((m) => (
          <img key={m.id} src= {baseImgUrl + m.url} alt={`picture ${m.id}`} />
        ))}
      </CarouselContainer>
      <ButtonContainer className="button-container">
        <ChangeButton onClick={move} data-btntype={"prev"}>
          &#60;
        </ChangeButton>
        <p>{currentSlide + 1}</p>
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