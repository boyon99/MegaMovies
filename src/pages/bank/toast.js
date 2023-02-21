/**
 * @typedef {object} ToastOptions
 * @property {HTMLElement} container - toast를 삽입할 부모요소(기본값: `body`)
 * @property {string} message - toast에 출력할 텍스트(없을 경우 렌더링되지 않음)
 * @property {"info" | "error" | "success"} type - toast 타입(테마)
 * @property {number} [autoUnmount] - ms 단위 시간 이후 unmount
 */

/**
 * toast 요소(element)를 렌더링하는 함수
 * @param {ToastOptions} param - { `container` , `message`, `type` }
 */
export const renderToast = ({
  container = document.body,
  message,
  type = "info",
  autoUnmount,
} = {}) => {
  if (!message) return;
  if (!(type === "error" || type === "success" || type === "info")) return;

  const toast = document.createElement("div");
  toast.className = "app__toast";
  switch (type) {
    case "error":
      toast.classList.add("toast--error");
      break;
    case "success":
      toast.classList.add("toast--success");
      break;
    case "info":
      break;
  }

  const content = document.createElement("div");
  content.className = "content";
  content.textContent = message;

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("btn-primary", "small");
  closeBtn.textContent = "닫기";
  closeBtn.addEventListener(
    "click",
    handleToastClick({ container, target: toast })
  );

  content.append(closeBtn);

  toast.append(content);

  container.append(toast);

  if (autoUnmount) {
    toast.classList.add("timeout");

    // set afterStyle
    const styleSheet = document.styleSheets[1];
    const afterRule = Array.from(styleSheet.cssRules).find(
      (rule) =>
        rule.selectorText ===
        ".app__toast.timeout .content::after, .app__toast.toast--success.timeout .content::after, .app__toast.toast--error.timeout .content::after"
    );
    afterRule.style.setProperty(
      "animation",
      `timer ${autoUnmount}ms linear forwards`
    );

    setTimeout(() => {
      unmountToast({ container, target: toast });
    }, autoUnmount);
  }
};

function unmountToast({ container = document.body, target }) {
  target = target ?? document.querySelector("app__toast");

  target?.removeEventListener("click", handleToastClick);
  const removeTargetToast = Array.from(container.children).find(
    (toast) => target === toast
  );
  if (!removeTargetToast) return;
  container?.removeChild(target);
}

function handleToastClick({ container, target }) {
  return (e) => {
    unmountToast({ container, target });
  };
}
