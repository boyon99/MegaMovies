import { router } from "../";
import { login, me } from "../api/auth";
import { AppStorage } from "../util";
import logo from "../../static/logo.png";

// HTML 뼈대
function infoPage() {
  const userInfoPage = document.createElement("div");
  userInfoPage.classList.add("user-info-page");

  const mainCtn = document.createElement("div");
  mainCtn.classList.add("mainCtn");
  userInfoPage.appendChild(mainCtn);

  const title = document.createElement("p");
  title.classList.add("title");
  title.textContent = "나의 정보";
  mainCtn.appendChild(title);

  const profileArea = document.createElement("div");
  profileArea.classList.add("profile-area");
  mainCtn.appendChild(profileArea);

  const profilePic = document.createElement("img");
  profilePic.classList.add("profile-pic");
  profileArea.appendChild(profilePic);

  const profileName = document.createElement("div");
  profileName.classList.add("profile-name");
  let UserUsername = document.getElementsByClassName(".user-name").textContent;
  profileName.textContent = UserUsername;
  profileArea.appendChild(profileName);

  const btnWrapper = document.createElement("div");
  btnWrapper.classList.add("btn-wrapper");
  mainCtn.appendChild(btnWrapper);

  const profilePicBtn = document.createElement("div");
  profilePicBtn.classList.add("profile-pic-btn");
  profilePicBtn.classList.add("medium");
  profilePicBtn.classList.add("btn-secondary");
  profilePicBtn.textContent = "프로필 이미지 변경";
  btnWrapper.appendChild(profilePicBtn);

  const changeNameBtn = document.createElement("div");
  changeNameBtn.classList.add("change-name-btn");
  changeNameBtn.classList.add("medium");
  changeNameBtn.classList.add("btn-secondary");
  changeNameBtn.textContent = "이름 수정하기";
  btnWrapper.appendChild(changeNameBtn);

  const changePasswordBtn = document.createElement("div");
  changePasswordBtn.classList.add("change-password-btn");
  changePasswordBtn.classList.add("medium");
  changePasswordBtn.classList.add("btn-secondary");
  changePasswordBtn.textContent = "비밀번호 수정하기";
  btnWrapper.appendChild(changePasswordBtn);

  // event listeners
  profilePicBtn.addEventListener("click", displayPicModalWindow);
  changeNameBtn.addEventListener("click", displayNameModalWindow);
  changePasswordBtn.addEventListener("click", displayPWModalWindow);

  renderUserInfo();
  return userInfoPage;
}

export default infoPage;

//functions

function getAccessToken() {
  return window?.localStorage.getItem("accessToken");
}

async function renderUserInfo() {
  const user = await me(AppStorage.getAccessToken());

  const profileName = document.querySelector(".profile-name");
  const profilePic = document.querySelector(".profile-pic");

  profileName.textContent = user.displayName;
  profilePic.src =
    user.profileImg ||
    "https://cdn-icons-png.flaticon.com/512/6522/6522516.png";
}

async function changeUserInfo(
  accessToken,
  { displayName, profileImgBase64, oldPassword, newPassword }
) {
  const headers = {
    "Content-type": "application/json",
    apikey: process.env.apikey,
    username: "KDT4_Team1",
    Authorization: `Bearer ${accessToken}`,
  };

  const data = {
    ...(displayName && { displayName }),
    ...(profileImgBase64 && { profileImgBase64 }),
    ...(oldPassword && { oldPassword }),
    ...(newPassword && { newPassword }),
  };

  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/user",
    {
      method: "PUT",
      headers,
      body: JSON.stringify({
        ...data,
      }),
    }
  );

  if (res.status !== 200) return false;

  const payload = await res.json();

  return payload;
}

// Modal

// 1. ProfilePicBtn Modal
function displayPicModalWindow() {
  const accessToken = AppStorage.getAccessToken();
  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("modal");
  modalOverlay.classList.add("modal-overlay");
  const innerElement = document.createElement("div");
  innerElement.classList.add("modal-inner");
  innerElement.innerHTML = `
    <div class="modal-close">X</div>
    <div class="innerElement-title">프로필 이미지 변경</div>
    <span class="innerElement-span">1MB 미만의 파일만 업로드 가능합니다.</span>
    <input type="file" onchange="fileInputEl" class="open"></input>
    <button class="btn-primary medium">확인</button>
    `;
  modalOverlay.appendChild(innerElement);
  userInfoPage.appendChild(modalOverlay);
  const closeBtn = innerElement.querySelector(".modal-close");
  closeBtn.addEventListener("click", (e) => {
    innerElement.style.display = "none";
    modalOverlay.style.display = "none";
  });

  const inputFile = document.querySelector("input[class='open']");
  const confirmBtn = innerElement.querySelector(".btn-primary");

  inputFile.addEventListener("change", async (e) => {
    if (inputFile.files[0].size > 1048575) {
      alert("1MB 미만의 파일만 업로드 가능합니다.");
      inputFile.value = "";
    }
  });

  confirmBtn.addEventListener("click", async (e) => {
    const file = inputFile.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", async (e) => {
      const profileImgBase64 = e.target.result;
      const changedUserInfo = await changeUserInfo(accessToken, {
        profileImgBase64,
      });

      innerElement.style.display = "none";
      modalOverlay.style.display = "none";
      renderUserInfo();
      history.go(0);
    });
  });
}

