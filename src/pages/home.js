import { readItem } from '../api/movieRequest'
import posterMap from '../movieInfoList/posterList'

const homeContainer = document.createElement('div')
export default homeContainer
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
          <div class="swiper-slide"></div>
          <div class="swiper-slide"></div>
          <div class="swiper-slide"></div>
          <div class="swiper-slide"></div>
          <div class="swiper-slide"></div>
          <div class="swiper-slide"></div>
          <div class="swiper-slide"></div>
          <div class="swiper-slide"></div>
          <div class="swiper-slide"></div>
          <div class="swiper-slide"></div>
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
      <a href="/genre">더보기</a>
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
      <a href="/new">더보기</a>
    </header>

    <div class="new-content">
      <ul class="new-list"></ul>
    </div>
  </div>
`

homeContainer.append(homeRankingSlider)
homeContainer.append(homeGenre)
homeContainer.append(homeNew)

function renderItems(items) {
  // DOM 탐색
  const swiperWrapper = homeRankingSlider.querySelector('.swiper-wrapper')
  const genreList = homeGenre.querySelector('.genre-list')
  const newList = homeNew.querySelector('.new-list')

  // 태그별로 필터링
  const filterNewItems = items.filter((item) => item.tags.includes('신작'))

  const rankingItems = items
    .map((item, index) => {
      index++
      const setIndex = index > 4 ? index -= 1 : index
      if (index > 10) return
      if (item.title === '변호사') return
      return /* html */ `
      <a class="swiper-slide" href="/movie/${item.id}" data-navigo>
        <div class="image-wrapper"><img src=${posterMap.get(item.title)} /></div>
        <strong class="rank">${index}</strong>
        <strong class="title">${item.title}</strong>
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
      <a class="genre-image" href="/movie/${item.id}" data-navigo>
        <img src=${item.thumbnail} alt="${item.title}" />
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
          <a class="new-image" href="/movie/${item.id}" data-navigo>
            <img src=${item.thumbnail} alt="${item.title}" />
          </a>
        </li>
      `
    })
    .join('')

  swiperWrapper.innerHTML = rankingItems
  genreList.innerHTML = genreItems
  newList.innerHTML = newItems

  const titles = swiperWrapper.querySelectorAll('.title')
    titles.forEach((title, index) => {
      if (index === 9) {
        title.style.left = '160px'
      }
    })
}