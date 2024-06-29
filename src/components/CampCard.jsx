import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from 'axios';

function CampCard({camp_data}) {
    const { campsite_id, name } = camp_data;
    const [thumbnail, setThumbnail] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        async function getCampImg() {
            try {
                const response = await axios.get(`http://127.0.0.1:3001/camp/img/?id=${campsite_id}`, {
                    responseType: 'arraybuffer'
                })

                const uint8Array = new Uint8Array(response.data);
                const blob = new Blob([uint8Array], { type: 'image/jpeg' });
                const imageUrl = URL.createObjectURL(blob);
                setThumbnail(imageUrl);
            } catch (error) {
                console.log(error)
            }
        }
        getCampImg()
    }, [])

    return(
        <CampsiteCard>
        <CampsiteDetails>
                <h3>{name}</h3>
              </CampsiteDetails>
              <img src={thumbnail} alt={name} style={{ width: '200px', height: '150px' }} />
              <ButtonContainer>
                <DetailButton onClick={() => navigate(`/detail/${campsite_id}`)}>상세보기</DetailButton>
              </ButtonContainer>
              </CampsiteCard>
    );
}

export default CampCard;

const CampsiteCard = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CampsiteDetails = styled.div`
  margin-right: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const DetailButton = styled.button`
  padding: 10px 20px;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #333;
  }
`;