import { me } from "../api/auth";
import { AppStorage } from "../util";
import logo from '../../static/logo.png';

// 기본 HTML

const userInfoPage = document.createElement("div");
userInfoPage.classList.add("user-info-page");

const body = document.createElement("div");
body.classList.add("body");
userInfoPage.appendChild(body);

const title = document.createElement("div");
title.classList.add("title");
title.textContent = "나의 정보";
body.appendChild(title);

const profileArea = document.createElement("div");
profileArea.classList.add("profile-area");
body.appendChild(profileArea);

const profilePic = document.createElement("img");
profilePic.classList.add("profile-pic");
profileArea.appendChild(profilePic);

const profileName = document.createElement("div");
profileName.textContent = "사용자 이름";
profileName.classList.add("profile-name");
profileArea.appendChild(profileName);

const btnWrapper = document.createElement("div");
btnWrapper.classList.add("btn-wrapper");
body.appendChild(btnWrapper);

const profilePicBtn = document.createElement("div");
profilePicBtn.classList.add("profile-pic-btn");
profilePicBtn.classList.add("medium");
profilePicBtn.classList.add("btn-secondary");
profilePicBtn.textContent= "프로필 이미지 변경";
btnWrapper.appendChild(profilePicBtn);

const changeNameBtn = document.createElement("div");
changeNameBtn.classList.add("change-name-btn");
changeNameBtn.classList.add("medium");
changeNameBtn.classList.add("btn-secondary");
changeNameBtn.textContent= "이름 수정하기";
btnWrapper.appendChild(changeNameBtn);

const changePasswordBtn = document.createElement("div");
changePasswordBtn.classList.add("change-password-btn");
changePasswordBtn.classList.add("medium");
changePasswordBtn.classList.add("btn-secondary");
changePasswordBtn.textContent= "비밀번호 수정하기";
btnWrapper.appendChild(changePasswordBtn);

export default userInfoPage;

// const toDataURL = url => fetch(url)
//   .then(response => response.blob())
//   .then(blob => new Promise((resolve, reject) => {
//     const reader = new FileReader()
//     reader.onloadend = () => resolve(reader.result)
//     reader.onerror = reject
//     reader.readAsDataURL(blob)
//   }))

async function changeUserInfo (accessToken, {displayName, profileImgBase64, oldPassword, newPassword}) {
  const headers = {
    "Content-type": "application/json",
    apikey: process.env.apikey,
    username: "KDT4_Team1",
    Authorization: `Bearer ${accessToken}`
  }

  const data = {
    ...(displayName && {displayName}),
    ...(profileImgBase64 && {profileImgBase64}),
    ...(oldPassword && {oldPassword}),
    ...(newPassword && {newPassword}),
  }
  
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/user', {
    method: "PUT",
    headers,
    body: JSON.stringify({
      ...data
    }),
  });
  
  return;
}

function getAccessToken() {
  return window?.localStorage.getItem('accessToken');
}
  
// renderUserInfo();

// Modal

async function renderUserInfo () {
  const user = await me(AppStorage.getAccessToken());
  profileName.textContent = user.displayName;
  profilePic.src = user.profileImg || 'https://cdn-icons-png.flaticon.com/512/6522/6522516.png';
}


// ProfilePicBtn Modal
function displayPicModalWindow(){
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
    <button onclick="openTextFile()" class="open btn-secondary medium">업로드 이미지 선택</button>
    <button class="btn-primary medium">확인</button>
    `;
  modalOverlay.appendChild(innerElement); 
  body.appendChild(modalOverlay); 
  
  const closeBtn = innerElement.querySelector(".modal-close")
  closeBtn.addEventListener("click", (e)=> {
    innerElement.style.display = "none";
    modalOverlay.style.display = "none";
  })

  async function openTextFile(){
    var input = document.createElement("input");
    input.type="file";
    input.accept="image/jpg, image/jpeg, image/web, image/png, image/gif, image/svg";
    input.id="uploadInput";

    await input.click();
    input.onchange = function(e){
      processFile(e.target.files[0]);
    };
  }
  document.querySelector('.open').addEventListener("click", openTextFile());
  function processFile(file){
    var reader = new FileReader();
    reader.onload = function(){
      var result = reader.result;
    document.getElementById(profilePic).setAttribute('src', result);
    };
    reader.readAsDataURL(file);
  }

  const confirmBtn = innerElement.querySelector(".btn-primary")
  confirmBtn.addEventListener("click", async (e)=> {
    const value = innerElement.querySelector('input').src;
    await changeUserInfo(accessToken, {profileImgBase64: value});
    innerElement.style.display = "none";
    modalOverlay.style.display = "none";
  })
}



// changeNameBtn Modal
function displayNameModalWindow(){
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
    <input type="text" required />
    <button class="btn-primary medium">확인</button>
  `;
  modalOverlay.appendChild(innerElement); 
  body.appendChild(modalOverlay); 
  // innerElement.addEventListener("click", async ()=> {
  //   const value = innerElement.querySelector('input').value;
  //   await changeUserInfo(accessToken, {displayName: value});
  //   closeModalWindow(modalOverlay);
  // })
  const closeBtn = innerElement.querySelector(".modal-close")
  closeBtn.addEventListener("click", (e)=> {
    innerElement.style.display = "none";
    modalOverlay.style.display = "none";
  })
  const confirmBtn = innerElement.querySelector(".btn-primary")
  confirmBtn.addEventListener("click", async(e)=> {
    const value = innerElement.querySelector('input').value;
    await changeUserInfo(accessToken, {displayName: value});
    renderUserInfo();
    // return renderUserInfo;
    innerElement.style.display = "none";
    modalOverlay.style.display = "none";
  })
}

