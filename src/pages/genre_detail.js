import { getGenreMovies } from "./genre";
import { readItem } from '../api/movieRequest'

// random star
function getRandomRate() {
  return (2 + Math.random() * 3).toFixed(1);
}

export const genreDetailPage = (category) => {
  const page = document.createElement('div');
  page.classList.add('search-page')

  const name = document.createElement('div')
  name.classList.add('name')

  const inner = document.createElement('div')
  inner.classList.add('inner')

  let movieTitle = "" + category
    // movie content
    ; (async () => {
      const items = await readItem()
      const item = items.filter(i => {
        let tags = i.tags
        return tags.includes(movieTitle)
      })

      name.innerText = `${category} (${item.length})`

      item.map((i, a, b) => {
        // a
        const aEl = document.createElement('a')
        aEl.href = `/movie/${i.id}`
        aEl.setAttribute('data-navigo', `${i.id}`)

        // img
        const newImgEl = document.createElement('img')
        newImgEl.src = i.thumbnail
        newImgEl.classList.add('poster')

        // title
        const titleEl = document.createElement('p')
        titleEl.innerText = i.title
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
        descriptionEl.innerText = i.description + " ..."
        descriptionEl.classList.add('description')

        // tags
        const tagsEl = document.createElement('div')
        tagsEl.classList.add('tags')
        const tags = i.tags.map(i => {
          const tag = document.createElement('p')
          tag.innerText = i
          tag.classList.add('tag')
          tagsEl.append(tag)
        })

        inner.append(aEl)
        aEl.append(newImgEl, titleEl, starEl, rateEl, descriptionEl, tagsEl)
      })
    })()

  page.append(name, inner)
  return page
}
