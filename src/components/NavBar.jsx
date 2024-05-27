import React, { useState, useRef } from "react";
import styled from 'styled-components'

function NavBar() {
    return(
        <NavContainer>
            <MenuItem>캠핑장</MenuItem>
            <MenuItem>캠핑장</MenuItem>
            <MenuItem>캠핑장</MenuItem>
        </NavContainer>
    );
}

export default NavBar;

const NavContainer = styled.div`
    width : 100%;
    height : 100px;
    background-color: #333333
`

const MenuItem = styled.span`
    color : #FFFFFF;
    font-size : 1.5rem;
`