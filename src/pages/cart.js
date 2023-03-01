import { router } from "..";
import { AppStorage } from "../util";
let sum = 0;

// cartpage
const cart = () => {
  const cartPage = document.createElement("div");
  cartPage.classList.add("cart-page");

  // inner div
  let inner = document.createElement("div");
  inner.classList.add("inner");
  inner.innerHTML = ``;

  // item
  let items = AppStorage.getCartItem();
  let itemsFilter = items.filter((i, a, b) => b.includes(i));

  // checkbox
  let checkItem = {};

  // item div
  itemsFilter.map((i, a, b) => {
    let itemboxEl = document.createElement("div");
    itemboxEl.classList.add("itembox");

    let index = items.indexOf(i);

    let checkboxEl = document.createElement("input");
    checkboxEl.type = "checkbox";
    checkboxEl.classList.add("checkbox", `checkbox-${index}`);
    checkboxEl.id = `${index}`;

    let imgEl = document.createElement("img");
    imgEl.src = i[3];

    let titleEl = document.createElement("p");
    titleEl.classList.add("title");
    titleEl.innerText = `${i[1]}`;

    let priceBoxEl = document.createElement("div");
    priceBoxEl.classList.add("pricebox");
    let priceEl = document.createElement("p");
    priceEl.classList.add("price");
    priceEl.innerText = `${i[2]}`;

    const priceImgEl = document.createElement("img");
    priceImgEl.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACwElEQVR4nO2ZS4sTQRDHg+ILUfSmqy548eon0FVBWDZJdXLIF1AQxNfNiA9y8iCi7lRFxdPKHv0Kwnpb9aCCV11Y8AMsrguaaqWl8trZbFanOz2dBKagL5NMze/f86+a7plcLossskg1zHS0ixVd0wrfsaI1rcgkHaxojQHfaBUVhwNfjo5qwE820HqrAXQ/LHxhdlIDLnmBV+1RosL4wqumpRbSh1dPj2mgr77hdUvA6tjC6/YYa3idlgBXzzNQgxXeNEATMlhRVY4FFTBIwbKiam8+ORZMwKC2MeXHhzflnKkfCiLAh+cN0MSmvPnnR1IX4KvPcz8LAd5KVYDPhxQ3i5iqwYo4VKvUaQgYBXjtKsDONvhFls+NMp40lVfbTf7ZQS5FU6zwJSvSwQWYBPBSeOb8w726iOfMpRc7tsqlITrLQCvB1kIm4cwbeLAvaU6t6jMM9MdJBOCid/j2OLPhXLGNogVW9J0BlxmwZmq1bZ3fGXDe6Q4AXbEo2ITwgJ/F6705GgovxmeaAe92BSg85SDgo6nUdv4ffmput802kEv1y+vCnxyI52KgG7HZ+9b933S039I6S7I9TTT7rQ148uS/SnQidu7rBkQX+oEy4O/ODDYnyQa+MDuZSxoa6L2NAFN5tCcmYFVsw4DXpSuJbXo8fEcKvve49gXfhrB69RG3jdjEpTh134LF5Z9FPG4F34LAH5YX63YgVnjbiwBwmPlOyAsou4vRXOdcaZViD7kT4vng8C5F3Abd8ByQkIIVzweF77wKlJ5rJ4JWNGA+1xNW7RI8wDs9yNZFSPeZZ6ifFvDmHVB4Lzh86OUzu3abURDBacKnLSIIfFoigsL7FjEUeF8ihgo/qIiRgHcVMVLwtiJGEn7DR7x/LjvwQ+Kd1FA/oxbxqlb0tvlZVPYTgIuyAU+0h80iiyxyg8RfIY4Gl/J3SzUAAAAASUVORK5CYII=`;
    priceImgEl.classList.add("priceImg");

    priceBoxEl.append(priceEl, priceImgEl);
    itemboxEl.append(checkboxEl, imgEl, titleEl, priceBoxEl);
    inner.appendChild(itemboxEl);
  });

  // top div
  let top = document.createElement("div");
  top.classList.add("top");

  // all select btn
  let allselectEl = document.createElement("p");
  allselectEl.innerText = `총 ${localStorage.length - 1}개`;

  let allselectBtn = document.createElement("button");
  allselectBtn.classList.add("select", "btn-outlined", "small");
  allselectBtn.innerHTML = `전체 선택`;

  allselectBtn.addEventListener("click", () => {
    for (let i = 0; i < inner.children.length - 2; i++) {
      if (inner.children[i].children[0].checked) {
        continue;
      } else {
        inner.children[i].children[0].checked = true;
        sum += +items[inner.children[i].children[0].id][2];
        allPriceEl.innerText = `${sum}` + "원";
      }
    }
  });

  // delete btn
  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete", "btn-outlined", "small");
  deleteBtn.innerHTML = `선택 삭제`;

  deleteBtn.addEventListener("click", () => {
    for (let j = 0; j < 30; j++) {
      if (inner.children[j].children[0].checked) {
        sum -= +items[inner.children[j].children[0].id][2];
        allPriceEl.innerText = `${sum}` + "원";
        localStorage.removeItem(`cart-${inner.children[j].children[0].id}`);
        let select = inner.children[j];
        inner.removeChild(select);
        allselectEl.innerText = `총 ${localStorage.length - 1}개`;
        // 아이템이 0개인 경우 bottom div 숨김처리
        if (localStorage.length - 1 === 0) {
          bottom.style.display = "none";
          noItemEl.style.display = "block";
        }
        j--;
      }
    }
  });

  // if(cart.length === 0)
  let noItemEl = document.createElement("p");
  noItemEl.innerText = `장바구니에 아이템이 없습니다. 아이템을 추가해주세요.`;
  noItemEl.classList.add("noItem");
  noItemEl.style.display = "none";
  if (localStorage.length - 1 === 0) {
    noItemEl.style.display = "block";
  } else {
    noItemEl.style.display = "none";
  }

  // bottom div
  let bottom = document.createElement("div");
  bottom.classList.add("bottom");
  if (localStorage.length === 1) {
    bottom.style.display = "none";
  }

  // all price
  let allPriceEl = document.createElement("p");
  allPriceEl.classList.add("allprice");
  let allPriceText = document.createElement("p");
  allPriceText.classList.add("allPriceText");
  allPriceText.innerText = "총 결제 금액";
  allPriceEl.innerText = `${sum}` + "원";

  // checkbox event
  for (let i = 0; i < inner.children.length; i++) {
    inner.children[i].children[0].addEventListener("change", (e) => {
      if (e.target.checked) {
        sum += +items[inner.children[i].children[0].id][2];
        allPriceEl.innerText = `${sum}` + "원";
      } else {
        sum -= +items[inner.children[i].children[0].id][2];
        allPriceEl.innerText = `${sum}` + "원";
      }
    });
  }

  // buy btn
  buyBtn = document.createElement("button");
  buyBtn.classList.add("buy", "btn-secondary", "small");
  buyBtn.innerHTML = `총 주문하기`;
  // let orderHref = `/order`

  buyBtn.addEventListener("click", () => {
    for (let j = 0; j < localStorage.length - 1; j++) {
      if (inner.children[j].children[0].checked) {
        let local =
          "" + localStorage.getItem(`cart-${inner.children[j].children[0].id}`);
        localStorage.removeItem(`cart-${inner.children[j].children[0].id}`);
        localStorage.setItem(
          `cart-${inner.children[j].children[0].id}`,
          local.replace("false", "true")
        );

        // orderHref += `=${items[inner.children[j].children[0].id][0]}`
        //  orderPage()
      }
    }
    router.navigate(`orders`);
  });

  top.append(allselectEl, allselectBtn, deleteBtn);
  bottom.append(allPriceText, allPriceEl, buyBtn);
  inner.append(top, bottom, noItemEl);
  cartPage.append(inner);

  return cartPage;
};
export default cart;
