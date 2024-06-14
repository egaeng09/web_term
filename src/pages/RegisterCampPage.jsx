import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import NavBar from '../components/NavBar';

import { Container } from "../styles/Page";
import { checkIsAdmin } from '../services/auth';

function RegisterCampPage() {
  const [formData, setFormData] = useState({
    owner_id: sessionStorage.getItem("id"),
    campsite_name: '',
    campsite_address: '',
    campsite_contact: '',
    information: '',
    check_in_time: '',
    check_out_time: '',
    thumbnail: null,
    start_manner_time: '',
    end_manner_time: '',
    amenities: [],
    sites: []
  });
  const navigate = useNavigate();

  const IsAdmin = checkIsAdmin();
  useEffect(() => {
    if (!IsAdmin) {
        navigate('/');
      }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'thumbnail') {
      setFormData({ ...formData, [name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAmenityChange = (index, value) => {
    const newAmenities = [...formData.amenities];
    newAmenities[index] = value;
    setFormData({ ...formData, amenities: newAmenities });
  };

  const addAmenity = () => {
    setFormData({ ...formData, amenities: [...formData.amenities, ''] });
  };

  const handleSiteChange = (index, field, value) => {
    const newSites = [...formData.sites];
    newSites[index][field] = value;
    setFormData({ ...formData, sites: newSites });
  };

  const addSite = () => {
    setFormData({ ...formData, sites: [...formData.sites, { site_type: '', capacity: '', price: '', site_thumbnail: null }] });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const formDataToSend = new FormData();
  Object.keys(formData).forEach(key => {
    if (key === 'thumbnail') {
      formDataToSend.append(key, formData[key]);
    } else if (key !== 'amenities' && key !== 'sites') {
      formDataToSend.append(key, formData[key]);
    }
  });

  try {
    const response = await axios.post('http://localhost:3001/api/campsites', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    const campsiteId = response.data.campsiteId;

    // Register amenities and sites
    const amenityPromises = formData.amenities.map(amenity =>
      axios.post('http://localhost:3001/api/amenities', { amenity_name: amenity })
    );
    const amenities = await Promise.all(amenityPromises);

    const campsiteAmenityPromises = amenities.map(amenityResponse =>
      axios.post('http://localhost:3001/api/campsiteamenities', {
        campsite_id: campsiteId,
        amenity_id: amenityResponse.data.amenityId
      })
    );
    await Promise.all(campsiteAmenityPromises);

    // Register sites
    console.log("사이트 배열: ", formData.sites);
      const sitePromises = formData.sites.map(site =>
        axios.post('http://localhost:3001/api/subsites', { ...site, campsite_id2: campsiteId },
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })
    );
    await Promise.all(sitePromises);


    alert('캠핑장이 성공적으로 등록되었습니다.');
    navigate('/owner');
  } catch (error) {
    console.error('등록 실패:', error);
    alert('등록 실패: ' + (error.response?.data || '서버 오류'));
  }
};

  return (
    <Container>
        <NavBar/>
        <PageContainer>
      <h1>캠핑장 등록</h1>
      <Form onSubmit={handleSubmit}>
        <Label>
          캠핑장 이름:
          <Input type="text" name="campsite_name" value={formData.campsite_name} onChange={handleChange} />
        </Label>
        <Label>
          주소:
          <Input type="text" name="campsite_address" value={formData.campsite_address} onChange={handleChange} />
        </Label>
        <Label>
          연락처:
          <Input type="text" name="campsite_contact" value={formData.campsite_contact} onChange={handleChange} />
        </Label>
        <Label>
          숙소 소개:
          <TextArea name="information" value={formData.information} onChange={handleChange} />
        </Label>
        <Label>
          체크인 시간:
          <Input type="time" name="check_in_time" value={formData.check_in_time} onChange={handleChange} />
        </Label>
        <Label>
          체크아웃 시간:
          <Input type="time" name="check_out_time" value={formData.check_out_time} onChange={handleChange} />
        </Label>
        <Label>
          시작 매너 시간:
          <Input type="time" name="start_manner_time" value={formData.start_manner_time} onChange={handleChange} />
        </Label>
        <Label>
          종료 매너 시간:
          <Input type="time" name="end_manner_time" value={formData.end_manner_time} onChange={handleChange} />
        </Label>
         <Label>
          캠프 사진:
          <Input type="file" name="thumbnail" onChange={(e) => handleChange(e)} />
        </Label>
        <Label>
          편의시설:
          {formData.amenities.map((amenity, index) => (
            <div key={index}>
              <Input
                type="text"
                value={amenity}
                onChange={(e) => handleAmenityChange(index, e.target.value)}
              />
            </div>
          ))}
          <AddButton type="button" onClick={addAmenity}>편의시설 추가</AddButton>
        </Label>
        <Label>
          사이트:
          {formData.sites.map((site, index) => (
            <SiteContainer key={index}>
              <SiteInput
                type="text"
                placeholder="사이트 유형"
                value={site.site_type}
                onChange={(e) => handleSiteChange(index, 'site_type', e.target.value)}
              />
              <SiteInput
                type="number"
                placeholder="최대 인원"
                value={site.capacity}
                onChange={(e) => handleSiteChange(index, 'capacity', e.target.value)}
              />
              <SiteInput
                type="number"
                placeholder="가격"
                value={site.price}
                onChange={(e) => handleSiteChange(index, 'price', e.target.value)}
              />
              <SiteInput
                type="file"
                placeholder="사이트 썸네일"
                onChange={(e) => handleSiteChange(index, 'site_thumbnail', e.target.files[0])}
              />
            </SiteContainer>
          ))}
          <AddButton type="button" onClick={addSite}>사이트 추가</AddButton>
        </Label>
        <Button type="submit">등록하기</Button>
      </Form>
    </PageContainer>
    </Container>
  );
}

export default RegisterCampPage;

const PageContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = styled.label`
  font-size: 1.2rem;
  color: #333;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 1rem;
  border: 2px solid #ccc;
  border-radius: 4px;
  margin-top: 5px;
`;

const TextArea = styled.textarea`
  height: 100px;
  padding: 8px;
  font-size: 1rem;
  border: 2px solid #ccc;
  border-radius: 4px;
  margin-top: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1.2rem;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const AddButton = styled.button`
  padding: 8px 16px;
  font-size: 1rem;
  color: white;
  background-color: #28a745;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

const SiteContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #e9ecef;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const SiteInput = styled(Input)`
  margin-top: 0;
`;