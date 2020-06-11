import React from "react";

function Item({ children }) {
  return (
    <li className='dropdown-menu__item'>
      <a href='#'>{children}</a>
    </li>
  );
}

export default Item;
