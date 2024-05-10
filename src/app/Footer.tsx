'use client';
import React, { useState } from 'react';
import styled from 'styled-components';

const RodapeContainer = styled.footer`
  background-color: #5F0000;
  color: white;
  padding: 20px;
  text-align: center;
`;

const Rodape = () => {
  return (
    <RodapeContainer>
      <p>&copy; 2024 BayArea-IESB.</p>
    </RodapeContainer>
  );
};

export default Rodape;
