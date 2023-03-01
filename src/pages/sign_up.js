import { router } from "..";
import { signUp } from "../api/auth";
import { AppStorage } from "../util";
import { renderToast } from "./bank/toast";

export const renderSignUpPage = function () {
  const signUpPage = document.createElement("div");
  signUpPage.classList.add("sign-up-page");
  signUpPage.innerHTML = `
  <div class="inner">
    <div class="greeting">메가무비스에 오신 것을 환영합니다!</div>
    <form>
      <div class="container">
        <div class="id-wrapper">
          <div class="input-err-container">
           <input placeholder="아이디" class="user-id" id="user-id"></input>
            <span class="error-message"></span>
          </div>
          <button type="button" class="db-check medium btn-outlined">중복확인</button>
        </div>
        <div class="password-wrapper">
          <div class="input-err-container">
           <input type="password" class="password" id="password" placeholder="비밀번호" autoComplete="off"></input>
           <span class="error-message"></span>
          </div>
           <div class="input-err-container">
            <input type="password" class="password-check"  id="password-check" placeholder="비밀번호 재확인" autoComplete="off"></input>
            <span class="error-message"></span>
          </div>
      </div>
      <div class="name-wrapper">
        <div class="input-err-container">
          <input class="name" id="name" placeholder="이름"></input>
          <span class="error-message"></span>
        </div>
      </div>
      <div class="img-wrapper">
        <div>프로필 이미지를 선택하세요(선택)</div>
        <input id="img" type="file" accept="image/*"/>
      </div>
      <button type="submit" class="btn-primary medium sign-up-btn">회원가입</button>
    </form>
  </div>`;
  const form = signUpPage.querySelector("form");
  const dbCheckBtn = form.querySelector(".db-check");
  const signUpBtn = form.querySelector(".sign-up-btn");
  dbCheckBtn.addEventListener("click", async (e) => {
    const idInputMessage = document.querySelector("#user-id + .error-message");
    try {
      const userId = form.elements["user-id"].value;
      await duplicateCheck(userId);
      idInputMessage.textContent = "회원가입이 가능한 이메일입니다";
    } catch (err) {
      if (typeof err === "string") {
        idInputMessage.textContent = err;
      }
      return;
    }
  });

  form.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();
      const userId = form.elements["user-id"].value;
      const password = form.elements["password"].value;
      const passwordCheck = form.elements["password-check"].value;
      const name = form.elements["name"].value;
      const img = form.elements["img"].files[0];

      const payload = {
        email: userId,
        password,
        displayName: name,
      };
      await validateSignUp({ userId, password, passwordCheck, name });
      imgToBase64(img).then(async (profileImgBase64) => {
        const signUpResponse = await signUp({
          accessToken: AppStorage.getAccessToken(),
          ...payload,
          profileImgBase64,
        });
        if (!signUpResponse) {
          renderToast({
            type: "error",
            message: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요",
          });
          return;
        }
        localStorage.setItem(
          AppStorage.accessTokenKey,
          signUpResponse.accessToken
        );
        router.navigate("");
      });
      //
    } catch (err) {
      if (!(err instanceof Error)) {
        const [idError, passwordError, passwordCheckError, nameError] =
          document.querySelectorAll(".error-message");

        const { email, password, passwordCheck, name } = err;
        idError.textContent = email ?? "";
        passwordError.textContent = password ?? "";
        passwordCheckError.textContent = passwordCheck ?? "";
        nameError.textContent = name ?? "";
      }
    }
  });

  return signUpPage;
};

// helper
async function validateSignUp({ userId, password, passwordCheck, name }) {
  const errors = {};

  const emailRegex = /[a-z0-9]+@[a-z]{2,}\.[a-z]{2,3}/;
  const nameRegex = /^[\w가-힣]{1,20}$/;
  if (!emailRegex.test(userId)) {
    errors.email = "아이디는 이메일 형식이어야 합니다";
  }
  if (password.length < 8) {
    errors.password = "비밀번호는 8자 이상이여야 합니다";
  }
  if (password !== passwordCheck) {
    errors.passwordCheck = "비밀번호가 일치하지 않습니다";
  }
  if (!nameRegex.test(name)) {
    errors.name = "이름은 1글자 이상 20자 이하여야 합니다";
  }

  console.log({ errors });
  if (Object.keys(errors).length > 0) {
    throw errors;
  }
}

async function duplicateCheck(email) {
  const requestHeaders = {
    "content-type": "application/json",
    apikey: "FcKdtJs202301",
    username: "KDT4_Team1",
    masterkey: true,
  };

  const siteUsersResponse = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/users",
    {
      headers: { ...requestHeaders },
    }
  );

  if (siteUsersResponse.status !== 200) {
    renderToast({
      type: "error",
      message: "서버와의 통신중 에러가 발생했습니다.",
    });
    return false;
  }
  const users = await siteUsersResponse.json();
  const emailRegex = /[a-z0-9]+@[a-z]+.[a-z]{2,3}/;

  if (!emailRegex.test(email)) {
    throw "아이디는 이메일 형식이어야 합니다";
  }
  const duplicatUser = users.find((user) => user.email === email);
  if (duplicatUser) {
    throw "중복된 이메일입니다";
  }
  return true;
}

function imgToBase64(img) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.addEventListener("load", (e) => {
      resolve(e.target.result);
    });
  });
}
