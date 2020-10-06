import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
const StyledRadioButton = styled.span`
  &,
  & label {
    width: 100%;
    float: left;
    position: relative;
  }

  &.input {
    overflow: hidden;
    border-radius: 2px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.2);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16),
      0 2px 10px 0 rgba(0, 0, 0, 0.12);
    transition: 300ms;
    margin: 10px;
    input {
      display: none;
    }
    label {
      font-weight: 400;
      color: #fff;
      text-align: center;
      text-transform: uppercase;
      cursor: pointer;
      font-size: 14px;
      z-index: 3;
      transition: 300ms;
      height: 45px;
      line-height: 45px;
    }
  }

  &.input:hover {
    box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18),
      0 4px 15px 0 rgba(0, 0, 0, 0.15);
  }

  & label:hover {
    letter-spacing: 0.8px;
  }

  &.click-effect {
    background: #26a79a;
  }
`;
const Checkbox = ({ children, className, clickEffect, value }) => {
  return (
    <StyledRadioButton
      className={`input ${className} ${
        clickEffect && clickEffect.includes(children) ? "click-effect" : ""
      }`}
    >
      <label htmlFor={children}>{children}</label>
      <input type='checkbox' id={children}></input>
    </StyledRadioButton>
  );
};

export default Checkbox;
