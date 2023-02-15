import { readItem } from '../api/movieRequest'
import trailerList from '../trailer/trailerList'

console.log(trailerList)

const rankingFragment = document.createDocumentFragment()
export default rankingFragment
;(async () => {
  const items = await readItem()
  renderItems(items)
})()

const rankingImages = document.createElement('section')
rankingImages.className = 'ranking-images'
rankingImages.innerHTML = /* html */ `
  <div class="inner">
    <ol class="images-list">
    </ol>
  </div>
`

const rankingVideos = document.createElement('section')
rankingVideos.className = 'ranking-videos'
rankingVideos.innerHTML = /* html */ `
  <div class="inner">
    <ol class="videos-list"></ol>
  </div>
`

rankingFragment.append(rankingImages)
rankingFragment.append(rankingVideos)

function renderItems(items) {
  const imagesList = document.querySelector('.images-list')
  const videosList = document.querySelector('.videos-list')

  const imagesItems = items
    .map((item, index) => {
      index++
      if (index > 10) return
      return /* html */ `
      <li class="images-item">
        <a href="">
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
      console.log(item)
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

  imagesList.innerHTML = imagesItems
  videosList.innerHTML = videosItems
}
