import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { lighten, modularScale } from "polished";

const showAnimation = keyframes`

0% {
     transform:scaleY(0.1);
}
40% {
     transform:scaleY(1.04);
}
60% {
     transform:scaleY(0.98);
}
80% {
     transform:scaleY(1.04);
}
100% {
     transform:scaleY(0.98);
}               
80% {
     transform:scaleY(1.02);
}
100% {
     transform:scaleY(1);
}
`;

const hideAnimation = keyframes`
0% {
   transform:scaleY(1);
  }
  60% {
   transform:scaleY(0.98);
  }
  80% {
   transform:scaleY(1.02);
  }
  100% {
   transform:scaleY(0);
  }

`;
const StyledDropdownContainer = styled.ul`
  & {
    list-style: none;
    padding: 0;
    margin: 0 0 20px 0;

    a {
      text-decoration: none;
    }

    .dropdown .dropdown-toggle {
      position: relative;
      display: block;
      color: white;
      background: #3b3f45;
      padding: 10px;
      &:hover {
        background: ${lighten("0.03", "#3b3f45")};
      }
    }

    .icon-arrow {
      position: absolute;
      display: block;
      font-size: 0.7em;
      color: #fff;
      top: 14px;
      right: 10px;

      &.open {
        transform: rotate(180deg);
        transition: transform 0.6s;
      }
      &.close {
        transform: rotate(0deg);
        transition: transform 0.6s;
      }
    }
  }
`;

const StyledDropdown = styled.li`
  & .icon-arrow {
    position: absolute;
    display: block;
    font-size: 0.7em;
    color: #fffed8;
    top: 14px;
    right: 10px;

    &.open {
      transform: rotate(180deg);
      transition: transform 0.6s;
    }
    &.close {
      transform: rotate(0deg);
      transition: transform 0.6s;
    }
  }

  & .icon-arrow::before {
    content: "\\25BC";
  }
`;

const DropdownMenu = styled.ul`
  & {
    max-height: 0;
    overflow: hidden;
    list-style: none;
    padding: 0;
    margin: 0 0 20px 0;
    li {
      padding: 0;

      a {
        display: block;
        color: ${(props) => props.theme.darken_gray};
        background: ${(props) => props.theme.gray};
        padding: 10px 10px;
      }
    }

    &.show,
    &.hide {
      transform-origin: 50% 0%;
    }

    &.show {
      display: block;
      max-height: 99999px;
      transform: scaleY(1);
      animation: ${showAnimation} 0.5s ease-in-out;
      transition: max-height 1s ease-in-out;
    }

    &.hide {
      max-height: 0;
      transform: scaleY(0);
      animation: ${hideAnimation} 0.5s ease-out;
      transition: max-height 0.6s ease-out;
    }
  }
`;
function Dropdown({ children, title, className, setActive, active }) {
  const [menu, setMenu] = useState("hide");
  const [arrow, setArrow] = useState("close");
  const handleClick = (e) => {
    if (menu == "hide") {
      setMenu("show");
      setArrow("open");
    } else {
      setMenu("hide");
      setArrow("close");
    }
  };

  useEffect(() => {
    let dropdown_items = document.querySelectorAll(".dropdown-menu__item");
    dropdown_items.forEach((element) => {
      element.addEventListener("click", function () {
        let active_dropdown_items = document.querySelectorAll(
          ".dropdown-menu__item.active"
        );
        active_dropdown_items.forEach((item) => {
          item.classList.remove("active");
        });
        this.classList.add("active");
        setActive(this.children[0].innerText);
        setMenu("hide");
        setArrow("close");
      });
    });
  }, []);
  return (
    <StyledDropdownContainer className={`dropdown-container ${className}`}>
      <StyledDropdown className='dropdown'>
        <a
          data-toggle='dropdown'
          href='#'
          className='dropdown-toggle'
          onClick={(e) => handleClick(e)}
        >
          {active !== "" ? active : title}
          <i className={`icon-arrow ${arrow}`}></i>
        </a>
        <DropdownMenu className={`dropdown-menu ${menu}`}>
          {children}
        </DropdownMenu>
      </StyledDropdown>
    </StyledDropdownContainer>
  );
}

export default Dropdown;
