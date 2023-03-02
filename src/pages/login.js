import { login } from "../api/auth";
import { renderToast } from "./bank/toast";
import { router } from "../";
import { AppStorage } from "../util";

export const loginPage = () => {
  const loginPage = document.createElement("div");
  loginPage.classList.add("log-in");
  loginPage.innerHTML = `<div class="inner">
  <div class="title">메가무비스에 오신 것을 환영합니다!</div>
  <div class="title-2">지금 바로 메가무비스에서 다양한 영화를 시청해보세요.</div>
  <form class="container">
    <div class="id-pw-wrapper">
      <div>
      <input type="email" id="id-input" placeholder="이메일 주소를 입력하세요" />
      </div>
      <div>
      <input type="password" id="pw-input" placeholder="비밀번호를 입력하세요" />
      </div>
    </div>
    <div class="btn-wrapper">
    <button class="login-btn btn-primary">로그인</button>
    <button class="signup-btn"><span>아직 회원이 아닙니까?</span>회원가입하기</button>
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
