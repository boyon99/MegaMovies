import logo from "../../../static/logo.png";
import { userArea } from "./user_area";
import { nav } from "./nav";
import { AppStorage } from "../../util";

// 이벤트 제거를 위한 map
export const headerEventMap = new Map([]);

// header 요소
const header = ({
  user = AppStorage.getCurrentUser(),
  isContainNav = true,
  isContainProfileArea = true,
} = {}) => {
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
      { target: window, eventType: "scroll" },
      handleHeaderScroll
    );

    let prevScrollY = 0;
    window.addEventListener("scroll", handleHeaderScroll);

    function handleHeaderScroll(e) {
      const isActive = window.scrollY >= 118;
      const delta = window.scrollY - prevScrollY;

      headerEl.classList.toggle("scroll", isActive && delta > 0);
      prevScrollY = window.scrollY;
    }
  }

  return headerEl;
};

export default header;

// 이벤트 제거 함수
export const removeHeaderEvents = () => {
  Array.from(headerEventMap.entries()).forEach(
    ([{ target, eventType }, eventCallback]) => {
      target.removeEventListener(eventType, eventCallback);
    }
  );
};
