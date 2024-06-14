import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { FaCampground } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { getSiteImg } from "../services/campsite";

function SubsiteCard({subsite_data, addImgs}) {
    const { id, site_type, capacity, price } = subsite_data;
    const [imgUrl, setImgUrl] = useState();
    
    const navigate = useNavigate();

    const bookBtn = () => {
      navigate('/book', {state:{subsite_id:{id}, img : {imgUrl}}});
    };

    useEffect(() => {
        getSiteImg(id).then(data => {
            const uint8Array = new Uint8Array(data);
            const blob = new Blob([uint8Array], { type: 'image/jpeg' });
            const imageUrl = URL.createObjectURL(blob);
            setImgUrl(imageUrl);
        })
    }, []);

    return(
        <Container>
            <ThumbContainer>
                <img src = {imgUrl}></img>
            </ThumbContainer>
            <InfoContent>
                <FaCampground/>
                <p>{site_type}</p>
                <p>{capacity}명</p>
                <p>{price}원</p>
            </InfoContent>
            <BookBtn onClick = {bookBtn}>예약하기</BookBtn>
        </Container>
    );
}

export default SubsiteCard;

const ThumbContainer = styled.div`
    width : 300px;
    img {
        width : 300px;
        height : 300px;
    }
`

const Container = styled.div`
    width : 44%;
    border : 1px solid #CCCCCC;
    height : 300px;
    margin-bottom : 30px;
    display : flex;
    justify-content : space-between;
    position : relative;
`

const InfoContent = styled.div`
    width : 500px;
    margin : 30px;
    p {

    }
`

const BookBtn = styled.div`
    cursor : pointer;
    width : 100px;
    height : 50px;
    line-height : 50px;
    text-align : center;
    border : 1px solid #000000;
    position : absolute;

    right : 5%;
    bottom : 5%;
    
    color : #FFFFFF;
    background-color : #000000;
    border-radius: 10%;
`