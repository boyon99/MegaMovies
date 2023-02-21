import kbLogo from "../../../static/kbBankLogo.png";
import shinhanLogo from "../../../static/shinhanBankLogo.png";
import wooriLogo from "../../../static/wooriBankLogo.png";
import hanaLogo from "../../../static/hanaBankLogo.png";
import kLogo from "../../../static/KBankLogo.png";
import kakaoLogo from "../../../static/kakaoBankLogo.png";
import nhLogo from "../../../static/nhBankLogo.png";

export const bankLogoImgMap = new Map([
  ["KB국민은행", createBankImgFactory("국민은행")],
  ["신한은행", createBankImgFactory("신한은행")],
  ["우리은행", createBankImgFactory("우리은행")],
  ["하나은행", createBankImgFactory("하나은행")],
  ["케이뱅크", createBankImgFactory("케이뱅크")],
  ["카카오뱅크", createBankImgFactory("카카오뱅크")],
  ["NH농협은행", createBankImgFactory("NH농협은행")],
]);

function createBankImgFactory(bankName) {
  let bankImg = document.createElement("img");
  switch (bankName) {
    case "국민은행":
      bankImg.src = kbLogo;
      bankImg.alt = "KB국민은행 로고";
      break;
    case "신한은행":
      bankImg.src = shinhanLogo;
      bankImg.alt = "신한은행 로고";
      break;
    case "우리은행":
      bankImg.src = wooriLogo;
      bankImg.alt = "우리은행 로고";
      break;
    case "하나은행":
      bankImg.src = hanaLogo;
      bankImg.alt = "하나은행 로고";
      break;
    case "케이뱅크":
      bankImg.src = kLogo;
      bankImg.alt = "케이뱅크 로고";
      break;
    case "카카오뱅크":
      bankImg.src = kakaoLogo;
      bankImg.alt = "카카오뱅크 로고";
      break;
    case "NH농협은행":
      bankImg.src = nhLogo;
      bankImg.alt = "NH농협은행 로고";
      break;
  }
  return bankImg;
}
