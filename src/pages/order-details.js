import { me } from '../api/auth';
import { getHistory } from '../api/getHistory'
import posterMap from '../movieInfoList/posterList'
import { AppStorage } from '../util'

function orderDetails () {
  const orderDetailsPage = document.createElement('section');
  orderDetailsPage.className = 'order-details-section'
  orderDetailsPage.innerHTML = /* html */ `
  <div class="inner">
    <h2>구매 내역 확인</h2>
    <div class="order-details">
  </div>
`
  orderDetailsPage.renderHistory = renderHistory;
  orderDetailsPage.renderHistory();

  return orderDetailsPage;
}

export default orderDetails

async function renderHistory() {
  const orderDetailsPage = this;

  const idRegex = /(?<=\?id\=)\w+/
  const [detailId] = idRegex.exec(location.search)

  const user = await getUserInfo();
  const item = await getHistory(detailId);

  const orderDetailsDiv = orderDetailsPage.querySelector('.order-details')

  const tags = item.product.tags
  const tagEls = tags.map(tag => {
    return /* html */`
      <span class="tag">${tag}</span>
    `
  }).join('')

  const result = /* html */ `
    <div class="order-details-movie">
      <div class="movie-image">
        <img src=${posterMap.get(item.product.title)} alt="${
    item.product.title
  }" />
      </div>
  
      <div class="movie-detail">
        <div class="movie-info-wrapper">
          <strong>${item.product.title}</strong>
          ${tagEls}
        </div>
        <p>${item.product.description}</p>
      </div>
    </div>

    <div class="order-details-user">
      <dl>
        <div>
          <dt>구매일자</dt>
          <dd>
        <time class="purchase-date" datetime="2023-02-22">${item.timePaid.substring(
          0,
          10
        )}</time>
      </dd>
        </div>

        <div>
          <dt>구매자 아이디</dt>
          <dd id="userId">${user?.email ?? ''}</dd>
        </div>
        
        <div>
          <dt>영화 가격</dt>
          <dd>
            <span id="amount">${Number(
              item.product.price
            ).toLocaleString()}</span>원  
          </dd>
        </div>

        <div>
          <dt>결제 계좌 정보</dt>
          <dd id="account">
          ${item.account.bankName}
          ${item.account.accountNumber}
          </dd>
        </div>
      </dl>
    </div>
  `

  orderDetailsDiv.innerHTML = result
}

async function getUserInfo () {
  const user = await me(AppStorage.getAccessToken());
  
  return user;
}