// function closeModalWindow(modalOverlay){
//   body.removeChild(modalOverlay);
// }

//changePasswordBtn Modal
function displayPWModalWindow(){
  const accessToken = AppStorage.getAccessToken();
  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("modal");
  modalOverlay.classList.add("modal-overlay");
  const innerElement = document.createElement("div");
  innerElement.classList.add("modal-inner");
  innerElement.innerHTML = `
    <div class="modal-close">X</div>
    <div class="innerElement-title">비밀번호 수정하기</div>
    <span class="innerElement-span">현재 비밀번호</span>
    <input required id="current-password" type="form"/>
    <span class="innerElement-span">새로운 비밀번호</span>
    <input required id="new-password" type="form"/>
    <button class="btn-primary medium">확인</button>
  `;
  modalOverlay.appendChild(innerElement); 
  body.appendChild(modalOverlay); 
  const closeBtn = innerElement.querySelector(".modal-close")
  closeBtn.addEventListener("click", (e)=> {
    innerElement.style.display = "none";
    modalOverlay.style.display = "none";
  })
  const confirmBtn = innerElement.querySelector(".btn-primary")
  confirmBtn.addEventListener("click", (e)=> {
    innerElement.style.display = "none";
    modalOverlay.style.display = "none";
  })
}



profilePicBtn.addEventListener('click', displayPicModalWindow);
changeNameBtn.addEventListener('click', displayNameModalWindow);
changePasswordBtn.addEventListener('click', displayPWModalWindow);



/*
const uploadField = document.getElementById("modal-file-upload");
uploadField.onchange = function(){
  if(this.files[0].size > 1048576){
    alert("1MB 미만의 파일만 업로드 가능합니다.");
    this.value ="";
  }
}
*/

/* 프로필 이미지 수정하기
- V 사용자가 '프로필 이미지 변경' 버튼을 클릭 (class="profile-pic-btn")
- V 프로필 이미지 창modal 띄우기(가능한 이미지 파일 종류 및 크기 명시)
  
- V 취소 누를 시 창 끔.
- V 사용자가 창에 새 파일을 올리고 '변경' 버튼을 누름
  - 이미지 파일 종류 및 크기가 허용 범위내인지 확인하기
    - 아닐 경우, '허용된 이미지 종류와 크기를 확인해주세요.'
    - 맞을 경우, 사용자 선택창modal 닫기
- 4번째 버튼 '저장하기' 누를 경우, 사용자의 변경 사항 서버에 저장하기
  - 기존 내용 삭제
  - 새 내용 저장
  - 서버 내 저장 내용 바꾸는 동안, 동그라미 기다리는 모션 띄우기
  - 완료시 '저장되었습니다!' 띄워주기
*/


//https://stackoverflow.com/questions/22087076/how-to-make-a-simple-image-upload-using-javascript-html


/*아래는 어디에?
window.addEventListener('load', function() {
  document.querySelector('input[type="file"]').addEventListener('change', function() {
      if (this.files && this.files[0]) {
          var img = document.querySelector('img');
          img.onload = () => {
              URL.revokeObjectURL(img.src);  // no longer needed, free memory
          }

          img.src = URL.createObjectURL(this.files[0]); // set src to blob url
      }
  });
});*/


/* 이름 수정하기
- 사용자가 '이름 수정하기' 버튼을 클릭 (버튼 4개중 2번째)
- 사용자 입력창modal 띄우기(새로운 이름칸과 변경, 취소 있음)
  - 취소 누를 시 창 끔.
- 사용자가 창에 수정 내용을 입력하고 '변경' 버튼을 누름
  - 이름에 특수기호, 숫자, 공백 안들어갔는지 확인하기
    - 들어갔을 경우, '특수기호, 숫자, 공백을 제외하고 입력해주세요' 띄우기.
    - 안들어갔을 경우, 사용자 입력창modal 닫기
- 4번째 버튼 '저장하기' 누를 경우, 사용자의 변경 사항 서버에 저장하기
  - 기존 내용 삭제
  - 새 내용 저장
  - 서버 내 저장 내용 바꾸는 동안, 동그라미 기다리는 모션 띄우기
  - 완료시 '저장되었습니다!' 띄워주기
*/

/* 비밀번호 수정하기
- 사용자가 '비밀번호 수정하기' 버튼을 클릭 (버튼 4개중 3번째)
  - 사용자 입력창modal 띄우기(새로운 비밀번호 칸과 변경, 취소 있음)
    - 취소 누를 시 창 끔.
  - 사용자가 창에 수정 내용을 입력하고 '변경' 버튼을 누름
    - 비밀번호 글자연속중복 있을지 확인하기
    - 들어갔을 경우, '똑같은 글자는 연속하여 사용할 수 없습니다' 띄우기.
    - 안들어갔을 경우, 사용자 입력창modal 닫기
- 4번째 버튼 '저장하기' 누를 경우, 사용자의 변경 사항 서버에 저장하기
  - 기존 내용 삭제
  - 새 내용 저장
  - 서버 내 저장 내용 바꾸는 동안, 동그라미 기다리는 모션 띄우기
  - 완료시 '저장되었습니다!' 띄워주기
*/


