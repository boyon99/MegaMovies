import Navigo from "navigo";
import home from "./pages/home";
import rankingPage from "./pages/ranking";
import genrePage from "./pages/genre";
import newPage from "./pages/new";

const app = document.querySelector("#app");
const buttonGroup = document.querySelector(".button-group");
const userAuth = document.querySelector(".user-auth");

const router = new Navigo("/");

router
  .on({
    "/": () => {
      const linkEls = document.querySelectorAll(".lnb a");
      const activedEl = Array.from(linkEls).find((linkEl) =>
        linkEl.classList.contains("current-page")
      );
      if (activedEl) {
        activedEl.classList.remove("current-page");
      }
      Array.from(linkEls)
        .find((linkEl) => linkEl.getAttribute("href") === "/")
        .classList.add("current-page");
      renderPage(home);
    },
    "/ranking": () => {
      const linkEls = document.querySelectorAll(".lnb a");
      const activedEl = Array.from(linkEls).find((linkEl) =>
        linkEl.classList.contains("current-page")
      );
      if (activedEl) {
        activedEl.classList.remove("current-page");
      }
      Array.from(linkEls)
        .find((linkEl) => linkEl.getAttribute("href") === "/ranking")
        .classList.add("current-page");
      renderPage(rankingPage);
    },
    "/genre": () => {
      const linkEls = document.querySelectorAll(".lnb a");
      const activedEl = Array.from(linkEls).find((linkEl) =>
        linkEl.classList.contains("current-page")
      );
      if (activedEl) {
        activedEl.classList.remove("current-page");
      }
      Array.from(linkEls)
        .find((linkEl) => linkEl.getAttribute("href") === "/genre")
        .classList.add("current-page");
      renderPage(genrePage);
    },
    "/new": () => {
      const linkEls = document.querySelectorAll(".lnb a");
      const activedEl = Array.from(linkEls).find((linkEl) =>
        linkEl.classList.contains("current-page")
      );
      if (activedEl) {
        activedEl.classList.remove("current-page");
      }
      Array.from(linkEls)
        .find((linkEl) => linkEl.getAttribute("href") === "/new")
        .classList.add("current-page");
      renderPage(newPage);
    },
    "/bank": () => {},
    "/login": () => {},
    "/signup": () => {},
    "/movie/:id": (matchInfo) => {},
  })
  .resolve();

function renderPage(page) {
  if (localStorage.getItem("accessToken")) {
    buttonGroup.style.display = "none";
    userAuth.style.display = "flex";
  }

  app.replaceChildren();
  app.append(page);
}
