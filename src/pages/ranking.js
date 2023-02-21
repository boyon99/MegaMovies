import { readItem } from '../api/movieRequest'
import trailerList from '../movieInfoList/trailerList'

const rankingContainer = document.createElement('div')
export default rankingContainer
;(async () => {
  const items = await readItem()
  renderItems(items)
})()

const rankingImages = document.createElement('section')
rankingImages.className = 'ranking-images'
rankingImages.innerHTML = /* html */ `
  <div class="inner">
    <ol class="images-list"></ol>
  </div>
    `

const rankingVideos = document.createElement('section')
rankingVideos.className = 'ranking-videos'
rankingVideos.innerHTML = /* html */ `
  <div class="inner">
    <ol class="videos-list"></ol>
  </div>
  `

rankingContainer.append(rankingImages)
rankingContainer.append(rankingVideos)

function renderItems(items) {
  const images = rankingImages.querySelector('.images-list')
  const videos = rankingVideos.querySelector('.videos-list')

  const imagesItems = items
    .map((item, index) => {
      index++
      if (index > 10) return
      return /* html */ `
      <li class="images-item">
        <a href="/movie/${item.id}" data-navigo>
          <img src=${item.thumbnail} />
          <strong>${index}</strong>
        </a>
      </li>
      `
    })
    .join('')

  const videosItems = items
    .map((item, index) => {
      index++
      if (index > 10) return
      return /* html */ `
        <li class="videos-item">
          <video src=${trailerList.get(item.title)} poster=${
        item.thumbnail
      } controls></video>
        </li>
        `
    })
    .join('')

  images.innerHTML = imagesItems
  videos.innerHTML = videosItems
}
