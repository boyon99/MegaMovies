import BankAPI from "../../../api/bank";
import { AppStorage } from "../../../util";
import { bankLogoImgMap } from "../bankLogoMap";
import { CustomModalOpenEvent } from "../bankModal";
import { render } from "..";
import { renderToast } from "../toast";

const bankAPI = new BankAPI();
const availableBankInfoMap = new Map();
const connectAccountModalEventMap = new Map();

export const connectAccountForm = ({ useAbleBankList }) => {
  if (connectAccountModalEventMap.size > 0) {
    removeEvents();
  }
  availableBankInfoMap.clear();

  const wrapper = document.createElement("div");
  wrapper.className = "bank-modal__form--connect-account";

  const form = document.createElement("form");
  form.className = "connect-account-form";

  const bankSelectBox = document.createElement("div");
  bankSelectBox.className = "select-bank-box";

  const bankList = document.createElement("div");
  bankList.className = "bank-list";

  const bankItems = Array.from(useAbleBankList).map((bankInfo) => {
    const { name, code, digits } = bankInfo;

    availableBankInfoMap.set(name, {
      code,
      digits,
    });

    const bankRadioWrapper = document.createElement("div");
    bankRadioWrapper.className = "bank-input-wrapper";

    const bankRadio = document.createElement("input");
    bankRadio.type = "radio";
    bankRadio.name = "bank";
    bankRadio.value = name;
    bankRadio.id = code;
    const bankRadioLabel = document.createElement("label");
    bankRadioLabel.className = "bank-item";
    bankRadioLabel.setAttribute("for", code);
    const imgWrapper = document.createElement("div");
    imgWrapper.className = "bank-logo";
    imgWrapper.appendChild(bankLogoImgMap.get(name).cloneNode(true));

    bankRadioLabel.append(imgWrapper);
    bankRadioWrapper.append(bankRadio, bankRadioLabel);

    return bankRadioWrapper;
  });
  bankList.append(...bankItems);

  const bankTemplate = document.createElement("div");
  bankTemplate.className = "bank-template";

  const templateLogoWrapper = document.createElement("div");
  templateLogoWrapper.className = "bank-logo";

  bankTemplate.append(templateLogoWrapper);

  const handleBankListClick = (e) => {
    const {
      bank: { value },
    } = form.elements;
    if (!value) return;
    if (e.target.closest(".account-input-wrapper")) return;
    if (e.target.closest(".account-input-phone")) return;

    const { code, digits } = availableBankInfoMap.get(value);
    const digitInputForm = createAccountNumberInput({ digits });

    templateLogoWrapper.replaceChildren(
      bankLogoImgMap.get(value).cloneNode(true)
    );

    const accountInputTitle = document.createElement("div");
    accountInputTitle.className = "account-input-title";
    accountInputTitle.textContent = "계좌 번호 (account)";

    const accountPhoneNumberTitle = document.createElement("div");
    accountPhoneNumberTitle.className = "account-input-title";
    accountPhoneNumberTitle.textContent = "전화번호 (phone number)";

    const phoneNumberInput = createPhoneNumberInput();

    bankTemplate.replaceChildren(
      templateLogoWrapper,
      accountInputTitle,
      digitInputForm,
      accountPhoneNumberTitle,
      phoneNumberInput
    );
  };
  connectAccountModalEventMap.set(
    { target: form, eventType: "change" },
    handleBankListClick
  );
  bankSelectBox.appendChild(bankList);

  form.append(bankSelectBox, bankTemplate);

  wrapper.appendChild(form);

  registerEvents();

  return wrapper;
};

