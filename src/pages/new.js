import { readItem } from '../api/movieRequest'

const newPage = document.createElement('div')
export default newPage
  ; (async () => {
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
    priceImgEl.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADlElEQVR4nO1YSWgUURBtFVH0IK7gdhA9iAtePCoeNCCaqZpBBiHqNQcFEQRXJCdBEaNTNSZEFAUPEj2IiAqCGBA8iBfBEEVc8KC44Aom8/+YL92j8Xd1D/07TnChH/xLd9erevWrqn+352XIkCFDhgwWFPAzjWysddJLCVO8MEYhvbV5+vOl+Wl5FNJZEcvTRCONfDpkBPQoteN8eYVwbBTwtrQ8GvlpOBY+lWhUzdFm6dwAz0rlGPhwjIBraThMoTRHclShtMnBsH1mxBBpYyoByH0RAUj9prlrgitHFbklksj1nbNdA3goyqjD1XF/rrxAOh5aeW525dFIncK+z9XW8wMWxr2utgppZ10BSJ3uArhX1P8JZwFV4KLY/kFT6JjhJADolqj9oammgF64cJjmrmm+z3D9c9FZgMnzVAX8TWRwQ6Jd8egUhaytjD/WSGWbp4K8NIlHAxciCSyWpjsLCEiQ7os+oCQbf0qI7J+LXMvx3mTf3C5K736q4AMSoGNpSRRQt5xefuYUUNVKxO1k33xP7H67c+AKeXewRDB+SSmkfUP349cn0XgHa1z8xuqDqr8LdTmA9oTLMLDp/nk/OfN1J8jfsbxMAP7lO2BD57hJ1GLVFLsmhR7yPK9SOL5ENPxd+YxGLonRuFI+Y9aWxingryGuHDd5w4V/dlHIA2HC8lr5nN+UouH3RwQArRFj+VDSKVYBV0zTkYnDFlBzzD1yssQEd8d+ppIrL44ko7VrrAL+YO3Sg4gApH3CV89vBR+QArWJzIXmeGTOIz2uy4V8webqz9E8IeC6KNm21AH/6SbV2RjFf3yMaqBDcsXU5uvgOtAV0R934uxDXMDXBNfVH9dDPxMCnzH2qXsiaC7g5WFy/mw8M0rOdo3ldUlcA1BaFPe1p4GeiBG63GsUfvwmeW87MHhirn3kVkBfzKoz4134at8JQ1y9wfvG+v5QQB99n14joYAvyaOycNrtyqWRjlulMujvnCifyw0NviaAtosyuhkWxC3uAsqrZcA6zL2j4QLkecf+ZlVAyqzvmOzKVXsr00fL3noRsqkUaFnDBfhNq5BexY02hXQjLZ/8YNK/xLwzbW2jGy4gcIp0Pt5p+t+GVSxviU8GX/RGCirPrTHZH/QnUlqu6B8M/sm3dWSir/fXDfjecPk00G3JN9BMC72RhAJ6LjJ2YNhcSLtEKb70e62xEWfIkCFDhv8Z3wEKTv/wCrKPBQAAAABJRU5ErkJggg==`
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
