# 영화구매사이트 MegaMovies

## 저희 TEAM을 소개합니다.

|                                              오대성                                              |                                                이어진                                                 |                                         이혜원                                          |                                       표승연                                       |                                   황혜빈                                    |
| :----------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------: | :-------------------------------------------------------------------------: |
|           <img src="https://avatars.githubusercontent.com/u/110394773?v=4" width=110>            |              <img src="https://avatars.githubusercontent.com/u/64579380?v=4" width=110>               |       <img src="https://avatars.githubusercontent.com/u/117172983?v=4" width=110>       |     <img src="https://avatars.githubusercontent.com/u/92071025?v=4" width=110>     | <img src="https://avatars.githubusercontent.com/u/106896098?v=4" width=110> |
|                         [@Ryan-TheLion](https://github.com/Ryan-TheLion)                         |                                [@boyon99](https://github.com/boyon99)                                 |                      [@Hana-Korea](https://github.com/Hana-Korea)                       |                         [@pyozz](https://github.com/pyozz)                         |                    [@Myugaa](https://github.com/Myugaa)                     |
| [메인 페이지]</br>- Header</br>[계좌 관리 페이지]</br>[결제 페이지]</br><hr/>router 작업 및 관리 | [검색 페이지]</br>[신작 페이지]</br>[영화상세 페이지]</br>[장바구니 페이지]<br/><hr/>전체 디자인 작업 | [회원가입 페이지]</br>[로그인 페이지]</br>[장르/테마 페이지]</br>[장르/테마 상세페이지] | [홈페이지]</br>[랭킹 페이지]</br>[구매내역 페이지]</br>[단일제품 상세 거래 페이지] |             [사용자 정보 수정 페이지]</br>[404 오류 및 footer]              |

<br/>

## MegaMovies 프로젝트를 소개합니다.

<img src="./static/megamovie.jpg" width="500px">
바닐라 자바스크립트를 Navigo router를 이용하여 SPA처럼 동작하도록 구현한 영화 구매 사이트입니다.

<br/>

### 상세 정보

- 작업기간 : 2023.01.30 - 2023.03.03 (5주)
- [배포페이지](https://mega-movies-boyon99.netlify.app/)
- 테스트 계정
  - **아이디** - user@gmail.com
  - **패스워드** - user1234

### 기술 스택

- 언어 `javascript` `scss` `html`
- 라이브러리 `swiper` `navigo` `chart.js`
- 번들러 `parcel`
- 배포 `netlify`
- 코드 포멧터 `prettier` `eslint`

### 페이지 구성

<img src="./static/페이지 구성.jpg" width="500px">

### local에서 실행 방법

```shell
1. git clone https://github.com/boyon99/MegaMovies.git
2. cd MegaMovies
3. .env 파일 생성 후, api key(API_KEY) 입력
4. npm i && npm run dev
```

### 프로젝트 구조

```
KDT4-M4_TEAM1
├─ README.md
├─ index.html
├─ package-lock.json
├─ package.json
├─ src
│  ├─ api
│  ├─ index.js
│  ├─ movieInfoList
│  ├─ pages
│  │  ├─ bank
│  │  ├─ cart.js
│  │  ├─ footer.js
│  │  ├─ genre.js
│  │  ├─ genre_detail.js
│  │  ├─ header
│  │  ├─ home.js
│  │  ├─ login.js
│  │  ├─ movie.js
│  │  ├─ new.js
│  │  ├─ not_found.js
│  │  ├─ order
│  │  ├─ order-details.js
│  │  ├─ order-history.js
│  │  ├─ ranking.js
│  │  ├─ search.js
│  │  ├─ sign_up.js
│  │  └─ user-info.js
│  ├─ styles
│  │  ├─ constants
│  │  ├─ modules
│  │  └─ pages
│  └─ util.js
└─ 페이지 구성.jpg
```
