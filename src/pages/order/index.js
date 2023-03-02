import { router } from "../..";
import BankAPI from "../../api/bank";
import PaymentAPI from "../../api/payment";
import { AppStorage } from "../../util";
import { bankLogoImgMap } from "../bank/bankLogoMap";
import { renderToast } from "../bank/toast";
import { openAddAccountModal } from "./orderModal";

const formData = {
  orderItems: [],
  accountId: "",
};

const bankAPI = new BankAPI();
const paymentAPI = new PaymentAPI();

// 결제 페이지
const orderPage = () => {
  const user = AppStorage.getCurrentUser();
  if (!user) router.navigate("login");

  const page = document.createElement("div");
  page.className = "order-page";
  page.render = render;

  const inner = document.createElement("div");
  inner.className = "inner";

  // title
  const pageTitle = document.createElement("h3");
  pageTitle.className = "title";
  pageTitle.textContent = "주문 / 결제";

  // 주문자 정보
  const userInfo = document.createElement("div");
  userInfo.className = "user-info";

  const userInfoDisplay = document.createElement("div");
  userInfoDisplay.className = "user-info__display";

  const profile = document.createElement("div");
  profile.className = "profile";
  const defaultImg = "https://cdn-icons-png.flaticon.com/512/6522/6522516.png";
  const profileImage = document.createElement("img");
  profileImage.src = user?.profileImg ?? defaultImg;
  profileImage.alt = "유저 프로필 사진";
  profile.append(profileImage);

  const userName = document.createElement("div");
  userName.className = "name";
  userName.textContent = user?.displayName;

  const userEmail = document.createElement("div");
  userEmail.classList.add("email", "block-format");
  userEmail.textContent = user?.email;

  userInfoDisplay.append(profile, userName, userEmail);
  userInfo.append(userInfoDisplay);

  const userInfoAccordionTitle = document.createElement("div");
  userInfoAccordionTitle.innerHTML = `
    주문자 정보 (유저 이름: <span class="page__highlight-text">${user?.displayName}</span> / 이메일: <span class="page__highlight-text">${user?.email}</span>)
  `;
  const userInfoAccordion = createAccordion({
    title: userInfoAccordionTitle,
    content: userInfo,
  });

  const productListAccordionTitle = document.createElement("div");
  productListAccordionTitle.innerHTML = "주문상품 (<strong>로딩중</strong>)";
  const productListAccordion = createAccordion({
    title: productListAccordionTitle,
    content: "",
  });

  const paymentMethodAccordionTitle = document.createElement("div");
  paymentMethodAccordionTitle.innerHTML = `결제수단 (계좌 간편결제: <span class="page__highlight-text">계좌 선택 안 됨</span>)`;
  const paymentMethodAccordion = createAccordion({
    title: paymentMethodAccordionTitle,
    content: "",
  });

  const confirmForm = document.createElement("div");
  confirmForm.className = "confirm-form";
  confirmForm.innerHTML = `
    <div class="confirm-form__title">최종 결제 확인</div>
    <div class="confirm-form__list"></div>
    <div class="confirm-form__total-price"></div>
  `;

  inner.append(
    pageTitle,
    userInfoAccordion,
    productListAccordion,
    paymentMethodAccordion,
    confirmForm
  );

  page.append(inner);

  // render
  page.render();

  return page;
};

export default orderPage;

