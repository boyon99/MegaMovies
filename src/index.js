import Swiper from "swiper/swiper-bundle.min.js";
import "swiper/swiper-bundle.min.css";
import Navigo from "navigo";
import home from "./pages/home";
import rankingPage from "./pages/ranking";
import genrePage from "./pages/genre";
import newPage from "./pages/new";
import bankPage from "./pages/bank";
import header from "./pages/header";
import moviePage from "./pages/movie";
import orderPage, { unsetCartChecked } from "./pages/order";
import { logout, me } from "./api/auth";
import { AppStorage } from "./util";
import { genreDetailPage } from "./pages/genre_detail";
import orderHistory from "./pages/order-history";
import orderDetails from "./pages/order-details";
import { loginPage } from "./pages/login";
import { renderSignUpPage } from "./pages/sign_up";
import cart from "./pages/cart";
import searchPage from "./pages/search";
import userInfoPage from "./pages/user-info";
import footer from "./pages/footer";
import { notFoundPage } from "./pages/not_found";

const app = document.querySelector("#app");

export const router = new Navigo("/");

router.hooks({
  async before(done, match) {
    const accessToken = window?.localStorage.getItem(AppStorage.accessTokenKey);
    const user = await me(accessToken);

    // guard
    const shouldAuthPaths = [
      "bank",
      "user-info",
      "cart",
      "order",
      "order-history",
      "order-details",
    ];
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
    AppStorage.setCurrentUser(user);

    done();
  },
  after(match) {
    window.scroll(0, 0); // 스크롤 초기화

    const navPaths = ["", "ranking", "genre", "new"];

    if (navPaths.includes(match.url)) {
      attachActiveStyle("active");
      return;
    }

    attachActiveStyle("reset");

    function attachActiveStyle(mode) {
      const activedNavElement = findActiveNavElement();
      const activeClassName = "current-page";

      switch (mode) {
        case "active":
          const target = findMatchedNavElement();

          activedNavElement?.classList.remove(activeClassName);
          target.classList.add(activeClassName);

          break;
        case "reset":
          activedNavElement?.classList.remove(activeClassName);

          break;
        default:
          break;
      }
    }

    // helper function
    function getNavLinks() {
      return document.querySelectorAll(".lnb-item a");
    }

    function findActiveNavElement() {
      const linkEls = getNavLinks();

      return Array.from(linkEls).find((linkEl) =>
        linkEl.classList.contains("current-page")
      );
    }

    function findMatchedNavElement() {
      const hrefRegExp = new RegExp(`/${match.url}$`);

      return Array.from(getNavLinks()).find((navLinkElement) =>
        hrefRegExp.test(navLinkElement.href)
      );
    }
  },
});

router
  .on({
    "/": () => {
      // 홈(메인) 페이지
      renderPage([header(), home]);
      new Swiper(".swiper", {
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        autoplay: {
          delay: 4000,
        },
      });
    },
    "/ranking": (match) => {
      // 랭킹 페이지
      renderPage([header(), rankingPage]);
    },
    "/genre": (match) => {
      // 장르, 테마 페이지
      renderPage([header(), genrePage]);
    },
    "/new": (match) => {
      // 신작 페이지
      renderPage([header(), newPage]);
    },
    "/bank": (match) => {
      // 계좌 페이지
      renderPage([header(), bankPage()]);
    },
    "/login": (match) => {
      // 로그인 페이지
      renderPage([
        header({ isContainNav: false, isContainProfileArea: false }),
        loginPage(),
      ]);
    },
    "/signup": () => {
      // 회원가입 페이지
      renderPage([
        header({ isContainNav: false, isContainProfileArea: false }),
        renderSignUpPage(),
      ]);
    },
    "/logout": async (match) => {
      // 로그아웃
      const logoutResponse = await logout(AppStorage.getAccessToken());

      if (!logoutResponse) return;

      if (match?.user || AppStorage.getCurrentUser()) {
        AppStorage.deleteAccessToken();
        AppStorage.setCurrentUser(null);
      }

      router.navigate("");
    },
    "/movie/:id": ({ data, match }) => {
      // 영화 상세 페이지
      const movieId = data?.id;
      renderPage([header({ user: match?.user }), moviePage(movieId)]);
    },
    "/user-info": (match) => {
      // 사용자 정보 페이지(변경)
      renderPage([header({ isContainNav: false }), userInfoPage()]);
    },
    "/genre/:category": (match) => {
      // 장르, 테마 상세 페이지

      const allowedCategory = [
        "판타지",
        "사극",
        "느와르",
        "공포",
        "스포츠",
        "가족",
        "범죄",
        "워너브라더스",
        "마블",
        "디즈니",
        "지브리",
      ];
      const { category } = match?.data;

      allowedCategory.includes(category)
        ? renderPage([header(), genreDetailPage(category)])
        : router.navigate("notfound");
    },
    "/cart": (match) => {
      // 장바구니 페이지
      renderPage([header(), cart()]);
    },
    "/order": (match) => {
      // 결제 페이지
      renderPage([header(), orderPage()]);
    },
    "/orders": (match) => {
      // 장바구니 -> 결제
      renderPage([header(), orderPage()]);
    },
    "/order-history": (match) => {
      // 전체 구매내역 페이지
      renderPage([header(), orderHistory()]);
    },
    "/order-details": (match) => {
      // 단일 제품 상세 거래 페이지
      renderPage([header(), orderDetails()]);
    },
    "/search/:id": ({ data, match }) => {
      //검색 페이지
      const movieId = data?.id;
      renderPage([header({ user: match?.user }), searchPage(movieId)]);
    },
  })
  .notFound((match) => {
    // notFoundPage
    const prevURL =
      router.lastResolved() === null
        ? location.pathname
        : router.lastResolved()[0].url;
    renderPage([header(), notFoundPage]);
  })
  .resolve();

router.addLeaveHook("/orders", (done) => {
  unsetCartChecked();
  done();
});

function renderPage(page) {
  app.replaceChildren();

  /*
    - :has 가상 선택자 브라우저 호환성 문제로,
      지원하지 않는 브라우저인 경우를 고려 
    - header요소를 렌더링 하지 않을 경우,
      관련 클래스를 적용하여 스타일 적용
  */
  const headerEl = Array.isArray(page)
    ? page.find((pageComponent) => pageComponent?.tagName === "HEADER")
    : page?.tagName === "HEADER"
    ? page
    : null;

  app.classList.toggle("--not-has-header", !headerEl);

  Array.isArray(page) ? app.append(...page) : app.appendChild(page);
}
