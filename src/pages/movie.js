import { readItem } from "../api/movieRequest";
import { AppStorage } from "../util";
import { router } from "../";

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
  return now.getMonth() + 1 - i < 1
    ? now.getMonth() + 13 - i
    : now.getMonth() + 1 - i;
}

// rendering
const moviePage = (movieId) => {
  const page = document.createElement("div");
  page.classList.add("page");

  // movie content
  (async () => {
    const items = await readItem();
    const item = items.filter((i) => i.id === movieId);

    // img
    const newImgEl = document.createElement("img");
    newImgEl.src = item[0].thumbnail;
    newImgEl.classList.add("poster");

    // title
    const titleEl = document.createElement("p");
    titleEl.innerText = item[0].title;
    titleEl.classList.add("title");

    // star
    const starEl = document.createElement("img");
    starEl.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABkklEQVR4nM2VzyuEYRDHl9z8yJESSS7cHOS2F2pj35ml9r/gpihlz1J4Z94zNwcncpSjC0dpSZKUInKh3Z0Hj2ZjtfZd+777o0xNvfXO9/t5Zt553zcS+U9hcb1Ts2EAAUoJ8HJDzG3M7RDgJwF+bkgXArxkkK2mXtfV3E6stgrwww+AHi2stNcNIECL3+YFCPJCHU9P9yUA7SLptYU3jKZaMgl3wDheTByaFaTd3+Y/XdCeIM9prWpU62sqyPMCtG+QzwU4V87QVMgv7bl6qWcBkJ3aGBTg22qNTSnoLgvuUPFoZrw+A3RVsznyjY7Lf/7xjV6DdFnDya8zDvX//ZAnvS6DfBYaAHRhp92eYJs0vdZtkNMhAGnVRMKEAd4KDqDNUOZ5ANJJCMBxKHObSjUL8kvwzaFX1QQG5N9k/y151/S7V3Y1fcfjeOiz3we5OI/kHG9YkHcE6aOoxvGwqm+/AT6ShBstqXHcMUE+rOofIcDbBvj0DThZsVugcV0I1QQHJGjURmxT0HqtVU1gQD3jEx6cj2SryUOkAAAAAElFTkSuQmCC`;
    starEl.classList.add("star");

    // rate
    const rateEl = document.createElement("p");
    rateEl.innerText = `${getRandomRate()}`;
    rateEl.classList.add("rate");

    // description
    const descriptionEl = document.createElement("p");
    descriptionEl.innerText = item[0].description + " ...";
    descriptionEl.classList.add("description");

    // tags
    const tagsEl = document.createElement("div");
    tagsEl.classList.add("tags");
    const tags = item[0].tags.map((i) => {
      const tag = document.createElement("p");
      tag.innerText = i;
      tag.classList.add("tag");
      tagsEl.append(tag);
    });

    // price
    const priceEl = document.createElement("p");
    priceEl.innerText = `${parseInt(item[0].price / 1000)},${
      item[0].price % 1000 === 0 ? "000" : item[0].price % 1000
    }`;
    priceEl.classList.add("price");

    // price Img
    const priceImgEl = document.createElement("img");
    priceImgEl.classList.add("priceImg");

    // modal
    const modal = document.createElement("div");
    modal.classList.add("modal");

    const modalShow = document.createElement("div");
    modalShow.classList.add("modalShow");
    modal.append(modalShow);

    const modalImg = document.createElement("img");
    modalImg.src =
      "data:image/png;base64,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";
    const modalText = document.createElement("p");

    const continueBtn = document.createElement("button");
    continueBtn.classList.add("continueBtn", "btn-secondary");
    continueBtn.innerText = `계속하기`;

    continueBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    const cartBtn = document.createElement("button");
    cartBtn.classList.add("cartBtn", "btn-outlined");
    cartBtn.innerText = `장바구니 가기`;

    cartBtn.addEventListener("click", () => {
      router.navigate(`/cart`);
    });
    modalShow.append(modalImg, modalText, continueBtn, cartBtn);
    modal.style.display = "none";

    // cart btn
    const cartBtnEl = document.createElement("button");
    cartBtnEl.classList.add("btn-ghost", "cart", "medium");
    cartBtnEl.innerText = "장바구니 담기";
    // cart info storage
    cartBtnEl.addEventListener("click", () => {
      if (AppStorage.accessTokenKey) {
        modal.style.display = "block";

        let isCart = AppStorage.setCartItem(item[0]);
        if (isCart === 1) {
          modalText.innerText = `해당 영화를 장바구니에 추가했습니다`;
          modalText.style.fontSize = "20px";
          modalText.style.top = "120px";
        } else if (isCart === 0) {
          modalText.innerText = `이미 장바구니에 추가한 영화입니다`;
          modalText.style.fontSize = "20px";
          modalText.style.top = "120px";
        } else {
          modalText.innerText = `장바구니에 최대 30개의 상품을 담을 수 있습니다. 이 이상 추가하려면 장바구니를 정리해주세요.`;
          modalText.style.fontSize = "16px";
          modalText.style.top = "115px";
        }
      } else {
      }
    });

    // buy btn
    const buyBtnEl = document.createElement("button");
    buyBtnEl.classList.add("btn-outlined", "buy", "medium");
    buyBtnEl.innerText = "구매하기";
    // cart info storage
    buyBtnEl.addEventListener("click", () => {
      // ?id='...' => 해당 아이디로 결제
      // ?from=cart => 장바구니에서 결제로
      router.navigate(`order?id=${movieId}`);
    });

    page.append(
      modal,
      newImgEl,
      titleEl,
      starEl,
      rateEl,
      descriptionEl,
      tagsEl,
      priceEl,
      priceImgEl,
      buyBtnEl,
      cartBtnEl
    );
  })();
  // chart
  page.innerHTML = `
  <div class="canvas">
  <!-- line chart canvas element -->
  <canvas id="buy"></canvas>
  <!-- pie chart canvas element -->
  <canvas id="point"></canvas>
  </div>
`;
  page.addEventListener(
    "mouseenter",
    () => {
      window.scrollTo({ top: 0, behavior: "smooth" });

      // line chart data
      var buyerData = {
        labels: [
          `${getDate(5)}` + "월",
          `${getDate(4)}` + "월",
          `${getDate(3)}` + "월",
          `${getDate(2)}` + "월",
          `${getDate(1)}` + "월",
          `${getDate(0)}` + "월",
        ],
        datasets: [
          {
            fillColor: "rgba(251,79,147,0.4)",
            strokeColor: "#fb4f93",
            pointColor: "#fff",
            pointStrokeColor: "#fb4f93",
            data: [
              getRandomBuy(),
              getRandomBuy(),
              getRandomBuy(),
              getRandomBuy(),
              getRandomBuy(),
              getRandomBuy(),
            ],
          },
        ],
      };
      // get line chart canvas
      var buy = document.getElementById("buy").getContext("2d");
      // draw line chart
      new Chart(buy).Line(buyerData);
      // pie chart data
      var pieData = [
        {
          fillColor: "rgba(251,79,147,0.4)",
          strokeColor: "#fb4f93",
          pointColor: "#fff",
          pointStrokeColor: "#fb4f93",
          data: [
            getRandomBuy(),
            getRandomBuy(),
            getRandomBuy(),
            getRandomBuy(),
            getRandomBuy(),
            getRandomBuy(),
          ],
        },
      ];

      // get line chart canvas
      var buy = document.getElementById("buy").getContext("2d");
      // draw line chart
      new Chart(buy).Line(buyerData);
      // pie chart data
      var pieData = [
        {
          value: getRandom(),
          color: "rgba(172,194,132,0.6)",
        },
        {
          value: getRandom(),
          color: "rgba(74,202,180,0.6)",
        },
        {
          value: getRandom(),
          color: "rgba(255,129,83,0.6)",
        },
        {
          value: getRandom(),
          color: "rgba(255,234,136, 0.6)",
        },
      ];
      // pie chart options
      var pieOptions = {
        segmentShowStroke: false,
        animateScale: true,
      };
      // get pie chart canvas
      var point = document.getElementById("point").getContext("2d");
      // draw pie chart
      new Chart(point).Pie(pieData, pieOptions);
    },
    { once: true }
  );

  // chart info
  let pointList = ["연출", "연기", "스토리", "영상미"];
  let colorList = [
    "rgba(172,194,132,0.6)",
    "rgba(74,202,180,0.6)",
    "rgba(255,129,83,0.6)",
    "rgba(255,234,136, 0.6)",
  ];
  const listcontainer = document.createElement("div");
  listcontainer.classList.add("listcontainer");

  for (let i = 0; i < 4; i++) {
    const listcontain = document.createElement("div");
    listcontain.classList.add("listcontain");

    const color = document.createElement("div");
    color.classList.add("color");
    color.style.width = "10px";
    color.style.height = "10px";
    color.style.backgroundColor = colorList[i];

    const point = document.createElement("p");
    point.innerText = pointList[i];
    point.classList.add("point");
    listcontain.append(color, point);
    listcontainer.append(listcontain);
  }

  const monthBuy = document.createElement("p");
  monthBuy.classList.add("monthBuy");
  monthBuy.innerText = "월별 영화구매수";

  const viewPoint = document.createElement("p");
  viewPoint.classList.add("viewPoint");
  viewPoint.innerText = "감상포인트";

  page.append(listcontainer, monthBuy, viewPoint);
  return page;
};

export default moviePage;
