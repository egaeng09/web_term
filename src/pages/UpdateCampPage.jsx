import React, { useState } from "react";
import axios from 'axios';
import { Container } from "../styles/Page";
import NavBar from "../components/NavBar";
import styled from "styled-components";

function UpdateCampPage() {
  const [search, setSearch] = useState('');
  const [campInfo, setCampInfo] = useState(null);
  const [subsiteData, setSubsiteData] = useState([]);
  const [campAmenityInfo, setCampAmenityInfo] = useState([]);
  const [amenityData, setAmenityData] = useState([]);

  const handleSearch = async () => {
  try {
    const encodedSearch = encodeURIComponent(search);
    const responseCamp = await axios.get(`http://localhost:3001/api/campsites/${encodedSearch}`);
    if (!responseCamp.data || responseCamp.data.length === 0) {
      throw new Error('캠핑장 데이터가 없습니다.');
    }
    const campData = responseCamp.data[0]; // 첫 번째 캠핑장 정보를 사용
    setCampInfo({
      campsite_id: campData.campsite_id,
      owner_id: campData.owner_id,
      campsite_name: campData.name,
      campsite_address: campData.address,
      campsite_contact: campData.contact,
      information: campData.information,
      check_in_time: campData.check_in_time,
      check_out_time: campData.check_out_time,
      thumbnail: campData.thumbnail,
      start_manner_time: campData.start_manner_time,
      end_manner_time: campData.end_manner_time
    });

    const responseSub = await axios.get(`http://localhost:3001/api/subsites/${campData.campsite_id}`);
    if (!responseSub.data) {
      throw new Error('사이트 데이터가 없습니다.');
    }
    setSubsiteData(responseSub.data.map(subsite => ({
      subsite_id: subsite.id,
      campsite_id: subsite.campsite_id,
      site_type: subsite.site_type,
      capacity: subsite.capacity,
      price: subsite.price,
      site_thumbnail: subsite.site_thumbnail
    })));

    const responseCampSiteAmenity = await axios.get(`http://localhost:3001/api/findCampsiteAmenities/${campData.campsite_id}`);
    const campsiteAmenities = responseCampSiteAmenity.data;
    console.log('편의시설 테이블 값: ', campsiteAmenities);
    if (!campsiteAmenities) {
      throw new Error('편의시설 테이블 데이터가 없습니다.');
    }

    const amenityPromises = campsiteAmenities.map(async (amenity) => {
      console.log("편의시설 id: ", amenity.amenity_id);
      const responseAmenity = await axios.get(`http://localhost:3001/api/findAmenity/${amenity.amenity_id}`);
      const res = responseAmenity.data;
      console.log("각 편의시설 데이터: ", res);
      return res;
    });

    const amenityResponses = await Promise.all(amenityPromises);
    console.log("편의시설 데이터: ", amenityResponses);
 const amenityData = amenityResponses.map(responseArray => {
      const response = responseArray[0]; // 내부 배열을 풀어줌
      if (!response) {
        console.log("Amenity response is null or undefined");
        return { amenity_id: null, amenity_name: null };
      }
      return {
        amenity_id: response.amenity_id !== undefined ? response.amenity_id : null,
        amenity_name: response.amenity_name !== undefined ? response.amenity_name : null
      };
    });
    
    setAmenityData(amenityData);
    console.log("최종 편의시설 데이터: ", amenityData)

  } catch (error) {
    console.error('Error fetching campsite:', error);
    alert(error.message || '캠핑장을 찾을 수 없습니다.');
    setCampInfo(null);
    setSubsiteData([]);
    setAmenityData([]);
  }
};

  const handleCampInfoChange = (field, value) => {
    setCampInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

 const handleAmenityChange = (index, field, value) => {
  const updatedAmenities = [...amenityData];
  updatedAmenities[index] = { ...updatedAmenities[index], [field]: value };
  setAmenityData(updatedAmenities);
};

  const handleSiteChange = (index, field, value) => {
    const updatedSubsites = [...subsiteData];
    updatedSubsites[index] = { ...updatedSubsites[index], [field]: value };
    setSubsiteData(updatedSubsites);
  };

  const handleDeleteSite = async (index) => {
    try {
      await axios.delete(`http://localhost:3001/api/subsites/${subsiteData[index].subsite_id}`);
      const updatedSubsites = subsiteData.filter((_, i) => i !== index);
      setSubsiteData(updatedSubsites);
      alert('사이트가 삭제되었습니다.');
    } catch (error) {
      alert('사이트 삭제 실패');
    }
  };

 const handleUpdateSite = async (index) => {
  console.log('Updating site at index:', index);
  if (!subsiteData[index]) {
    console.error('No site data available at index:', index);
    alert('사이트 정보가 충분하지 않습니다.');
    return;
  }

  const site = subsiteData[index];
  const updateData = {
    site_type: site.site_type,
    capacity: site.capacity,
    price: site.price,
  };

   console.log('Sending update data:', updateData);
   console.log('subsite_id:', site.subsite_id);

  try {
    await axios.put(`http://localhost:3001/api/subsites/${site.subsite_id}`, updateData);
    console.log('Site updated successfully');
    alert('사이트 정보가 업데이트되었습니다.');
  } catch (error) {
    console.error('Site update failed:', error);
    alert('사이트 정보 업데이트 실패: ' + (error.response?.data || '서버 오류'));
  }
};

  const handleUpdateCampInfo = async () => {
  if (!campInfo || !campInfo.campsite_id) {
    alert('캠핑장 정보가 충분하지 않습니다.');
    return;
  }

  try {
    const updateData = {
      campsite_name: campInfo.campsite_name,
      campsite_address: campInfo.campsite_address,
      campsite_contact: campInfo.campsite_contact,
      information: campInfo.information,
      check_in_time: campInfo.check_in_time,
      check_out_time: campInfo.check_out_time,
      start_manner_time: campInfo.start_manner_time,
      end_manner_time: campInfo.end_manner_time
    };

    await axios.put(`http://localhost:3001/api/campsites/${campInfo.campsite_id}`, updateData);
    
    for (let i = 0; i < amenityData.length; i++) {
        await handleUpdateAmenity(i);
    }
    alert('캠핑장 정보가 업데이트되었습니다.');
  } catch (error) {
    console.error('캠핑장 정보 업데이트 실패:', error);
    alert('캠핑장 정보 업데이트 실패: ' + (error.response?.data || '서버 오류'));
  }
};

const handleUpdateAmenity = async (index) => {
    console.log('Updating amenity at index:', index);
    if (!amenityData[index]) {
      console.error('No amenity data available at index:', index);
      alert('편의시설 정보가 충분하지 않습니다.');
      return;
    }
  
    const amenity = amenityData[index];
      const updateData = {
      amenity_id: amenity.amenity_id,
      amenity_name: amenity.amenity_name
    };
  
    console.log('Sending update data:', updateData);
    console.log('amenity_id:', amenity.amenity_id);
  
    try {
      await axios.put(`http://localhost:3001/api/amenityUp/${amenity.amenity_id}`, updateData);
      console.log('Amenity updated successfully');
    } catch (error) {
      console.error('Amenity update failed:', error);
      alert('편의시설 정보 업데이트 실패: ' + (error.response?.data || '서버 오류'));
    }
  };

  return (
    <Container>
      <NavBar />
      <SearchContainer>
        <input
          type="text"
          placeholder="캠핑장 이름 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
      </SearchContainer>
      {campInfo && (
        <CampInfoContainer>
          <h2>캠핑장 기본 정보</h2>
          <label>캠핑장 이름</label>
          <InfoInput
            type="text"
            placeholder="캠핑장 이름"
            value={campInfo.campsite_name}
            onChange={(e) => handleCampInfoChange("campsite_name", e.target.value)}
          />
          <label>주소</label>
          <InfoInput
            type="text"
            placeholder="주소"
            value={campInfo.campsite_address}
            onChange={(e) => handleCampInfoChange("campsite_address", e.target.value)}
          />
          <label>연락처</label>
          <InfoInput
            type="text"
            placeholder="연락처"
            value={campInfo.campsite_contact}
            onChange={(e) => handleCampInfoChange("campsite_contact", e.target.value)}
          />
          <label>숙소 소개</label>
          <InfoInput
            type="text"
            placeholder="정보"
            value={campInfo.information}
            onChange={(e) => handleCampInfoChange("information", e.target.value)}
          />
          <label>체크인 시간</label>
          <InfoInput
            type="time"
            placeholder="체크인 시간"
            value={campInfo.check_in_time}
            onChange={(e) => handleCampInfoChange("check_in_time", e.target.value)}
          />
          <label>체크아웃 시간</label>
          <InfoInput
            type="time"
            placeholder="체크아웃 시간"
            value={campInfo.check_out_time}
            onChange={(e) => handleCampInfoChange("check_out_time", e.target.value)}
          />
          <label>매너타임 시작</label>
          <InfoInput
            type="time"
            placeholder="매너타임 시작"
            value={campInfo.start_manner_time}
            onChange={(e) => handleCampInfoChange("start_manner_time", e.target.value)}
          />
          <label>매너타임 종료</label>
          <InfoInput
            type="time"
            placeholder="매너타임 종료"
            value={campInfo.end_manner_time}
            onChange={(e) => handleCampInfoChange("end_manner_time", e.target.value)}
          />
          <label>편의시설</label>
          {amenityData.map((amenity, index) => (
            <div key={index}>
              <InfoInput
                type="text"
                placeholder="편의시설"
                value={amenity.amenity_name}
                onChange={(e) => handleAmenityChange(index, "amenity_name", e.target.value)}
              />
            </div>
          ))}
          <UpdateButton onClick={handleUpdateCampInfo}>수정하기</UpdateButton>
        </CampInfoContainer>
      )}
      <SubsiteContainer>
      {subsiteData.map((site, index) => (
        <SubsiteCard key={site.subsite_id}>
          <SiteInput
            type="text"
            placeholder="사이트 유형"
            value={site.site_type}
            onChange={(e) => handleSiteChange(index, "site_type", e.target.value)}
          />
          <SiteInput
            type="number"
            placeholder="최대 인원"
            value={site.capacity}
            onChange={(e) => handleSiteChange(index, "capacity", e.target.value)}
          />
          <SiteInput
            type="number"
            placeholder="가격"
            value={site.price}
            onChange={(e) => handleSiteChange(index, "price", e.target.value)}
          />
          <EditButton onClick={() => handleUpdateSite(index)}>수정</EditButton>
          <DeleteButton onClick={() => handleDeleteSite(index)}>삭제</DeleteButton>
        </SubsiteCard>
      ))}
    </SubsiteContainer>
    </Container>
  );
}

export default UpdateCampPage;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);

  input {
    padding: 10px 15px;
    font-size: 16px;
    border: 2px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
    width: 300px; /* 입력 필드 너비 조정 */
    transition: border-color 0.3s;

    &:focus {
      border-color: #0056b3; /* 포커스 시 테두리 색상 변경 */
    }
  }

  button {
    padding: 10px 20px;
    font-size: 16px;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const CampInfoContainer = styled.div`
  width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const InfoInput = styled.input`
  padding: 8px;
  margin: 5px;
  font-size: 1rem;
  border: 2px solid #ccc;
  border-radius: 4px;
  width: 50%;
`;

const SubsiteContainer = styled.div`
  width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;

const SiteInput = styled.input`
  margin: 10px;
  padding: 8px;
  font-size: 1rem;
  border: 2px solid #ccc;
  border-radius: 4px;
`;

const UpdateButton = styled.button`
  padding: 8px 16px;
  font-size: 1rem;
  color: white;
  background-color: #28a745;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #218838;
  }
`;

const EditButton = styled(UpdateButton)`
  background-color: #007bff;
  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled.button`
  padding: 6px 12px;
  font-size: 0.8rem;
  color: white;
  background-color: #dc3545;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%; /* 버튼 너비를 카드에 맞춤 */
  margin-top: 10px;

  &:hover {
    background-color: #c82333;
  }
`;

const SubsiteCard = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
  margin: 10px;
  width: 300px; /* 카드의 너비를 고정하여 깔끔하게 표시 */
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
`;