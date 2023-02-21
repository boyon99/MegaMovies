const modalEventMap = new Map([]);

export const customModalEventType = {
  open: "customModalOpen",
  close: "customModalClose",
};

window.addEventListener(customModalEventType.open, handleModalOpen);
window.addEventListener(customModalEventType.close, handleModalClose);

export const CustomModalOpenEvent = ({
  title,
  content,
  submitBtnText,
  cancelBtnText,
  onSubmit,
  onCancel,
  onAfter,
}) => {
  const modalComponent = createBankModal({
    title,
    content,
    submitBtnText,
    cancelBtnText,
    onSubmit,
    onCancel,
    onAfter,
  });

  return new CustomEvent(customModalEventType.open, {
    detail: {
      modal: modalComponent,
      renderBankModal,
    },
  });
};

export const CustomModalCloseEvent = ({ onAfter = async () => {} } = {}) => {
  const renderedModal = document.querySelector(".bank-modal");
  return new CustomEvent(customModalEventType.close, {
    detail: {
      modal: renderedModal,
      unmountBankModal,
      onAfter,
    },
  });
};

export function createBankModal({
  title,
  content,
  submitBtnText = "확인",
  cancelBtnText = "취소",
  onSubmit,
  onCancel,
  onAfter = async () => {},
}) {
  const modalContainer = document.createElement("div");
  modalContainer.className = "bank-modal";
  const handleDimClick = (e) => {
    const targetParent = e.target.parentElement;
    if (targetParent.id === "app") {
      window.dispatchEvent(CustomModalCloseEvent());
    }
  };
  modalEventMap.set(
    { target: modalContainer, eventType: "click" },
    handleDimClick
  );

  const modalWrapper = document.createElement("div");
  modalWrapper.className = "bank-modal__wrapper";

  const header = document.createElement("div");
  header.className = "header";
  const titleElement = document.createElement("h3");
  titleElement.className = "title";
  titleElement.textContent = title;
  const closeBtn = document.createElement("button");
  closeBtn.classList.add("btn-outlined", "small", "btn-close");
  closeBtn.textContent = "X";
  const handleCloseBtnClick = () => {
    window.dispatchEvent(CustomModalCloseEvent());
  };
  modalEventMap.set(
    { target: closeBtn, eventType: "click" },
    handleCloseBtnClick
  );
  header.append(titleElement, closeBtn);

  const contentElement = document.createElement("div");
  contentElement.className = "content";
  contentElement.append(content);

  const control = document.createElement("div");
  control.className = "control";

  const submitBtn = document.createElement("button");
  submitBtn.classList.add("btn-primary", "medium", "btn--submit");
  submitBtn.textContent = submitBtnText;
  const handleSubmit = async (e) => {
    modalContainer.classList.add("bank-modal--loading");
    submitBtn.textContent = "...";
    await onSubmit(e)
      .then(async (res) => {
        await new Promise((resolve) => {
          modalContainer.classList.remove("bank-modal--loading");
          modalContainer.classList.add("bank-modal--success");
          submitBtn.textContent = "성공";
          setTimeout(() => {
            resolve("");
          }, 1000);
        });
        window.dispatchEvent(CustomModalCloseEvent({ onAfter }));
      })
      .catch((error) => {
        modalContainer.classList.remove("bank-modal--loading");
        submitBtn.textContent = submitBtnText;
      });
  };
  modalEventMap.set({ target: submitBtn, eventType: "click" }, handleSubmit);

  const cancelBtn = document.createElement("button");
  cancelBtn.classList.add("btn-secondary", "medium", "btn--cancel");
  cancelBtn.textContent = cancelBtnText;
  const handleCancel = async (e) => {
    await onCancel(e);
    window.dispatchEvent(CustomModalCloseEvent());
  };
  modalEventMap.set({ target: cancelBtn, eventType: "click" }, handleCancel);
  control.append(submitBtn, cancelBtn);

  modalWrapper.append(header, contentElement, control);
  modalContainer.appendChild(modalWrapper);

  return modalContainer;
}

function renderBankModal(container, bankModal) {
  registerModalControlEvents();
  container.append(bankModal);
}

function unmountBankModal(container, bankModal) {
  removeModalControlEvents();
  container.removeChild(bankModal);
}

function registerModalControlEvents() {
  Array.from(modalEventMap.entries()).forEach(
    ([{ target, eventType }, eventCallback]) => {
      target.addEventListener(eventType, eventCallback);
    }
  );
}

function removeModalControlEvents() {
  Array.from(modalEventMap.entries()).forEach(
    ([{ target, eventType }, eventCallback]) => {
      target.removeEventListener(eventType, eventCallback);
    }
  );
  modalEventMap.clear();
}

function handleModalOpen(e) {
  const { modal, renderBankModal } = e?.detail;
  const app = document.querySelector("#app");

  renderBankModal(app, modal);
}

function handleModalClose(e) {
  const { modal, unmountBankModal, onAfter } = e?.detail;
  const app = document.querySelector("#app");

  unmountBankModal(app, modal);

  onAfter();
}
