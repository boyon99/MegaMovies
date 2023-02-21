import { readItem } from '../api/movieRequest'

const newPage = document.createElement('div')
export default newPage
;(async () => {
  const items = await readItem()
  renderItems(items)
})()

// random
function getRandomRate() {
  return (2 + Math.random() * 3).toFixed(1)
}

// render
function renderItems(items) {
  const liEls = items.filter((item) => item.tags.includes('신작'))

  const newItems = liEls.map((liEl) => {
    // console.log(liEl);
    //div
    const contentDivEl = document.createElement('div')
    contentDivEl.classList.add('content__new')

    // a
    const aEl = document.createElement('a')
    aEl.href = `/movie/${liEl.id}`
    aEl.setAttribute('data-navigo', `${liEl.id}`)

    // img
    const newImgEl = document.createElement('img')
    newImgEl.src = liEl.thumbnail

    // title
    const titleEl = document.createElement('p')
    titleEl.innerText = liEl.title
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
    descriptionEl.innerText = liEl.description + ' ...'
    descriptionEl.classList.add('description')

    // price
    const priceEl = document.createElement('p')
    let price = liEl.price / 1000
    priceEl.innerText = price + ',000'
    priceEl.classList.add('price')

    // price Img
    const priceImgEl = document.createElement('img')
    priceImgEl.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACwElEQVR4nO2ZS4sTQRDHg+ILUfSmqy548eon0FVBWDZJdXLIF1AQxNfNiA9y8iCi7lRFxdPKHv0Kwnpb9aCCV11Y8AMsrguaaqWl8trZbFanOz2dBKagL5NMze/f86+a7plcLossskg1zHS0ixVd0wrfsaI1rcgkHaxojQHfaBUVhwNfjo5qwE820HqrAXQ/LHxhdlIDLnmBV+1RosL4wqumpRbSh1dPj2mgr77hdUvA6tjC6/YYa3idlgBXzzNQgxXeNEATMlhRVY4FFTBIwbKiam8+ORZMwKC2MeXHhzflnKkfCiLAh+cN0MSmvPnnR1IX4KvPcz8LAd5KVYDPhxQ3i5iqwYo4VKvUaQgYBXjtKsDONvhFls+NMp40lVfbTf7ZQS5FU6zwJSvSwQWYBPBSeOb8w726iOfMpRc7tsqlITrLQCvB1kIm4cwbeLAvaU6t6jMM9MdJBOCid/j2OLPhXLGNogVW9J0BlxmwZmq1bZ3fGXDe6Q4AXbEo2ITwgJ/F6705GgovxmeaAe92BSg85SDgo6nUdv4ffmput802kEv1y+vCnxyI52KgG7HZ+9b933S039I6S7I9TTT7rQ148uS/SnQidu7rBkQX+oEy4O/ODDYnyQa+MDuZSxoa6L2NAFN5tCcmYFVsw4DXpSuJbXo8fEcKvve49gXfhrB69RG3jdjEpTh134LF5Z9FPG4F34LAH5YX63YgVnjbiwBwmPlOyAsou4vRXOdcaZViD7kT4vng8C5F3Abd8ByQkIIVzweF77wKlJ5rJ4JWNGA+1xNW7RI8wDs9yNZFSPeZZ6ifFvDmHVB4Lzh86OUzu3abURDBacKnLSIIfFoigsL7FjEUeF8ihgo/qIiRgHcVMVLwtiJGEn7DR7x/LjvwQ+Kd1FA/oxbxqlb0tvlZVPYTgIuyAU+0h80iiyxyg8RfIY4Gl/J3SzUAAAAASUVORK5CYII=`
    priceImgEl.classList.add('priceImg')

    // append El
    contentDivEl.append(aEl)
    aEl.append(
      newImgEl,
      titleEl,
      starEl,
      rateEl,
      descriptionEl,
      priceEl,
      priceImgEl
    )

    return contentDivEl
  })
  newPage.innerHTML = ''
  newPage.append(...newItems)
}
