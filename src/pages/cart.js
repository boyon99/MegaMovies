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
    priceImgEl.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADlElEQVR4nO1YSWgUURBtFVH0IK7gdhA9iAtePCoeNCCaqZpBBiHqNQcFEQRXJCdBEaNTNSZEFAUPEj2IiAqCGBA8iBfBEEVc8KC44Aom8/+YL92j8Xd1D/07TnChH/xLd9erevWrqn+352XIkCFDhgwWFPAzjWysddJLCVO8MEYhvbV5+vOl+Wl5FNJZEcvTRCONfDpkBPQoteN8eYVwbBTwtrQ8GvlpOBY+lWhUzdFm6dwAz0rlGPhwjIBraThMoTRHclShtMnBsH1mxBBpYyoByH0RAUj9prlrgitHFbklksj1nbNdA3goyqjD1XF/rrxAOh5aeW525dFIncK+z9XW8wMWxr2utgppZ10BSJ3uArhX1P8JZwFV4KLY/kFT6JjhJADolqj9oammgF64cJjmrmm+z3D9c9FZgMnzVAX8TWRwQ6Jd8egUhaytjD/WSGWbp4K8NIlHAxciCSyWpjsLCEiQ7os+oCQbf0qI7J+LXMvx3mTf3C5K736q4AMSoGNpSRRQt5xefuYUUNVKxO1k33xP7H67c+AKeXewRDB+SSmkfUP349cn0XgHa1z8xuqDqr8LdTmA9oTLMLDp/nk/OfN1J8jfsbxMAP7lO2BD57hJ1GLVFLsmhR7yPK9SOL5ENPxd+YxGLonRuFI+Y9aWxingryGuHDd5w4V/dlHIA2HC8lr5nN+UouH3RwQArRFj+VDSKVYBV0zTkYnDFlBzzD1yssQEd8d+ppIrL44ko7VrrAL+YO3Sg4gApH3CV89vBR+QArWJzIXmeGTOIz2uy4V8webqz9E8IeC6KNm21AH/6SbV2RjFf3yMaqBDcsXU5uvgOtAV0R934uxDXMDXBNfVH9dDPxMCnzH2qXsiaC7g5WFy/mw8M0rOdo3ldUlcA1BaFPe1p4GeiBG63GsUfvwmeW87MHhirn3kVkBfzKoz4134at8JQ1y9wfvG+v5QQB99n14joYAvyaOycNrtyqWRjlulMujvnCifyw0NviaAtosyuhkWxC3uAsqrZcA6zL2j4QLkecf+ZlVAyqzvmOzKVXsr00fL3noRsqkUaFnDBfhNq5BexY02hXQjLZ/8YNK/xLwzbW2jGy4gcIp0Pt5p+t+GVSxviU8GX/RGCirPrTHZH/QnUlqu6B8M/sm3dWSir/fXDfjecPk00G3JN9BMC72RhAJ6LjJ2YNhcSLtEKb70e62xEWfIkCFDhv8Z3wEKTv/wCrKPBQAAAABJRU5ErkJggg==`;
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
    // -3
    for (let i = 0; i < inner.children.length - 3; i++) {
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
