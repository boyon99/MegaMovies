import Navigo from "navigo";
import home from "./pages/home";
import rankingPage from "./pages/ranking";
import genrePage from "./pages/genre";
import newPage from "./pages/new";
import header, { removeHeaderEvents } from "./pages/header";
import { me } from "./api/auth";

const app = document.querySelector("#app");

export const router = new Navigo("/");

router.hooks({
  async before(done, match) {
    const accessToken = window?.localStorage.getItem("accessToken");
    const user = await me(accessToken);

    // guard
    const shouldAuthPaths = ["bank"];
    if (shouldAuthPaths.includes(match.url) && !user) {
      router.navigate("login");
      done();
    }
    if ((match.url === "login" || match.url === "signup") && user) {
      router.navigate("");
      done();
    }

    // save user_info
    match.user = user;

    done();
  },
  after(match) {
    const navPaths = ["", "ranking", "genre", "new"];

    if (navPaths.includes(match.url)) {
      const linkEls = document.querySelectorAll(".lnb-item a");
      if (!linkEls.length) return;
      const activedEl = Array.from(linkEls).find((linkEl) =>
        linkEl.classList.contains("current-page")
      );
      if (activedEl) {
        activedEl.classList.remove("current-page");
      }

      const target = Array.from(linkEls).find((linkEl) => {
        const hrefRegExp = new RegExp(`/${match.url}$`);
        return hrefRegExp.test(linkEl.href);
      });

      target.classList.add("current-page");
    }
  },
});

router
  .on({
    "/": (match) => {
      renderPage([header({ user: match?.user }), home]);
    },
    "/ranking": (match) => {
      renderPage([header({ user: match?.user }), rankingPage]);
    },
    "/genre": (match) => {
      renderPage([header({ user: match?.user }), genrePage]);
    },
    "/new": (match) => {
      renderPage([header({ user: match?.user }), newPage]);
    },
    "/bank": (match) => {
      //renderPage([header({ user: match?.user }), bankPage(match?.user)]);
    },
    "/login": () => {
      /*
        - 로그인 페이지를 구현하고 추가해주세요
        - 헤더 필요없이 로그인 페이지 단독으로 구현하셨을 경우
          renderPage의 매개변수(인자)로 로그인 페이지 요소만 전달해주세요
          예시) renderPage(loginPage)
      */
      renderPage([header({ type: "login" })]);
    },
    "/signup": () => {
      /*
        - 회원가입 페이지를 구현하고 추가해주세요
        - 헤더 필요없이 회원가입 페이지 단독으로 구현하셨을 경우
          renderPage의 매개변수(인자)로 회원가입 페이지 요소만 전달해주세요
          예시) renderPage(signUpPage)
      */
      renderPage([header({ type: "sign-up" })]);
    },
    "/movie/:id": (matchInfo) => {},
  })
  .resolve();

function renderPage(page) {
  app.replaceChildren();

  if (Array.isArray(page)) {
    return app.append(...page);
  }

  app.append(page);
}
