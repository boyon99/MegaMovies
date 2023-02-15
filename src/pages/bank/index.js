import BankAPI from "../../api/bank.js";

const bankAPI = new BankAPI();

// base page
const page = document.createElement("div");
page.className = "bank";
const inner = document.createElement("div");
inner.className = "inner";
const content = document.createElement("div");
content.className = "bank-content";

// info
const info = document.createElement("div");
info.className = "content__info";
const title = document.createElement("h3");
title.className = "title";
title.textContent = "나의 계좌";
const control = document.createElement("div");

info.append(title);

// form

content.append(info);

inner.appendChild(content);
page.appendChild(inner);

export default page;
