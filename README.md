# 캠핑장 예약 사이트 - SE Camp  

### 2024년도 1학기 웹 프로그래밍 프로젝트
<br>

### 사용 기술
- REACT, JavaScript, CSS, Express, Node.js, MySQL

### 역할 분담
- 공통 : 각 파트 API 작성
- 이경민 : DB 설계, 백엔드 기초 설계, 공통 컴포넌트 개발, 로그인, 캠핑장 상세 조회, 캠핑장 예약 기능
- 윤영빈 : 메인 화면, 마이 페이지(고객), 리뷰 작성
- 이영재 : 마이 페이지(캠핑장 관리자), 캠핑장 등록, 예약 확정


### 주요 기능
1. 로그인 및 로그아웃 (이경민)  
<image src= "https://github.com/user-attachments/assets/8f04a729-fbc8-49f9-882c-4be27eaa0f6f" alt="로그인 페이지"><br><br>  


2. 캠핑장 검색 및 조회 (이경민, 윤영빈)  
   - 캠핑장 목록을 조회합니다.
   - 이름, 예약 희망 날짜를 기준으로 예약 가능한 캠핑장을 검색할 수 있습니다..  
<image src= "https://github.com/user-attachments/assets/0f8b59f8-0dff-4315-b272-286f5c0a90ff" alt="메인 페이지"><br><br>  


3. 캠핑장 상세 정보 조회 (이경민)
   - 캠핑장의 상세 정보, 리뷰, 예약 기능을 제공합니다.
   - Carousel을 이용해 캠핑장 사진을 보여줍니다.  
<image src= "https://github.com/user-attachments/assets/2b79c8b0-0e3a-4c45-b551-eb8cee48909b" alt = "상세 정보 1">  
<image src= "https://github.com/user-attachments/assets/5eb6ea82-60af-4a09-9c1d-a303034f8792" alt = "상세 정보 2"><br><br>  


4. 캠핑장 예약 (이경민)
   - DatePicker를 이용해 캠핑장 예약 현황을 제공합니다.
   - 입실일, 퇴실일 / 사용 인원을 입력하여 예약합니다.
   - 빨간색은 예약 확정된 날짜를, 파란색은 예약 대기 중인 날짜를 의미합니다.
   - 당일 예약은 불가능하며, 이미 예약된 날짜에는 예약할 수 없습니다.  
<image src= "https://github.com/user-attachments/assets/ce26224b-8dab-4cb9-add8-39d25c139605" alt = "캠핑장 예약 1">
<image src= "https://github.com/user-attachments/assets/0ff92de0-2f7a-4046-b1b9-5a99265534df" alt = "캠핑장 예약 2">
<image src= "https://github.com/user-attachments/assets/c1ae195e-e5c2-41fe-b490-12289a9e18a9" alt = "예약 확인"><br><br>  


5. 예약 정보 조회 (윤영빈)  
<image src= "https://github.com/user-attachments/assets/d233890a-d146-4e94-b996-bd8441e06a1c" alt = "예약 정보"><br><br>  

6. 리뷰 작성 및 관리 (윤영빈)  
<image src= "https://github.com/user-attachments/assets/287b41ab-ad28-498c-ba28-8306a2e0ca75" alt = "리뷰 작성"><br><br>

7. 기타 관리자 페이지 中 캠핑장 등록 (이영재)
<image src="https://github.com/user-attachments/assets/727a6a39-a910-471d-a4ee-ff45ae2cb48f" alt = "캠핑장 등록"><br><br>
