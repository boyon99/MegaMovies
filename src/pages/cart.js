import { AppStorage } from '../util'


const cartPage = document.createElement('div')
export default cartPage

let inner = document.createElement('div')

inner.classList.add('inner')
inner.innerHTML = ``

let items = AppStorage.getCartItem()
let itemsFilter = items.filter((i,a,b)=> b.includes(i))

itemsFilter.map((i,a,b)=>{
  let itemboxEl = document.createElement('div')
  itemboxEl.classList.add('itembox')

  let index = items.indexOf(i)
  // console.log(index)

  let checkboxEl = document.createElement('input')
  checkboxEl.type = 'checkbox'
  checkboxEl.classList.add('checkbox')
  checkboxEl.id = `${index}`

  // labelEl = document.createElement('label')
  // labelEl.htmlFor = `${i[0]}`
  // labelEl.classList.add('label')

  let imgEl = document.createElement('img')
  imgEl.src = i[3]

  let titleEl = document.createElement('p')
  titleEl.classList.add('title')
  titleEl.innerText = `${i[1]}`

  let priceEl = document.createElement('p')
  priceEl.classList.add('price')
  priceEl.innerText = `${i[2]}`

  const priceImgEl = document.createElement('img')
    priceImgEl.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACwElEQVR4nO2ZS4sTQRDHg+ILUfSmqy548eon0FVBWDZJdXLIF1AQxNfNiA9y8iCi7lRFxdPKHv0Kwnpb9aCCV11Y8AMsrguaaqWl8trZbFanOz2dBKagL5NMze/f86+a7plcLossskg1zHS0ixVd0wrfsaI1rcgkHaxojQHfaBUVhwNfjo5qwE820HqrAXQ/LHxhdlIDLnmBV+1RosL4wqumpRbSh1dPj2mgr77hdUvA6tjC6/YYa3idlgBXzzNQgxXeNEATMlhRVY4FFTBIwbKiam8+ORZMwKC2MeXHhzflnKkfCiLAh+cN0MSmvPnnR1IX4KvPcz8LAd5KVYDPhxQ3i5iqwYo4VKvUaQgYBXjtKsDONvhFls+NMp40lVfbTf7ZQS5FU6zwJSvSwQWYBPBSeOb8w726iOfMpRc7tsqlITrLQCvB1kIm4cwbeLAvaU6t6jMM9MdJBOCid/j2OLPhXLGNogVW9J0BlxmwZmq1bZ3fGXDe6Q4AXbEo2ITwgJ/F6705GgovxmeaAe92BSg85SDgo6nUdv4ffmput802kEv1y+vCnxyI52KgG7HZ+9b933S039I6S7I9TTT7rQ148uS/SnQidu7rBkQX+oEy4O/ODDYnyQa+MDuZSxoa6L2NAFN5tCcmYFVsw4DXpSuJbXo8fEcKvve49gXfhrB69RG3jdjEpTh134LF5Z9FPG4F34LAH5YX63YgVnjbiwBwmPlOyAsou4vRXOdcaZViD7kT4vng8C5F3Abd8ByQkIIVzweF77wKlJ5rJ4JWNGA+1xNW7RI8wDs9yNZFSPeZZ6ifFvDmHVB4Lzh86OUzu3abURDBacKnLSIIfFoigsL7FjEUeF8ihgo/qIiRgHcVMVLwtiJGEn7DR7x/LjvwQ+Kd1FA/oxbxqlb0tvlZVPYTgIuyAU+0h80iiyxyg8RfIY4Gl/J3SzUAAAAASUVORK5CYII=`
    priceImgEl.classList.add('priceImg')


  itemboxEl.appendChild(checkboxEl)
  itemboxEl.appendChild(imgEl)
  itemboxEl.appendChild(titleEl)
  itemboxEl.appendChild(priceEl)
  itemboxEl.appendChild(priceImgEl)
  inner.appendChild(itemboxEl)
})
console.log(itemsFilter)

cartPage.appendChild(inner)