export const openConnectAccountModal = ({ useAbleBankList }, callback = {}) => {
  async function onSubmit() {
    const submitForm = document.querySelector("form.connect-account-form");
    const toastContainer = document.querySelector(".bank-modal__wrapper");

    const digitInputElements = document.querySelectorAll(
      ".bank-template input:not(.account-input-phone)"
    );
    const phoneInputElement = document.querySelector(".account-input-phone");
    const phoneRegExp = /010\d{4}\d{4}/;

    if (digitInputElements.length === 0) {
      renderToast({
        container: toastContainer,
        message: "계좌를 선택하고 양식을 작성해주세요",
        type: "error",
      });
      await new Promise((_, reject) => {
        reject("계좌를 선택하고 양식을 작성해주세요");
      });
    }
    if (
      Array.from(digitInputElements).some((input) => {
        const value = input.value;
        const digit = Number(input.dataset?.digit ?? "0");

        return value.length !== digit;
      })
    ) {
      renderToast({
        container: toastContainer,
        message: "유효한 계좌 형식이 아닙니다",
        type: "error",
      });
      await new Promise((_, reject) => {
        Array.from(digitInputElements).forEach((input) => {
          const value = input.value;
          const digit = Number(input.dataset?.digit ?? "0");
          const digitRegExp = new RegExp(`^[0-9]{${digit}}$`);

          if (!digitRegExp.test(value)) {
            input.style.borderBottom = "2px solid #fb9664";
          }
        });
        reject("유효한 계좌 형식이 아닙니다");
      });
    }

    if (!phoneRegExp.test(phoneInputElement.value)) {
      renderToast({
        container: toastContainer,
        message: "유효한 휴대폰 번호 형식이 아닙니다",
        type: "error",
      });
      await new Promise((_, reject) => {
        reject("유효한 휴대폰 번호 형식이 아닙니다.");
      });
    }

    const connectBank = submitForm.elements?.bank.value;
    const connectBankCode = availableBankInfoMap.get(connectBank).code;
    const accountNumber = Array.from(digitInputElements)
      .map((digitInput) => digitInput.value)
      .join("");
    const phoneNumber = phoneInputElement.value;
    const accessToken = AppStorage.getAccessToken();

    const res = await bankAPI.syncBankAccount({
      accessToken,
      bankCode: connectBankCode,
      accountNumber,
      phoneNumber,
      signature: true,
    });

    if (!res) {
      renderToast({
        container: toastContainer,
        message: "계좌 등록 중 에러가 발생하였습니다",
        type: "error",
      });
      await new Promise((_, reject) => {
        reject("계좌 등록 중 에러가 발생하였습니다");
      });
    }
  }

  async function onCancel() {}

  async function onAfter() {
    const infoElement = document.querySelector(".accounts-info");
    const accountListElement = document.querySelector(".account-list");
    bankAPI
      .getUserBankAccountList({ accessToken: AppStorage.getAccessToken() })
      .then(async ({ accounts, totalBalance }) => {
        accountListElement.classList.remove(
          "account-list--has-not-bank-accounts"
        );
        render(infoElement, { accountLength: accounts.length });
        render(accountListElement, { accounts });
      });
  }

  const modalContent = connectAccountForm({ useAbleBankList });
  const modalProps = {
    title: "계좌 연결",
    content: modalContent,
    submitBtnText: "계좌 등록",
    cancelBtnText: "취소",
  };
  const modalEvent = {
    onSubmit: callback?.onSubmit ?? onSubmit,
    onCancel: callback?.onCancel ?? onCancel,
    onAfter: callback?.onAfter ?? onAfter,
  };

  window.dispatchEvent(CustomModalOpenEvent({ ...modalProps, ...modalEvent }));
};

function registerEvents(predicate) {
  if (predicate) {
    Array.from(connectAccountModalEventMap.entries())
      .filter(([{ target, eventType }, eventCallback]) => {
        return predicate([{ target, eventType }, eventCallback]);
      })
      .forEach(([{ target, eventType }, eventCallback]) => {
        target.addEventListener(eventType, eventCallback);
      });

    return;
  }
  Array.from(connectAccountModalEventMap.entries()).forEach(
    ([{ target, eventType }, eventCallback]) => {
      target.addEventListener(eventType, eventCallback);
    }
  );
}

function removeEvents(predicate) {
  if (predicate) {
    const removeKeys = Array.from(connectAccountModalEventMap.entries())
      .filter(([{ target, eventType }, eventCallback]) =>
        predicate([{ target, eventType }, eventCallback])
      )
      .map(([key, _]) => key);

    removeKeys.forEach((key) => {
      const { target, eventType } = key;
      const eventCallback = connectAccountModalEventMap.get(key);
      target.removeEventListener(eventType, eventCallback);
      connectAccountModalEventMap.delete(key);
    });

    return;
  }
  Array.from(connectAccountModalEventMap.entries()).forEach(
    ([{ target, eventType }, eventCallback]) => {
      target.removeEventListener(eventType, eventCallback);
    }
  );
}

