import { readItem } from '../api/movieRequest'

const homeFragment = document.createDocumentFragment()
export default homeFragment
;(async () => {
  const items = await readItem()
  renderItems(items)
})()

const homeRankingSlider = document.createElement('section')
homeRankingSlider.className = 'movie-slider'
homeRankingSlider.innerHTML = /* html */ `
    <div class="inner">
      <div class="swiper">
        <div class="swiper-wrapper">
          <a href="" class="swiper-slide"></a>
          <a href="" class="swiper-slide"></a>
          <a href="" class="swiper-slide"></a>
          <a href="" class="swiper-slide"></a>
          <a href="" class="swiper-slide"></a>
          <a href="" class="swiper-slide"></a>
          <a href="" class="swiper-slide"></a>
          <a href="" class="swiper-slide"></a>
          <a href="" class="swiper-slide"></a>
          <a href="" class="swiper-slide"></a>
        </div>

        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    </div>
`

const homeGenre = document.createElement('section')
homeGenre.className = 'genre'
homeGenre.innerHTML = /* html */ `
  <div class="inner">
    <header class="genre-header">
      <h2>장르/테마 영화 추천</h2>
      <a href="">더보기</a>
    </header>

    <div class="genre-content">
      <ul class="genre-list"></ul>
    </div>
  </div>
`

const homeNew = document.createElement('section')
homeNew.className = 'new'
homeNew.innerHTML = /* html */ `
  <div class="inner">
    <header class="new-header">
      <h2>신작</h2>
      <a href="">더보기</a>
    </header>

    <div class="new-content">
      <ul class="new-list"></ul>
    </div>
  </div>
`

homeFragment.append(homeRankingSlider)
homeFragment.append(homeGenre)
homeFragment.append(homeNew)

function renderItems(items) {
  // DOM 탐색
  const swiperWrapper = document.querySelector('.swiper-wrapper')
  const genreList = document.querySelector('.genre-list')
  const newList = document.querySelector('.new-list')

  // 태그별로 필터링
  const filterNewItems = items.filter((item) => item.tags.includes('신작'))

  const rankingItems = items
    .map((item, index) => {
      return /* html */ `
      <a class="swiper-slide" href="">
        <img src="${item.thumbnail}" />
        <strong>${index}</strong>
      </a>
    `
    })
    .join('')

  const genreItems = items
    .map((item, index) => {
      index++
      if (index > 4) return
      return /* html */ `
    <li class="genre-item">
      <a class="genre-image" href="">
        <img src=${item.thumbnail} alt="" />
      </a>
    </li>
  `
    })
    .join('')

  const newItems = filterNewItems
    .map((item, index) => {
      index++
      if (index > 4) return
      return /* html */ `
        <li class="new-item">
          <a href="" class="new-image">
            <img src=${item.thumbnail} alt="" />
          </a>
        </li>
      `
    })
    .join('')

  swiperWrapper.innerHTML = rankingItems
  genreList.innerHTML = genreItems
  newList.innerHTML = newItems
}
