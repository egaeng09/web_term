import React, { useEffect, useState } from "react";

import { styled } from "styled-components";
import { getReviewImg } from "../services/campsite";


function ReviewCard({ review_data }) {
    
    const { id, name, check_in_date, check_out_date, adult, child, content, star } = review_data;

    const [imgUrl, setImgUrl] = useState();

    useEffect(() => {
        getReviewImg(id).then(data => {
            const uint8Array = new Uint8Array(data);
            const blob = new Blob([uint8Array], { type: 'image/jpeg' });
            const imageUrl = URL.createObjectURL(blob);
            setImgUrl(imageUrl);
        })
    }, []);

    const staring = () => {
        const result = [];
        for (let i = 0; i < star; i++) {
          result.push(<span key={i}>🖤</span>);
        }
        for (let i = 0; i < 5 - star; i++) {
            result.push(<span key={i}>🤍</span>);
          }
        return result;
      };

      const parseDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA');
    }

    return(
        <Container>
            <ReviewThumb>
                <img src = {imgUrl} />
            </ReviewThumb>
            <SummaryContainer>
                <LineContainer>
                    <h4>{name}</h4> <p>{staring()}</p> <p>{parseDate(check_in_date)} ~ {parseDate(check_out_date)}</p> <p>{adult + child}명</p>
                </LineContainer>
                <LineContainer>
                    <p>{content}</p>
                </LineContainer>
            </SummaryContainer>
        </Container>
    );
}

export default ReviewCard;

const Container = styled.div`
    width : 100%;
    border : 1px solid #CCCCCC;
    height : 200px;
    margin-bottom : 30px;
    display : flex;
    position : relative;
`

const ReviewThumb = styled.div`
    width : 200px;
    img {
        width : 200px;
        height : 200px;
    }
`

const SummaryContainer = styled.div`
    max-width : 900px;
    width : 900px;
    padding : 10px;
`

const LineContainer = styled.div`
    display : flex;
    align-items : center;
    h4, p {
        margin : 7px 15px;
    }
    p {
        font-size : 17px;
    }
`