async function render() {
  const page = this;
  const inner = page.querySelector(".inner");

  const orderItems = await getOrderItems();
  if (!orderItems) {
    inner.replaceChildren(createEmptyContent());
    return;
  }

  formData.orderItems = orderItems.map((orderItem) => orderItem.id);

  const userBankList = await bankAPI.getUserBankAccountList({
    accessToken: AppStorage.getAccessToken(),
  });

  const totalPrice = orderItems
    .map((product) => product.price)
    .reduce((prevPrice, nextPrice) => prevPrice + nextPrice, 0);
  const totalPriceNumberFormat = Intl.NumberFormat("KO-KR").format(totalPrice);

  const [
    {
      children: [userInfoAccordionTitle, userInfoAccordionContent],
    },
    {
      children: [productListAccordionTitle, productListAccordionContent],
    },
    {
      children: [paymentMethodAccordionTitle, paymentMethodAccordionContent],
    },
  ] = page.querySelectorAll(".page__accordion");

  productListAccordionTitle.firstChild.innerHTML = `
    주문상품 (<span class="page__highlight-text">${orderItems.length}</span>건 / 총 주문금액 <span class="page__highlight-text">${totalPriceNumberFormat}</span>원)
  `;
  productListAccordionContent.replaceChildren(createProductList(orderItems));

  paymentMethodAccordionContent.replaceChildren(
    createBankList(userBankList.accounts)
  );

  paymentMethodAccordionContent.addEventListener("change", (e) => {
    const { bank } = e.target.dataset;

    formData.accountId = e.target.value;

    paymentMethodAccordionTitle.firstChild.innerHTML = `결제수단 (계좌 간편결제: <span class="page__highlight-text">${
      bank ?? " "
    }</span>)`;
  });

  const [confirmtitle, confirmList, confirmTotal] =
    page.querySelector(".confirm-form").children;

  confirmList.innerHTML = `
    <div>총 상품 금액</div>
    <div><strong>${totalPriceNumberFormat} 원</strong></div>
  `;

  const confirmText = document.createElement("div");
  confirmText.className = "confirm-form__total-price-text";
  confirmText.textContent = "계좌 간편결제";
  const confirmPrice = document.createElement("div");
  confirmPrice.className = "confirm-form__total-price-num";
  confirmPrice.textContent = `${totalPriceNumberFormat} 원`;

  confirmTotal.append(confirmText, confirmPrice);

  const checkWrapper = document.createElement("div");
  checkWrapper.className = "check-wrapper";
  const checkbox = document.createElement("input");
  checkbox.id = "confirm-check";
  checkbox.type = "checkbox";
  const label = document.createElement("label");
  label.setAttribute("for", "confirm-check");
  label.textContent =
    "주문상품, 주문정보를 확인하였으며, 구매진행에 동의합니다.";

  checkWrapper.append(checkbox, label);

  const payButton = document.createElement("button");
  payButton.classList.add("btn-pay", "btn-primary", "large");
  payButton.textContent = "결제하기";
  payButton.disabled = true;

  const handleCheckChange = (e) => {
    payButton.disabled = !e.target.checked;
  };
  checkbox.addEventListener("change", handleCheckChange);

  let isLoading = false;
  const handlePayBtnClick = (e) => {
    if (isLoading) {
      renderToast({
        message: "결제 진행중입니다. 잠시만 기다려주세요",
        type: "error",
        fixed: true,
        autoUnmount: 2000,
      });
      return;
    }

    if (!checkbox.checked) {
      renderToast({
        message:
          "주문 정보를 확인 후 구매진행 동의를 클릭하여 체크 표시해주세요",
        type: "error",
        fixed: true,
        autoUnmount: 2000,
      });
      return;
    }
    if (!formData.accountId) {
      renderToast({
        message: "계좌를 선택 후 진행해 주세요",
        type: "error",
        fixed: true,
        autoUnmount: 2000,
      });
      return;
    }

    isLoading = true;
    payButton.classList.add("loading");
    payButton.textContent = "결제 진행중...";
    payButton.disabled = true;
    const accessToken = AppStorage.getAccessToken();
    formData.orderItems.forEach(async (orderProductId) => {
      const paymentResult = await paymentAPI.order({
        accessToken,
        productId: orderProductId,
        accountId: formData.accountId,
      });

      if (paymentResult === true) {
        clearCart();
      }
    });
    payButton.classList.remove("loading");
    payButton.disabled = false;
    payButton.textContent = "결제하기";
  };
  payButton.addEventListener("click", handlePayBtnClick);

  inner.append(checkWrapper, payButton);
}

// 상품 요소 생성
function createProductList(orderList) {
  const orderProductList = document.createElement("ul");
  orderProductList.className = "order-product-list";

  const productMap = Array.from(orderList).map(
    ({ id, title, price, thumbnail }) =>
      createProduct({ id, title, price, thumbnail })
  );

  orderProductList.append(...productMap);

  return orderProductList;
}

function createProduct({ id, title, price, thumbnail }) {
  const orderProduct = document.createElement("li");
  orderProduct.className = "order-product";
  orderProduct.dataset.id = id;

  const productPhotoWrapper = document.createElement("div");
  productPhotoWrapper.className = "photo";
  const productPhoto = document.createElement("img");
  productPhoto.src = thumbnail;
  productPhotoWrapper.appendChild(productPhoto);

  const productInfo = document.createElement("div");
  productInfo.className = "product-info";

  const productTitle = document.createElement("h3");
  productTitle.className = "title";
  productTitle.textContent = title;
  const productPrice = document.createElement("div");
  productPrice.className = "price";
  productPrice.textContent = `${new Intl.NumberFormat("KO-KR").format(
    price
  )} 원`;

  productInfo.append(productTitle, productPrice);

  orderProduct.append(productPhotoWrapper, productInfo);

  return orderProduct;
}

