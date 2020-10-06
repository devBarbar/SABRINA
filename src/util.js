export const format_euro = (amount) => {
  let formatted = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);

  return formatted;
};
export function localStringToNumber(stringNumber) {
  var thousandSeparator = (1111).toLocaleString().replace(/1/g, "");
  var decimalSeparator = (1.1).toLocaleString().replace(/1/g, "");

  return parseFloat(
    stringNumber
      .replace(new RegExp("\\" + thousandSeparator, "g"), "")
      .replace(new RegExp("\\" + decimalSeparator), ".")
  );
}

export const animate = function (elem, dict, ms) {
  var left = 0;
  function frame() {
    left++; // update parameters
    elem.style.left = left + "px"; // show frame
    if (left == 100)
      // check finish condition
      clearInterval(id);
  }
  var id = setInterval(frame, 10); // draw every 10ms
};
