const socket = io("https://dkfkgl-3000.csb.app");

const form = document.getElementById("send-message-form");
const messageInput = document.getElementById("messageinp");
const messageContainer = document.querySelector(".container");
const timeline = document.getElementById("timeline");
const wifi_icon = '<i class="fas fa-wifi"></i>';

//Username checker
let userNameChecker = (userName) => {
  if (userName == null || userName == undefined || userName == "") {
    return "Someone";
  } else {
    return userName;
  }
};
let scrollToBottom = function () {
  messageContainer.scrollTop = messageContainer.scrollHeight;
  //   var element = document.getElementById("containerid");
  //   element.scrollTop = element.clientHeight;
};
// Time Display
let t1 = new Date();
function CurrentTime() {
  var months = [
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
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var d = new Date();
  var day = days[d.getDay()];
  var hr = d.getHours();
  var min = d.getMinutes();
  var sec = d.getSeconds();
  if (sec < 10) {
    sec = "0" + sec;
  }
  if (min < 10) {
    min = "0" + min;
  }
  var ampm = "AM";
  if (hr > 12) {
    hr -= 12;
    ampm = "PM";
  }
  var date = d.getDate();
  var month = months[d.getMonth()];
  var year = d.getFullYear();

  // var timeline = document.getElementById("timeline");
  timeline.innerHTML =
    wifi_icon +
    " Time : " +
    hr +
    ":" +
    min +
    ":" +
    sec +
    " " +
    ampm +
    " | " +
    day +
    ", " +
    month +
    " " +
    date +
    " " +
    year;
}
setInterval(CurrentTime, 1000);
setInterval(() => {}, 1000);
// Name Input
let Name = "";
do {
  Name = prompt("Kindly Enter Your Name to Join:");
  if (Name == null || Name == undefined || Name == "") {
    Name = "Newbie";
  }
} while (Name == null || Name == undefined || Name == "");
Name = userNameChecker(Name);
// setInterval(function () {
//   var element = document.getElementById("containerid");
//   element.scrollTop = element.clientHeight;
// }, 1000);

socket.emit("new-user-joined", Name);

socket.on("user-joined", (userName) => {
  userName = userNameChecker(userName);
  appendMessage(`<b>${userName}</b> joined the chat`, "center", "green");
  scrollToBottom();
});
socket.on("left", (userName) => {
  userName = userNameChecker(userName);
  appendMessage(`<b>${userName}</b> left the chat`, "center", "red");
  scrollToBottom();
});

socket.on("receive", (data) => {
  data.name = userNameChecker(data.name);
  appendMessage(`<b>${data.name}</b>: ${data.message}`, "left", "black");
  scrollToBottom();
});

function appendMessage(message, position, color) {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = message;
  messageElement.style.color = color || "white";
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.appendChild(messageElement);
}

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Page will not Reload
  const message = messageInput.value;
  if (message != "") {
    appendMessage(`<b>You</b>: ${message}`, "right", "white");
    socket.emit("send", message);
    messageInput.value = "";
    scrollToBottom();
  }
});