// 계좌 생성
export function createBankList(userBankList) {
  const bankListWrapper = document.createElement("div");
  bankListWrapper.className = "payment-banks";

  const bankList = document.createElement("div");
  bankList.classList = "bank-list";
  const bankMap = userBankList.map((bankAccount) => {
    const { id, bankName, bankCode, accountNumber, balance } = bankAccount;
    const accountInputWrapper = document.createElement("div");
    accountInputWrapper.className = "bank-input-wrapper";

    const accountInput = document.createElement("input");
    accountInput.type = "radio";
    accountInput.id = bankCode;
    accountInput.name = "bank";
    accountInput.value = id;
    accountInput.dataset.bank = bankName;
    const accountLabel = document.createElement("label");
    accountLabel.className = "bank";
    accountLabel.setAttribute("for", bankCode);

    const bankLogo = document.createElement("div");
    bankLogo.className = "bank-logo";
    bankLogo.appendChild(bankLogoImgMap.get(bankName).cloneNode(true));
    const accountInfo = document.createElement("div");
    accountInfo.className = "account-info";
    accountInfo.innerHTML = `
      계좌번호
      <div class="account-num">${accountNumber}</div>
    `;
    accountLabel.append(bankLogo, accountInfo);

    accountInputWrapper.append(accountInput, accountLabel);

    return accountInputWrapper;
  });

  bankList.append(...bankMap);
  if (userBankList.length < bankLogoImgMap.size) {
    const addBank = document.createElement("div");
    addBank.className = "add-bank";
    const addBankButton = document.createElement("button");
    addBankButton.classList.add("btn--add-bank", "btn-primary", "small");
    addBankButton.textContent = "+";
    addBank.prepend(document.createTextNode("계좌 추가"));
    addBank.append(addBankButton);
    addBank.addEventListener("click", (e) => {
      openAddAccountModal();
    });
    bankList.append(addBank);
  }

  bankListWrapper.append(bankList);

  return bankListWrapper;
}

// 아코디언 생성
function createAccordion({ title, content }) {
  const accordion = document.createElement("div");
  accordion.className = "page__accordion";

  const titleElement = document.createElement("h3");
  titleElement.className = "page__accordion-title";
  const titleButton = document.createElement("button");

  if (typeof title === "string") {
    titleElement.textContent = title;
    titleElement.appendChild(titleButton);
  } else {
    titleElement.append(title, titleButton);
  }

  const contentWrapperElement = document.createElement("div");
  contentWrapperElement.className = "page__accordion-content-wrapper";
  const contentElement = document.createElement("div");
  contentElement.className = "content";
  contentElement.append(content);
  contentWrapperElement.append(contentElement);

  accordion.append(titleElement, contentWrapperElement);

  titleButton.addEventListener("click", (e) => {
    titleButton.classList.toggle("more");
    const contentIsVisible = titleButton.classList.contains("more");
    contentWrapperElement.classList.toggle("hide", contentIsVisible);
  });

  return accordion;
}

//
function createEmptyContent() {
  const emptyContent = document.createElement("div");
  emptyContent.classList = "order__empty";

  emptyContent.textContent = "주문 상품을 찾을 수 없습니다.";

  return emptyContent;
}

async function getProduct(id) {
  const headers = {
    "Content-type": "application/json",
    username: "KDT4_Team1",
    apikey: process.env.apikey,
  };

  const productResponse = await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/${id}`,
    { headers }
  );

  if (productResponse.status !== 200) return null;

  const product = await productResponse.json();

  return product;
}

// cart
async function getOrderItems() {
  switch (router.getCurrentLocation().url) {
    case "order":
      const product = await getProduct(router.getCurrentLocation().params?.id);
      return !product ? null : [product.id];
    case "cart":
    case "orders":
      return getOrderCartItems();
  }
}

function getOrderCartItems() {
  const cartProductList = getCart();
  if (!cartProductList) return null;

  const selectedCartProductList = cartProductList.filter(
    (cartProduct) => cartProduct.checked
  );
  if (selectedCartProductList.length === 0) return null;

  return selectedCartProductList;
}

function getCart() {
  const storageSize = localStorage.length;
  if (localStorage.length === 0) return null;
  const cartProductList = [];
  Array.from({ length: storageSize }).forEach((_, index) => {
    const key = localStorage.key(index);
    if (key.includes("cart-")) {
      const [id, title, price, thumbnail, checked] = localStorage
        .getItem(key)
        .split(",");
      const cartProduct = {
        cartKey: key,
        id,
        title,
        price: Number(price),
        thumbnail,
        checked: checked === "true" ? true : false,
      };

      cartProductList.push(cartProduct);
    }
  });

  return cartProductList;
}

export function unsetCartChecked() {
  const cartProductList = getCart();
  if (!cartProductList) return;

  cartProductList
    .filter((cartProduct) => cartProduct.checked)
    .forEach((selectedCartProduct) => {
      const unsetTargetCartStorageItem = localStorage
        .getItem(selectedCartProduct.cartKey)
        .split(",");

      unsetTargetCartStorageItem[unsetTargetCartStorageItem.length - 1] = false;
      const unsetedItem = unsetTargetCartStorageItem.join(",");

      localStorage.setItem(selectedCartProduct.cartKey, unsetedItem);
    });
}

function clearCart() {
  const cartProductList = getCart();
  if (!cartProductList) return;

  cartProductList.forEach((cartProduct) => {
    localStorage.removeItem(cartProduct.cartKey);
  });
}
