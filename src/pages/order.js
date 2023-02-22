import { CustomModalOpenEvent } from "./bank/bankModal";

/*
 *  [TODOS]
 *  1. 주문상품 확인
 *    - 주문자 정보
 *    - 상품 정보
 *    - 결제 수단
 *    - 결제 금액
 *  2. 결제 확인 (== 거래 확정)
 */

// 결제 내역 페이지
const orderPage = (orderList) => {
  const page = document.createElement("div");
  page.textContent = "order 페이지";

  setTimeout(() => {
    render(orderList);
  }, 4000);

  return page;
};

export default orderPage;

async function render(orderList) {
  // 모달 오픈
  openOrderModal(orderList);
}

function openOrderModal(orderList) {
  const modalContent = createOrderModalContent(orderList);
  console.log(modalContent);

  const modalProps = {
    title: "결제 진행",
    content: modalContent,
    submitBtnText: "결제",
    cancelBtnText: "결제 취소",
  };

  const modalEvent = {
    onSubmit,
    onCancel,
    onAfter,
  };

  window.dispatchEvent(
    CustomModalOpenEvent({
      ...modalProps,
      ...modalEvent,
    })
  );

  async function onSubmit() {
    // 결제 진행
    console.log("[TODO] 결제 진행");
  }

  async function onCancel() {
    // 결제 취소
    console.log("[TODO] 결제 취소");
  }

  async function onAfter() {
    // 결제 완료 이후
    console.log("[TOOD] 결제 완료");
  }
}

function createOrderModalContent(orderList) {
  const orderModalContent = document.createElement("div");
  orderModalContent.className = "order-modal-content";

  const orderProductMap = Array.from(orderList).map((orderProduct) => {
    const [id, title, price, thumbnail, checked] = orderProduct.split(",");
    return {
      id,
      title,
      price: Number(price),
      thumbnail,
      checked: Boolean(checked === "true" ? true : false),
    };
  });

  const productList = createProductList(orderProductMap);

  orderModalContent.append(productList);

  return orderModalContent;
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
  productPrice.textContent = price;

  productInfo.append(productTitle, productPrice);

  orderProduct.append(productPhotoWrapper, productInfo);

  return orderProduct;
}