// 2. changeNameBtn Modal
function displayNameModalWindow() {
  const accessToken = AppStorage.getAccessToken();
  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("modal");
  modalOverlay.classList.add("modal-overlay");
  const innerElement = document.createElement("div");
  innerElement.classList.add("modal-inner");
  innerElement.innerHTML = `
    <div class="modal-close">X</div>
    <div class="innerElement-title">이름 변경하기</div>
    <span class="innerElement-span">새로운 이름을 작성해주세요.</span>
    <input type="text"/>
    <button class="btn-primary medium">확인</button>
  `;
  modalOverlay.appendChild(innerElement);
  userInfoPage.appendChild(modalOverlay);
  const closeBtn = innerElement.querySelector(".modal-close");
  closeBtn.addEventListener("click", (e) => {
    innerElement.style.display = "none";
    modalOverlay.style.display = "none";
  });
  const confirmBtn = innerElement.querySelector(".btn-primary");
  confirmBtn.addEventListener("click", async (e) => {
    const value = innerElement.querySelector("input").value;
    async function renameCheck({ value }) {
      const renameCheckReg = /^[\w가-힣]{1,20}$/;
      if (!renameCheckReg.test(value)) {
        alert("이름은 1글자 이상, 20글자 이하로 설정해주세요.");
        preventDefault();
      }
    }
    await renameCheck({ value });
    await changeUserInfo(accessToken, { displayName: value });
    innerElement.style.display = "none";
    modalOverlay.style.display = "none";

    renderUserInfo();
    history.go(0);
  });
}

// 3. changePasswordBtn Modal
function displayPWModalWindow() {
  const accessToken = AppStorage.getAccessToken();
  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("modal");
  modalOverlay.classList.add("modal-overlay");
  const innerElement = document.createElement("form");

  innerElement.classList.add("modal-inner");
  innerElement.innerHTML = `
    <div class="modal-close">X</div>
    <div class="innerElement-title">비밀번호 수정하기</div>
    <span class="innerElement-span">기존 비밀번호</span>
    <input required id="old-password" type="password"/>
    <span class="innerElement-span">새로운 비밀번호</span>
    <input required id="new-password-1" type="password"/>
    <span class="innerElement-span">비밀번호 확인</span>
    <input required id="new-password-2" type="password"/>
    <button class="btn-primary medium">확인</button>
  `;
  modalOverlay.appendChild(innerElement);
  userInfoPage.appendChild(modalOverlay);
  const closeBtn = innerElement.querySelector(".modal-close");
  closeBtn.addEventListener("click", (e) => {
    innerElement.style.display = "none";
    modalOverlay.style.display = "none";
  });
  const confirmBtn = innerElement.querySelector(".btn-primary");

  const newPW = innerElement.querySelector("#new-password-1");
  const newPWCheck = innerElement.querySelector("#new-password-2");
  confirmBtn.addEventListener("click", (e) => {
    if (newPW.value.length < 8) {
      newPW.setCustomValidity("비밀번호는 8자 이상이여야 합니다.");
    } else if (newPW.value !== newPWCheck.value) {
      newPW.setCustomValidity("비밀번호가 일치하지 않습니다.");
    } else {
      newPW.setCustomValidity("");
    }
  });
  innerElement.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (innerElement.noValidate) return;
    const oldPW = innerElement.querySelector("#old-password");
    const user = AppStorage.getCurrentUser();
    const loginUser = await login(user.email, oldPW.value);
    if (!loginUser) {
      return alert("기존 비밀번호를 재확인해주세요.");
    }
    if (loginUser) {
      const accessToken = loginUser.accessToken;
      localStorage.setItem(AppStorage.accessTokenKey, accessToken);

      if (oldPW.value === newPW.value) {
        return alert("기존 비밀번호와 다르게 설정해주세요.");
      }

      await changeUserInfo(accessToken, {
        oldPassword: oldPW.value,
        newPassword: newPW.value,
      });
      innerElement.style.display = "none";
      modalOverlay.style.display = "none";

      alert("패스워드 변경이 완료되었습니다.");
    }
  });
}
