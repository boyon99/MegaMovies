const page = document.createElement("div");
page.className = "bank";

const inner = document.createElement("div");
inner.className = "inner";

const content = document.createElement("div");
content.className = "content";
content.textContent = "계좌 페이지";

inner.appendChild(content);

page.appendChild(inner);

export default page;
