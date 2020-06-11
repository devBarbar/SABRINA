import React from "react";
import styled from "styled-components";

const Content = styled.div`
  margin: 0 auto;
  top: 10%;
  width: 90%;
`;

function Layout({ title, children }) {
  return (
    <div className='fs-form-wrap' id='fs-form-wrap'>
      <div className='fs-title'>
        <h1>{title}</h1>
      </div>
      <Content className='fs-form  '>{children}</Content>
    </div>
  );
}

export default Layout;
