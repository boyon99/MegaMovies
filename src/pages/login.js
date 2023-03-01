import { login } from "../api/auth";
import { renderToast } from "./bank/toast";
import { router } from "../";
import { AppStorage } from "../util";

export const loginPage = () => {
  const loginPage = document.createElement("div");
  loginPage.classList.add("log-in");
  loginPage.innerHTML = `<div class="inner">
  <div class="title">MEGA MOVIES 로그인</div>
  <form class="container">
    <div class="id-pw-wrapper">
      <div>
      <label for="id-input">아이디</label>
      <input type="email" id="id-input" placeholder="이메일 주소를 입력하세요" />
      </div>
      <div>
      <label for="pw-input">비밀번호</label>
      <input type="password" id="pw-input" placeholder="비밀번호를 입력하세요" />
      </div>
    </div>
    <div class="btn-wrapper">
    <button class="login-btn btn-primary">로그인</button>
    <button class="signup-btn btn-secondary">회원가입하러가기</button>
    </div>
  </form>
</div>`;

  const loginForm = loginPage.querySelector("form.container");
  loginForm.addEventListener("submit", handleSubmit);
  const loginBtn = loginPage.querySelector(".login-btn");
  const signUpBtn = loginPage.querySelector(".signup-btn");
  loginBtn.addEventListener("click", handleLoginClick);
  signUpBtn.addEventListener("click", handleSignUpClick);
  return loginPage;
};

function handleSubmit(e) {
  e.preventDefault();
}

async function handleLoginClick(e) {
  const form = document.querySelector("form.container");
  const email = form.elements["id-input"].value;
  const password = form.elements["pw-input"].value;

  const loginResponse = await login(email, password);

  if (!loginResponse) {
    renderToast({
      message: "없는 사용자이거나 유효한 아이디, 비밀번호가 아닙니다",
      type: "error",
      autoUnmount: 2500,
    });
    return;
  }

  localStorage.setItem(AppStorage.accessTokenKey, loginResponse.accessToken);

  router.navigate("");
}

async function handleSignUpClick(e) {
  router.navigate("signup");
}
