import React from "react";
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

    &:not(:first-of-type) {
      margin-left: 1rem;
    }
    input {
      display: none;
    }
    label {
      font-weight: 700;
      color: #111;
      text-align: center;
      text-transform: uppercase;
      cursor: pointer;
      font-size: 16px;
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
export function Radiobutton({ children, name, selected, required, value }) {
  return (
    <StyledRadioButton className='input'>
      <label htmlFor={children.replace(/\s/g, "")}> {children}</label>
      <input
        selected={selected === children}
        name={name}
        required={required}
        value={value ? value : children}
        type='radio'
        id={children.replace(/\s/g, "")}
      ></input>
    </StyledRadioButton>
  );
}

export default Radiobutton;
