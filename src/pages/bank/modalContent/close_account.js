import BankAPI from "../../../api/bank";
import { AppStorage } from "../../../util";
import { bankLogoImgMap } from "../bankLogoMap";
import { CustomModalOpenEvent } from "../bankModal";
import { renderToast } from "../toast";

const bankAPI = new BankAPI();

const closeAccountModalConfirm = ({ closeAccountList }) => {
  const wrapper = document.createElement("div");
  wrapper.className = "bank-modal__confirm--close-account";

  const selectedList = document.createElement("div");
  selectedList.className = "selected-list";
  const selectedBankLogoList = Array.from(closeAccountList).map((account) => {
    const { bankName } = account.dataset;
    const imgWrapper = document.createElement("div");
    imgWrapper.className = "bank-logo";
    imgWrapper.appendChild(bankLogoImgMap.get(bankName).cloneNode(true));

    return imgWrapper;
  });
  selectedList.append(...selectedBankLogoList);

  const confirmText = document.createElement("span");
  confirmText.className = "confirm-text";
  confirmText.innerHTML =
    "선택한 계좌들을 해지합니다. <br/> 계속 진행하시겠습니까?";

  wrapper.append(selectedList, confirmText);

  return wrapper;
};

export const openCloseAccountModal = ({ closeAccountList }) => {
  async function onSubmit() {
    const accessToken = AppStorage.getAccessToken();

    return Array.from(closeAccountList).forEach(async (closeAccount) => {
      const { id } = closeAccount.dataset;
      const res = await bankAPI.closeBankAccount({
        accessToken,
        accountId: id,
        signature: true,
      });
      if (!res) {
        renderToast({
          message: `${
            closeAccount?.bankName ? `[${closeAccount.bankName}]` : ""
          }계좌 해제중 에러가 발생하였습니다`,
        });
      }
    });
  }

  async function onCancel() {}

  async function onAfter() {
    await unmountCloseAccountItems(closeAccountList);
    setTimeout(() => {
      const accountListElement = document.querySelector(".account-list");
      const accountTotalElement = document.querySelector(".accounts--total");

      accountTotalElement.textContent = `총 ${accountListElement.childElementCount}개`;
      if (accountListElement.childElementCount === 0) {
        accountListElement.classList.add("account-list--has-not-bank-accounts");
        accountListElement.innerHTML = `
          연결된 계좌가 없습니다.
          <div style="display: flex; align-items: center;">
            <span class="block-format">계좌 추가 등록</span>을 통해 계좌를 연결해주세요.
          </div>
        `;
      }
    }, 300);
  }

  const modalContent = closeAccountModalConfirm({ closeAccountList });
  const modalProps = {
    title: "선택 계좌 해지",
    content: modalContent,
    submitBtnText: "확인",
    cancelBtnText: "취소",
  };
  const modalEvent = {
    onSubmit,
    onCancel,
    onAfter,
  };

  window.dispatchEvent(CustomModalOpenEvent({ ...modalProps, ...modalEvent }));
};

async function unmountCloseAccountItems(closeAccountList) {
  const accountListElement = getAccountListElement();

  Array.from(closeAccountList).forEach((closeAccount) => {
    closeAccount.classList.add("--hide");
    setTimeout(() => {
      accountListElement.removeChild(closeAccount);
    }, 300);
  });

  return getAccountListElement();
}

function getAccountListElement() {
  return document.querySelector(".account-list");
}
