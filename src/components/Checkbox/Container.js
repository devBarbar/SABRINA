import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";

const Area = styled.div`
  display: flex;
  flex-direction: row;
  width: 50%;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: auto;
`;
const Checkboxes = ({
  children,
  id,
  active,
  setActive,
  className,
  clickEffect,
}) => {
  const [clicked, setClicked] = useState();
  useEffect(() => {
    let inputFields = document.querySelectorAll(`#${id} .area label`);
    inputFields.forEach((element) => {
      element.addEventListener("click", function (e) {
        setClicked(e);
      });
    });
  }, []);

  useEffect(() => {
    let e = clicked;
    if (e) {
      let val = e.target.value ? e.target.value : e.target.htmlFor;
      let index = active.indexOf(val);

      if (index > -1) {
        let copy = active.slice();
        copy.splice(index, 1);
        setActive(copy);
      } else {
        setActive([...active, val]);
      }
    }
  }, [clicked]);

  return (
    <div id={id} className={`inputs ${className}`}>
      <Area className='area'>
        {children.map((child, index) =>
          React.cloneElement(child, { key: index, clickEffect: active })
        )}
      </Area>
    </div>
  );
};

export default Checkboxes;