function createAccountNumberInput({ digits }) {
  removeEvents(
    ([{ target, eventType }, eventCallback]) =>
      target.tagName === "INPUT" || target.className === "account-input-wrapper"
  );

  const accountInputWrapper = document.createElement("div");
  accountInputWrapper.className = "account-input-wrapper";

  const digitInputElements = digits.map((digit) => {
    const maskingStr = "*";
    const accountNumberInput = document.createElement("input");
    accountNumberInput.inputMode = "numeric";
    accountNumberInput.dataset.digit = digit;
    accountNumberInput.placeholder = Array.from({ length: digit })
      .fill(maskingStr)
      .join("");
    accountNumberInput.style.width = `calc(${digit} * 0.65em)`;

    return accountNumberInput;
  });

  const handleInputChange = (e) => {
    const bankModal = document.querySelector(".bank-modal__wrapper");

    const numberRegExp = /^[0-9]$/;

    const curStep = Array.from(digitInputElements).findIndex(
      (input) => input === e.target
    );
    const endStep = Array.from(digitInputElements).length - 1;

    if (e.inputType === "deleteContentBackward") {
      e.target.value = e.target.value.padEnd(
        Number(e.target.dataset.digit),
        "*"
      );
      return;
    }
    if (!numberRegExp.test(e.data)) {
      renderToast({
        container: bankModal,
        message: "계좌번호는 0-9 숫자만 입력가능합니다",
        type: "error",
        autoUnmount: 3000,
      });

      e.target.value = e.target.value
        .replaceAll(/[^0-9]/g, "")
        .padEnd(Number(e.target.dataset.digit), "*");
      return;
    }

    const startOffset = e.target.dataset?.accNumber?.length ?? 0;
    const endOffset = Number(e.target.dataset.digit);
    e.target.setSelectionRange(startOffset, endOffset);
    e.target.dataset.accNumber = e.target.value
      .replaceAll("*", "")
      .substring(0, e.target.dataset.digit);
    e.target.value = e.target.dataset.accNumber.padEnd(
      Number(e.target.dataset.digit),
      "*"
    );

    if (e.target.dataset?.accNumber?.length >= Number(e.target.dataset.digit)) {
      if (curStep < endStep) {
        digitInputElements[curStep + 1].focus();
        return;
      }
      if (curStep === endStep) {
        digitInputElements[endStep].blur();
      }
    }
  };
  const handleInputBlur = (e) => {
    const { digit } = e.target.dataset;
    const nothasAccNumberRegexp = new RegExp(`^[*]{${digit}}$`);
    const isValidDigit = new RegExp(`^[0-9]{${digit}}$`);

    if (
      !e.target.dataset?.accNumber ||
      nothasAccNumberRegexp.test(e.target.value)
    ) {
      e.target.style.borderBottom = "2px solid #fb9664";
      e.target.value = "";
      return;
    }
    if (isValidDigit.test(e.target.value)) {
      e.target.style.borderBottom = "2px solid #32cd32";
      return;
    }

    e.target.style.cssText = e.target.style.cssText.replace(
      /border-bottom: .+?;/,
      ""
    );
  };
  digitInputElements.forEach((digitInput, index) => {
    index === digitInputElements.length - 1
      ? accountInputWrapper.append(digitInput)
      : accountInputWrapper.append(digitInput, document.createTextNode("-"));

    connectAccountModalEventMap.set(
      { target: digitInput, eventType: "input" },
      handleInputChange
    );
    connectAccountModalEventMap.set(
      { target: digitInput, eventType: "blur" },
      handleInputBlur
    );
  });

  // 계좌 입력과 관련된 이벤트 등록
  registerEvents(
    ([{ target, eventType }, eventCallback]) =>
      target.tagName === "INPUT" || target.className === "account-input-wrapper"
  );

  return accountInputWrapper;
}

function createPhoneNumberInput() {
  removeEvents(
    ([{ target, eventType }, eventCallback]) =>
      target.className === "account-input-phone"
  );

  const bankModal = document.querySelector(".bank-modal__wrapper");

  const phoneNumberInput = document.createElement("input");
  phoneNumberInput.className = "account-input-phone";
  phoneNumberInput.placeholder = "01012345678";
  // phoneNumberInput.inputMode = "tel";

  const numberRegExp = /^[0-9]$/;
  const phoneRegExp = /010\d{4}\d{4}/;

  const handleInput = (e) => {
    if (e.inputType === "deleteContentBackward") return;

    if (!numberRegExp.test(e.data)) {
      renderToast({
        container: bankModal,
        message: "전화번호는 0-9 숫자만 입력가능합니다",
        type: "error",
        autoUnmount: 3000,
      });
      e.target.value = e.target.value.substring(0, e.target.value.length - 1);
      return;
    }

    if (phoneRegExp.test(e.target.value)) {
      e.target.style.cssText = e.target.style.cssText.replace(
        /border: .+?;/,
        ""
      );
      e.target.blur();
    }

    if (e.target.value.length > 11) {
      renderToast({
        container: bankModal,
        message: "전화번호는 11자를 넘을 수 없습니다",
        type: "error",
        autoUnmount: 3000,
      });
      e.target.value = e.target.value.substring(0, 11);
    }
  };

  const handleBlur = (e) => {
    if (!phoneRegExp.test(e.target.value)) {
      phoneNumberInput.style.border = "2px solid #fb9664";
      return;
    }
    e.target.style.border = "2px solid #32cd32";
  };

  connectAccountModalEventMap.set(
    { target: phoneNumberInput, eventType: "input" },
    handleInput
  );
  connectAccountModalEventMap.set(
    { target: phoneNumberInput, eventType: "blur" },
    handleBlur
  );

  // 전화번호 입력과 관련된 이벤트 등록
  registerEvents(
    ([{ target, eventType }, eventCallback]) =>
      target.className === "account-input-phone"
  );

  return phoneNumberInput;
}
