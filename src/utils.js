export function ConvertDMSToDD(degrees, minutes, seconds, direction) {
  var dd = degrees + minutes / 60 + seconds / 360000;
  if (direction == "S" || direction == "W") {
    dd = dd * -1;
  }

  return dd;
}

export function downloadCSV(data, filename) {
  const csvContent = data.join("\n");
  const link = window.document.createElement("a");
  link.setAttribute(
    "href",
    "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csvContent)
  );
  link.setAttribute("download", filename);
  link.click();
}
