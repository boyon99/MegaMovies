import { readItem } from '../api/movieRequest'
import trailerList from '../movieInfoList/trailerList'
import posterList from '../movieInfoList/posterList'

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
      const setIndex = index > 4 ? index -= 1 : index
      if (index > 10) return
      if (item.title === '변호사') return
      return /* html */ `
      <li class="images-item">
        <a href="/movie/${item.id}" data-navigo>
          <img src=${item.thumbnail} />
          <strong>${setIndex}</strong>
        </a>
      </li>
      `
    })
    .join('')

  const videosItems = items
    .map((item, index) => {
      index++
      if (item.title === '변호사') return
      if (index > 11) return
      return /* html */ `
        <li class="videos-item">
          <div>${item.title} 예고편</div>
          <video src=${trailerList.get(item.title)} poster=${
        posterList.get(item.title)
      } controls></video>
        </li>
        `
    })
    .join('')

  images.innerHTML = imagesItems
  videos.innerHTML = videosItems
}