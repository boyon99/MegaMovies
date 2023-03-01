import { readItem } from '../api/movieRequest'
import { AppStorage } from '../util'
import { router } from '../'

// random buy
function getRandomBuy() {
  return Math.floor(10 + Math.random() * 90);
}

// random viewpoint
function getRandom() {
  return Math.floor(10 + Math.random() * 90);
}

// random star
function getRandomRate() {
  return (2 + Math.random() * 3).toFixed(1);
}

// date
function getDate(i) {
  let now = new Date();
  return now.getMonth() + 1 - i < 1 ? now.getMonth() + 13 - i : now.getMonth() + 1 - i;
}

// rendering
const moviePage = (movieId) => {
  const page = document.createElement('div');
  page.classList.add('page')

    // movie content
    ; (async () => {
      const items = await readItem()
      const item = items.filter(i => i.id === movieId)

      // img
      const newImgEl = document.createElement('img')
      newImgEl.src = item[0].thumbnail
      newImgEl.classList.add('poster')

      // title
      const titleEl = document.createElement('p')
      titleEl.innerText = item[0].title
      titleEl.classList.add('title')

      // star
      const starEl = document.createElement('img')
      starEl.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABkklEQVR4nM2VzyuEYRDHl9z8yJESSS7cHOS2F2pj35ml9r/gpihlz1J4Z94zNwcncpSjC0dpSZKUInKh3Z0Hj2ZjtfZd+777o0xNvfXO9/t5Zt553zcS+U9hcb1Ts2EAAUoJ8HJDzG3M7RDgJwF+bkgXArxkkK2mXtfV3E6stgrwww+AHi2stNcNIECL3+YFCPJCHU9P9yUA7SLptYU3jKZaMgl3wDheTByaFaTd3+Y/XdCeIM9prWpU62sqyPMCtG+QzwU4V87QVMgv7bl6qWcBkJ3aGBTg22qNTSnoLgvuUPFoZrw+A3RVsznyjY7Lf/7xjV6DdFnDya8zDvX//ZAnvS6DfBYaAHRhp92eYJs0vdZtkNMhAGnVRMKEAd4KDqDNUOZ5ANJJCMBxKHObSjUL8kvwzaFX1QQG5N9k/y151/S7V3Y1fcfjeOiz3we5OI/kHG9YkHcE6aOoxvGwqm+/AT6ShBstqXHcMUE+rOofIcDbBvj0DThZsVugcV0I1QQHJGjURmxT0HqtVU1gQD3jEx6cj2SryUOkAAAAAElFTkSuQmCC`
      starEl.classList.add('star')

      // rate 
      const rateEl = document.createElement('p')
      rateEl.innerText = `${getRandomRate()}`
      rateEl.classList.add('rate')

      // description
      const descriptionEl = document.createElement('p')
      descriptionEl.innerText = item[0].description + " ..."
      descriptionEl.classList.add('description')

      // tags
      const tagsEl = document.createElement('div')
      tagsEl.classList.add('tags')
      const tags = item[0].tags.map(i => {
        const tag = document.createElement('p')
        tag.innerText = i
        tag.classList.add('tag')
        tagsEl.append(tag)
      })

      // price
      const priceEl = document.createElement('p')
      priceEl.innerText = `${item[0].price}`
      priceEl.classList.add('price')

      // price Img
      const priceImgEl = document.createElement('img')
      priceImgEl.classList.add('priceImg')

      // modal
      const modal = document.createElement('div')
      modal.classList.add('modal')

      const modalShow = document.createElement('div')
      modalShow.classList.add('modalShow')
      modal.append(modalShow)

      const modalImg = document.createElement('img')
      modalImg.src = "data:image/png;base64,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"
      const modalText = document.createElement('p')

      const continueBtn = document.createElement('button')
      continueBtn.classList.add('continueBtn', 'btn-secondary')
      continueBtn.innerText = `계속하기`

      continueBtn.addEventListener('click', () => {
        modal.style.display = 'none'
      })

      const cartBtn = document.createElement('button')
      cartBtn.classList.add('cartBtn', 'btn-outlined')
      cartBtn.innerText = `장바구니 가기`

      cartBtn.addEventListener('click', () => {
        router.navigate(`/cart`)
      })
      modalShow.append(modalImg, modalText, continueBtn, cartBtn)
      modal.style.display = 'none'

      // cart btn
      const cartBtnEl = document.createElement('button')
      cartBtnEl.classList.add('btn-ghost', 'cart', 'medium')
      cartBtnEl.innerText = "장바구니 담기"
      // cart info storage
      cartBtnEl.addEventListener('click', () => {
        if (AppStorage.accessTokenKey) {
          modal.style.display = 'block'

          let isCart = AppStorage.setCartItem(item[0])
          if (isCart === 1) {
            modalText.innerText = `해당 영화를 장바구니에 추가했습니다`
            modalText.style.fontSize = "20px"
            modalText.style.top = "120px"
          } else if (isCart === 0) {
            modalText.innerText = `이미 장바구니에 추가한 영화입니다`
            modalText.style.fontSize = "20px"
            modalText.style.top = "120px"
          } else {
            modalText.innerText = `장바구니에 최대 30개의 상품을 담을 수 있습니다. 이 이상 추가하려면 장바구니를 정리해주세요.`
            modalText.style.fontSize = "16px"
            modalText.style.top = "115px"
          }

        } else {
        }
      })

      // buy btn
      const buyBtnEl = document.createElement('button')
      buyBtnEl.classList.add('btn-outlined', 'buy', 'medium')
      buyBtnEl.innerText = "구매하기"
      // cart info storage
      buyBtnEl.addEventListener('click', () => {
        // ?id='...' => 해당 아이디로 결제
        // ?from=cart => 장바구니에서 결제로 
        router.navigate(`order?id=${movieId}`);
      })


      page.append(modal, newImgEl, titleEl, starEl, rateEl, descriptionEl, tagsEl, priceEl, priceImgEl, buyBtnEl, cartBtnEl)
    })()
  // chart
  page.innerHTML = `
  <div class="canvas">
  <!-- line chart canvas element -->
  <canvas id="buy"></canvas>
  <!-- pie chart canvas element -->
  <canvas id="point"></canvas>
  </div>
`
  page.addEventListener('mouseenter', () => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // line chart data
    var buyerData = {
      labels: [`${getDate(5)}` + "월", `${getDate(4)}` + "월", `${getDate(3)}` + "월", `${getDate(2)}` + "월", `${getDate(1)}` + "월", `${getDate(0)}` + "월"],
      datasets: [
        {
          fillColor: "rgba(251,79,147,0.4)",
          strokeColor: "#fb4f93",
          pointColor: "#fff",
          pointStrokeColor: "#fb4f93",
          data: [getRandomBuy(), getRandomBuy(), getRandomBuy(), getRandomBuy(), getRandomBuy(), getRandomBuy()]
        }
      ]
    }
    // get line chart canvas
    var buy = document.getElementById('buy').getContext('2d');
    // draw line chart
    new Chart(buy).Line(buyerData);
    // pie chart data
    var pieData = [
      {
        value: getRandom(),
        color: "rgba(172,194,132,0.6)"
      },
      {
        value: getRandom(),
        color: "rgba(74,202,180,0.6)"
      },
      {
        value: getRandom(),
        color: "rgba(255,129,83,0.6)"
      },
      {
        value: getRandom(),
        color: "rgba(255,234,136, 0.6)"
      }
    ];
    // pie chart options
    var pieOptions = {
      segmentShowStroke: false,
      animateScale: true
    }
    // get pie chart canvas
    var point = document.getElementById("point").getContext("2d");
    // draw pie chart
    new Chart(point).Pie(pieData, pieOptions);
  }, { once: true })

  // chart info
  let pointList = ["연출", "연기", "스토리", "영상미"]
  let colorList = ["rgba(172,194,132,0.6)", "rgba(74,202,180,0.6)", "rgba(255,129,83,0.6)", "rgba(255,234,136, 0.6)"]
  const listcontainer = document.createElement('div')
  listcontainer.classList.add('listcontainer')

  for (let i = 0; i < 4; i++) {
    const listcontain = document.createElement('div')
    listcontain.classList.add('listcontain')

    const color = document.createElement('div')
    color.classList.add('color')
    color.style.width = "10px"
    color.style.height = "10px"
    color.style.backgroundColor = colorList[i]

    const point = document.createElement('p')
    point.innerText = pointList[i]
    point.classList.add('point')
    listcontain.append(color, point)
    listcontainer.append(listcontain)
  }

  const monthBuy = document.createElement('p')
  monthBuy.classList.add('monthBuy')
  monthBuy.innerText = "월별 영화구매수"

  const viewPoint = document.createElement('p')
  viewPoint.classList.add('viewPoint')
  viewPoint.innerText = "감상포인트"

  page.append(listcontainer, monthBuy, viewPoint)
  return page;
}


export default moviePage


