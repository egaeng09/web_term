import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

import CampCard from "../components/CampCard";

const MainPageContainer = styled.div``;

const Container = styled.div``;

const MainContainer = styled.div`
  margin: 30px;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
`;

const SearchButton = styled.button`
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

const FilterSelect = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

function MainPage() {
  const [campsites, setCampsites] = useState([]);
  const [searchParams, setSearchParams] = useState({
    name: "",
    check_in_date: "",
    check_out_date: "",
    location: "",
    type: "",
  });
  const [loadState, setLoadState] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCampsites() {
      try {
        const response = await axios.get("http://localhost:3001/campsites", {
          params: searchParams,
        });
        setCampsites(response.data.data);
        setLoadState(true);
      } catch (error) {
        console.error("캠핑장 목록 가져오기 실패:", error);
      }
    }

    fetchCampsites();
  }, []);

  const handleInputChange = (e) => {
    console.log(campsites);
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    async function fetchCampsites() {
      try {
        const response = await axios.get("http://localhost:3001/campsites", {
          params: searchParams,
        });
        console.log(response.data);
        setCampsites(response.data.data);
      } catch (error) {
        console.error("캠핑장 목록 가져오기 실패:", error);
      }
    }

    fetchCampsites();
  };

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <Container>
      <NavBar />
      <MainContainer>
        <h2>캠핑장 목록</h2>
        <SearchBar>
          <SearchInput
            type="text"
            name="name"
            placeholder="캠핑장 이름"
            onChange={handleInputChange}
          />
          <SearchInput
            type="date"
            name="check_in_date"
            placeholder="입실일"
            onChange={handleInputChange}
            min={getTodayDateString()}
          />
          <SearchInput
            type="date"
            name="check_out_date"
            placeholder="퇴실일"
            onChange={handleInputChange}
            min={getTodayDateString()}
          />
          <SearchInput
            type="text"
            name="location"
            placeholder="지역"
            onChange={handleInputChange}
          />
          <FilterSelect name="type" onChange={handleInputChange}>
            <option value="">유형 선택</option>
            <option value="캠핑">캠핑</option>
            <option value="글램핑">글램핑</option>
            <option value="카라반">카라반</option>
            <option value="펜션">펜션</option>
          </FilterSelect>
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </SearchBar>
        <MainPageContainer>
          {loadState ? (
            campsites && campsites.length > 0 ? (
              campsites.map((campsite) => (
                <CampCard key={campsite.campsite_id} camp_data={campsite} />
              ))
            ) : (
              <p>검색 결과가 없습니다.</p>
            )
          ) : (
            <p>Loading...</p>
          )}
        </MainPageContainer>
      </MainContainer>
    </Container>
  );
}

export default MainPage;
