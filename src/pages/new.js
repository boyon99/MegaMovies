import {readItem} from '../api/request'

const newPage = document.createElement('div');
export default newPage;


;(async ()=>{
  const items = await readItem()
  renderItems(items)
})()

// render
function renderItems(items){
  const liEls = items.filter(item =>item.tags.includes('신작'))

  const newItems = liEls.map(liEl =>{
    console.log(liEl);
    //div
    const contentDivEl = document.createElement('div')
    contentDivEl.classList.add('content__new')

    // img
    const newImgEl = document.createElement('img')
    newImgEl.src = liEl.thumbnail

    contentDivEl.append(newImgEl)

    return contentDivEl
  })
  newPage.innerHTML = ''
  newPage.append(...newItems)
}

