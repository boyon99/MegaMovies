import { AppStorage } from '../util'

// cartpage
const cartPage = document.createElement('div')
export default cartPage

// inner div
let inner = document.createElement('div')
inner.classList.add('inner')
inner.innerHTML = ``

// item 
let items = AppStorage.getCartItem()
let itemsFilter = items.filter((i, a, b) => b.includes(i))

// checkbox
let checkItem = {}

// item div
itemsFilter.map((i, a, b) => {
  let itemboxEl = document.createElement('div')
  itemboxEl.classList.add('itembox')

  let index = items.indexOf(i)

  let checkboxEl = document.createElement('input')
  checkboxEl.type = 'checkbox'
  checkboxEl.classList.add('checkbox')
  checkboxEl.id = `${index}`

  let imgEl = document.createElement('img')
  imgEl.src = i[3]

  let titleEl = document.createElement('p')
  titleEl.classList.add('title')
  titleEl.innerText = `${i[1]}`

  let priceBoxEl = document.createElement('div')
  priceBoxEl.classList.add('pricebox')
  let priceEl = document.createElement('p')
  priceEl.classList.add('price')
  priceEl.innerText = `${i[2]}`

  const priceImgEl = document.createElement('img')
  priceImgEl.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACwElEQVR4nO2ZS4sTQRDHg+ILUfSmqy548eon0FVBWDZJdXLIF1AQxNfNiA9y8iCi7lRFxdPKHv0Kwnpb9aCCV11Y8AMsrguaaqWl8trZbFanOz2dBKagL5NMze/f86+a7plcLossskg1zHS0ixVd0wrfsaI1rcgkHaxojQHfaBUVhwNfjo5qwE820HqrAXQ/LHxhdlIDLnmBV+1RosL4wqumpRbSh1dPj2mgr77hdUvA6tjC6/YYa3idlgBXzzNQgxXeNEATMlhRVY4FFTBIwbKiam8+ORZMwKC2MeXHhzflnKkfCiLAh+cN0MSmvPnnR1IX4KvPcz8LAd5KVYDPhxQ3i5iqwYo4VKvUaQgYBXjtKsDONvhFls+NMp40lVfbTf7ZQS5FU6zwJSvSwQWYBPBSeOb8w726iOfMpRc7tsqlITrLQCvB1kIm4cwbeLAvaU6t6jMM9MdJBOCid/j2OLPhXLGNogVW9J0BlxmwZmq1bZ3fGXDe6Q4AXbEo2ITwgJ/F6705GgovxmeaAe92BSg85SDgo6nUdv4ffmput802kEv1y+vCnxyI52KgG7HZ+9b933S039I6S7I9TTT7rQ148uS/SnQidu7rBkQX+oEy4O/ODDYnyQa+MDuZSxoa6L2NAFN5tCcmYFVsw4DXpSuJbXo8fEcKvve49gXfhrB69RG3jdjEpTh134LF5Z9FPG4F34LAH5YX63YgVnjbiwBwmPlOyAsou4vRXOdcaZViD7kT4vng8C5F3Abd8ByQkIIVzweF77wKlJ5rJ4JWNGA+1xNW7RI8wDs9yNZFSPeZZ6ifFvDmHVB4Lzh86OUzu3abURDBacKnLSIIfFoigsL7FjEUeF8ihgo/qIiRgHcVMVLwtiJGEn7DR7x/LjvwQ+Kd1FA/oxbxqlb0tvlZVPYTgIuyAU+0h80iiyxyg8RfIY4Gl/J3SzUAAAAASUVORK5CYII=`
  priceImgEl.classList.add('priceImg')

  priceBoxEl.append(priceEl, priceImgEl)
  itemboxEl.append(checkboxEl, imgEl, titleEl, priceBoxEl)
  inner.appendChild(itemboxEl)
})

// top div
let top = document.createElement('div')
top.classList.add('top')


// all select
let allselectEl = document.createElement('p')
allselectEl.innerText = `총 ${itemsFilter.length}개`


// select btn
let allselectBtn = document.createElement('button')
allselectBtn.classList.add('select', 'btn-outlined', 'small')
allselectBtn.innerHTML = `전체 선택`


// delete btn
let deleteBtn = document.createElement('button')
deleteBtn.classList.add('delete', 'btn-outlined', 'small')
deleteBtn.innerHTML = `선택 삭제`


// bottom div
let bottom = document.createElement('div')
bottom.classList.add('bottom')

// all price
let allPriceEl = document.createElement('p')
allPriceEl.classList.add('allprice')
let allPriceText = document.createElement('p')
allPriceText.classList.add('allPriceText')
let sum = 0
allPriceText.innerText = "총 결제 금액"
allPriceEl.innerText = `${sum}` + "원"


// checkbox event
for (let i = 0; i < inner.children.length; i++) {
  inner.children[i].children[0].addEventListener('change', (e) => {
    if (e.target.checked) {
      sum += +items[inner.children[i].children[0].id][2]
      allPriceEl.innerText = `${sum}` + "원"
    } else {
      sum -= +items[inner.children[i].children[0].id][2]
      allPriceEl.innerText = `${sum}` + "원"
    }
  })
}



// buy btn
buyBtn = document.createElement('button')
buyBtn.classList.add('buy', 'btn-secondary', 'small')
buyBtn.innerHTML = `총 주문하기`


console.log(itemsFilter)



top.append(allselectEl, allselectBtn, deleteBtn)
bottom.append(allPriceText, allPriceEl, buyBtn)
inner.append(top, bottom)
cartPage.append(inner)