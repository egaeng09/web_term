import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { FaCampground } from "react-icons/fa6";

const baseImgUrl = "images/";

function SubsiteCard({subsite_data}) {
    const { id, site_type, capacity, price, thumbnail } = subsite_data;
    
    const navigate = useNavigate();

    const bookBtn = () => {
      navigate('/book', {state:{subsite_id:{id}}});
    };

    return(
        <Container>
            <ThumbContainer>
                <img src = {baseImgUrl + thumbnail}></img>
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