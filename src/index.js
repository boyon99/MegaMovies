import Navigo from 'navigo';
import home from './pages/home';
import rankingPage from './pages/ranking';
import genrePage from './pages/genre';
import newPage from './pages/new';

const app = document.querySelector('#app');

const router = new Navigo('/');

router.on({
  '/': () => {
    renderPage(home)
  },
  '/ranking': () => {
    renderPage(rankingPage)
  },
  '/genre': () => {
    renderPage(genrePage)
  },
  '/new': () => {
    renderPage(newPage)  
  }
}).resolve()

function renderPage(page) {
  console.log(page)
  app.replaceChildren();
  app.append(page);
}

console.log(process.env.apikey)