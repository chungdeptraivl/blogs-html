let header = document.querySelector("header");
const imageManageAccount = document.getElementsByClassName("avt-account")[0];
const showManageAccount = document.getElementsByClassName("account-manage")[0];

window.addEventListener("scroll", () => {
  header.classList.toggle("shadow", window.scrollY > 0);
});

if (imageManageAccount) {
  imageManageAccount.addEventListener("click", () => {
    showManageAccount.classList.toggle("show");
  });
}

const user = JSON.parse(localStorage.getItem("user"));

const token = user?.token;

const btnForm = document.getElementById("btnForm");

const accountManage = document.getElementById("accountManage");

if (token) {
  if (btnForm) {
    btnForm.classList.toggle("hide");
  }

  const userNameText = document.getElementById("nameAccount");
  const userAvtLink = document.getElementById("avtAccount");
  const userAvtLink1 = document.getElementById("avtAccount1");

  const userName = user?.userName;
  userNameText.innerHTML = userName;

  userAvtLink.src = `https://ui-avatars.com/api/?name=${userName}`;
  userAvtLink1.src = `https://ui-avatars.com/api/?name=${userName}`;

  const ownerId = user?.id;
  const ownerListPost = document.getElementById("ownerListPost");
  ownerListPost.href = `/blogOfOwner.html?owner=${ownerId}`;

  function logout() {
    localStorage.removeItem("user");
    window.location.href = "/";
  }
} else {
  if (accountManage) {
    accountManage.classList.toggle("hide");
  }
}

function locationHref() {
  console.log("locationHref" + window.location.href);
  return window.location.href;
}

function convertTime(time) {
  const isoTimeString = time;
  const date = new Date(isoTimeString);

  // Lấy các thành phần của ngày và giờ
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Thêm '0' phía trước nếu cần
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  // Tạo chuỗi thời gian mới
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}



