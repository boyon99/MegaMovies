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
