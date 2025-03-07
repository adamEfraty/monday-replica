import * as XLSX from "xlsx";

export const utilService = {
  makeId,
  saveToStorage,
  loadFromStorage,
  debounce,
  animateCSS,
  getRandomColor,
  formatDateToStr,
  formatStrToDate,
  formatDateToPerfectStr,
  formatPerfectStrToDate,
  formatDateStrToPerfectStr,
  getNameFromEmail,
  makeIdForLabel,
  milisecondsTimeCalc,
};

function makeId(length = 5) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function makeIdForLabel(length = 5) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return "label" + text;
}

function saveToStorage(key, value) {
  localStorage[key] = JSON.stringify(value);
}

function loadFromStorage(key, defaultValue = null) {
  var value = localStorage[key] || defaultValue;
  return JSON.parse(value);
}

// el = elementRef.current | animation = animation name |
// duration = animation duration in seconds |
// style = during animation some syle in scss might not apply.
// with this, you can add the missing style to the animation
// like this for example: {position: 'fixed', opacity: 1}
function animateCSS(el, animation, duration = 1, style = {}) {
  // Loop through all the style properties and apply them to the element
  for (const [key, value] of Object.entries(style)) {
    el.style[key] = value;
  }

  // Ensure the element has the animation duration
  el.style.animationDuration = `${duration}s`;

  const prefix = "animate__";
  return new Promise((resolve) => {
    const animationName = `${prefix}${animation}`;
    el.classList.add(`${prefix}animated`, animationName);

    function handleAnimationEnd(event) {
      event.stopPropagation();
      el.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    el.addEventListener("animationend", handleAnimationEnd, { once: true });
  });
}

export function debounce(func, delay) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function getExistingProperties(obj) {
  const truthyObj = {};
  for (const key in obj) {
    const val = obj[key];
    if (val || typeof val === "boolean") {
      truthyObj[key] = val;
    }
  }
  return truthyObj;
}

export function convertDateToString(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function simplifyTimeToStr(time) {
  const now = new Date().getTime();
  const timeSince = { timeUnit: "s", number: (now - time) / 1000 };

  if (timeSince.number > 3600 * 24 * 7) {
    (timeSince.timeUnit = "w"), (timeSince.number /= 3600 * 24 * 7);
  } else if (timeSince.number > 3600 * 24) {
    (timeSince.timeUnit = "d"), (timeSince.number /= 3600 * 24);
  } else if (timeSince.number > 3600) {
    (timeSince.timeUnit = "h"), (timeSince.number /= 3600);
  } else if (timeSince.number > 60) {
    (timeSince.timeUnit = "m"), (timeSince.number /= 60);
  }

  const timeObj = {
    timeUnit: timeSince.timeUnit,
    number: parseInt(timeSince.number),
  };

  return timeObj.number + timeObj.timeUnit;
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function formatStrToDate(string) {
  const [day, month, year] = string.split("-");
  const monthIndex = Number(month) - 1;
  return new Date(Number(year), monthIndex, Number(day));
}

function formatDateToStr(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function formatDateToPerfectStr(date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = String(date.getDate());
  const month = date.getMonth();
  const year = String(date.getFullYear());

  return { day, month: months[month], year };
}

function formatPerfectStrToDate(string) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthIndex = months.findIndex(string.month);
  return new Date(Number(year), monthIndex, Number(day));
}

function formatDateStrToPerfectStr(dateStr) {
  const thisYear = new Date().getFullYear();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = Number(dateStr.slice(0, 2));
  const month = months[Number(dateStr.slice(3, 5)) - 1];
  const year = Number(dateStr.slice(6, 10));

  const datInfo = { day, month, year };
  if (thisYear === datInfo.year) return `${datInfo.month} ${datInfo.day}`;
  else return `${datInfo.month} ${datInfo.day}, ${datInfo.year}`;
}

function getNameFromEmail(emailStr) {
  const atIndex = emailStr.indexOf("@");
  return emailStr.slice(0, atIndex);
}

function milisecondsTimeCalc(savedTime) {
  // Get the current timestamp in milliseconds
  const currentTime = Date.now();

  // Calculate the difference in milliseconds
  const timeDifference = currentTime - savedTime;

  // Convert milliseconds to minutes
  const minutesPassed =
    timeDifference < 60000
      ? `${Math.floor(timeDifference / 1000)}s`
      : timeDifference < 3600000
      ? `${Math.floor(timeDifference / 60000)}m`
      : timeDifference < 86400000
      ? `${Math.floor(timeDifference / 3600000)}h`
      : `${Math.floor(timeDifference / 86400000)}d`;

  return minutesPassed;
}

// function downloadExcelFile(data, fileName) {
//         // Create a new workbook
//         const wb = XLSX.utils.book_new();
        
//         // Sample data
//         const data = [
//             ["Project Name", "Status", "Due Date"],
//             ["Project Alpha", "In Progress", "2025-03-01"],
//             ["Project Beta", "Completed", "2025-02-20"],
//         ];

//         // Convert the data to a worksheet
//         const ws = XLSX.utils.aoa_to_sheet(data);

//         // Optional: Apply styling (note that this is limited with xlsx)
//         // Example: Format header
//         const headerCell = ws['A1'].s = { 
//             font: { bold: true, color: { rgb: "FFFFFF" } },
//             fill: { 
//                 patternType: "solid", 
//                 fgColor: { rgb: "0070C0" }
//             }
//         };

//         // Add the worksheet to the workbook
//         XLSX.utils.book_append_sheet(wb, ws, "Projects");

//         // Create a link and trigger the download
//         XLSX.writeFile(wb, "project_management.xlsx");
// }