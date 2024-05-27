import React from "react";

import { Container } from '../styles/Page'
import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";

function SiteDetailPage(props) {
    return (
      <Container>
          <NavBar></NavBar>
          <Carousel></Carousel>
      </Container>
    );
  }
  
  export default SiteDetailPage;