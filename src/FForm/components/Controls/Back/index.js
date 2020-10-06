import React from "react";

function Back({ clickHandler, show }) {
  return (
    <div>
      <button
        className={`fs-back ${show ? "fs-show" : ""}`}
        type='button'
        onClick={clickHandler}
      >
        Zurück
      </button>
    </div>
  );
}

export default Back;
