import Navigo from "navigo";
import home from "./pages/home";
import rankingPage from "./pages/ranking";
import genrePage from "./pages/genre";
import newPage from "./pages/new";
import bankPage from "./pages/bank";

const app = document.querySelector("#app");

const router = new Navigo("/");

router
  .on({
    "/": () => {
      renderPage(home);
    },
    "/ranking": () => {
      renderPage(rankingPage);
    },
    "/genre": () => {
      renderPage(genrePage);
    },
    "/new": () => {
      renderPage(newPage);
    },
    "/bank": () => {
      renderPage(bankPage);
    },
  })
  .resolve();

function renderPage(page) {
  app.replaceChildren();
  app.append(page);
}
