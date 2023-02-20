import logo from "../../../static/logo.png";
import { userArea } from "./user_area";
import { nav } from "./nav";
import { AppStorage } from "../../util";

const headerEventMap = new Map([]);

const header = ({
  user = AppStorage.getCurrentUser(),
  isContainNav = true,
  isContainProfileArea = true,
} = {}) => {
  if (headerEventMap.size > 0) {
    removeHeaderEvents();
  }

  const headerEl = document.createElement("header");
  headerEl.className = "gnb";
  headerEl.innerHTML = `
  <div class="inner">
    <a class="logo" href="/">
      <img src="${logo}" alt="MEGA MOVIES" />
    </a>
  </div>
  `;
  if (!isContainNav) {
    headerEl.classList.add("--not-has-nav");
  }
  if (isContainProfileArea) {
    headerEl.querySelector(".inner").append(userArea(user));
  }
  if (isContainNav) {
    headerEl.appendChild(nav);

    headerEventMap.set(
      { target: window, eventType: "scroll", options: { passive: true } },
      handleHeaderScroll()
    );

    function handleHeaderScroll() {
      let prevScrollY = 0;

      return (...args) => {
        const isActive = window.scrollY >= 118;
        const delta = window.scrollY - prevScrollY;

        headerEl.classList.toggle("scroll", isActive && delta > 0);

        prevScrollY = window.scrollY;
      };
    }
  }

  registerEvents();

  return headerEl;
};

export default header;

// 이벤트 등록 함수
function registerEvents() {
  Array.from(headerEventMap.entries()).forEach(
    ([{ target, eventType, options }, eventCallback]) => {
      target.addEventListener(eventType, eventCallback, { ...options });
    }
  );
}

// 이벤트 제거 함수
function removeHeaderEvents() {
  Array.from(headerEventMap.entries()).forEach(
    ([{ target, eventType, options }, eventCallback]) => {
      target.removeEventListener(eventType, eventCallback, { ...options });
    }
  );
  headerEventMap.clear();
}
