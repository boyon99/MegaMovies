import { router } from "..";

export const notFoundPage = document.createElement("div");
notFoundPage.classList.add("notFoundPage");

const NFmain = document.createElement("div");
NFmain.classList.add("NFmain");
notFoundPage.appendChild(NFmain);

const NFtitle = document.createElement("div");
NFtitle.classList.add("NFtitle");
NFtitle.innerText = "404 Not Found";
NFmain.appendChild(NFtitle);

const NFsign = document.createElement("div");
NFsign.innerText = "요청하신 페이지를 찾을 수 없습니다.";
NFmain.appendChild(NFsign);

let setTimeLimit = 5000;
let secondsLeft = Date.now();

const NFtimer = setInterval(() => {
  const currentTime = Date.now();
  const diff = currentTime - secondsLeft;
  const remainingTime = Math.ceil((setTimeLimit - diff) / 1000);

  let NFalert = `${remainingTime}초 뒤 홈 화면으로 자동 이동합니다.`;
  const NFnotice = document.createElement("div");
  NFnotice.classList.add("NFalert");
  NFmain.appendChild(NFnotice);

  if (remainingTime <= 0) {
    clearInterval(NFtimer);
    NFalert = "이동 중...";
    router.navigate("");
  }
  document.querySelector(".NFalert").innerHTML = NFalert;
}, 1000);
