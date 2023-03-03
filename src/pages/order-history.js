import { getAllHistory } from '../api/getAllHistory'
import { posterMap } from '../movieInfoList/posterList'
import { AppStorage } from '../util'

function orderHistory() {
  const orderHistoryPage = document.createElement('section')
  orderHistoryPage.className = 'order-history'
  orderHistoryPage.innerHTML = /* html */ `
  <div class="inner">
    <h1>전체 구매 내역</h1>

    <ul class="order-history-list"></ul>
  </div>
`

  orderHistoryPage.renderAllHistory = renderAllHistory
  orderHistoryPage.renderAllHistory()

  return orderHistoryPage
}
export default orderHistory

async function renderAllHistory() {
  const orderHistoryPage = this
  const items = await getAllHistory(AppStorage.getAccessToken())
  const orderHistoryList = orderHistoryPage.querySelector('.order-history-list')

  const histories = items
    .map((item) => {
      const time = item.timePaid.substring(0, 10)

      return /* html */ `
      <li class="order-history-item" data-id=${item.detailId}>
        <div class="history-card">
          <time>${time}</time>

          <div class="history-card-image">
          <img src=${
            posterMap.get(item.product.title)
              ? posterMap.get(item.product.title)
              : item.product.thumbnail
          } alt=${item.product.title} />
          </div>

          <h2 class="history-card-title">${item.product.title}</h2>

          <strong class="history-card-price">
            <span class="amount">${Number(
              item.product.price
            ).toLocaleString()}</span>원
          </strong>

          <button type="button">상세보기</button>
        </div>
      </li>
    `
    })
    .join('')

  orderHistoryList.innerHTML = histories

  window.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return
    const target = e.target.closest('.order-history-item')
    if (target)
      location.href = `${location.origin}/order-details?id=${target.dataset.id}`
  })
}
