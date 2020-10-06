import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Area = styled.div`
  display: flex;
  flex-direction: row;

  .area .input.active {
  }
`;

const StyledContainer = styled.div``;
const HiddenInput = styled.input`
  && {
    display: none;
  }
`;
function RadioButtons({
  children,
  id,
  className,
  name,
  required,
  selected,
  setSelected,
}) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const inputs = document.querySelectorAll(`#${id} .area .input label`);
    inputs.forEach((element) => {
      element.addEventListener("click", function (e) {
        let rect = this.getBoundingClientRect();
        inputs.forEach((element) => {
          element.parentElement.classList.remove("click-effect");
        });
        element.parentElement.classList.add("click-effect");
        setActive(element.nextSibling.value);
        let val = document.querySelector(`#${id}_hidden`);
      });
    });
  }, []);

  useEffect(() => {
    setSelected(active);
  }, [active]);

  let setName = (buttons) => {
    return buttons.map((value, index) =>
      React.cloneElement(value, {
        key: index,
        name: name,
        required: required,
        selected: selected,
      })
    );
  };

  return (
    <StyledContainer id={id} className={`inputs radio-buttons ${className}`}>
      <Area className='area'>{setName(children)}</Area>
      <HiddenInput
        id={`${id}_hidden`}
        className='hidden'
        value={active}
        hidden
        required
      ></HiddenInput>
    </StyledContainer>
  );
}

export default RadioButtons;
