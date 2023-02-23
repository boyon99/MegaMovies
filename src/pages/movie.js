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

      // buy btn
      const cartBtnEl = document.createElement('button')
      cartBtnEl.classList.add('btn-ghost', 'cart', 'medium')
      cartBtnEl.innerText = "장바구니 담기"
      // cart info storage
      cartBtnEl.addEventListener('click', ()=>{
        if(AppStorage.accessTokenKey){
          AppStorage.setCartItem(item[0])
        }else{
        }
      })

      const buyBtnEl = document.createElement('button')
      buyBtnEl.classList.add('btn-outlined', 'buy', 'medium')
      buyBtnEl.innerText = "구매하기"
      // cart info storage
      buyBtnEl.addEventListener('click', ()=>{
        // ?id='...' => 해당 아이디로 결제
        // ?from=cart => 장바구니에서 결제로 
        router.navigate(`order?from=movie&id=${movieId}`);
      })
      

      page.append(newImgEl, titleEl, starEl, rateEl, descriptionEl, tagsEl, priceEl, priceImgEl, buyBtnEl, cartBtnEl)
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
  }, {once:true})

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


