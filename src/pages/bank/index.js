import { AppStorage } from "../../util";
import { bankLogoImgMap } from "./bankLogoMap";
import BankAPI from "../../api/bank";
import { openCloseAccountModal } from "./modalContent/close_account";
import { openConnectAccountModal } from "./modalContent/connect_account";
import { renderToast } from "./toast";

const bankAPI = new BankAPI();
export const bankPageEventMap = new Map([]);

// base page
const bankPage = () => {
  if (bankPageEventMap.size > 0) {
    removeEvents();
  }

  const user = AppStorage.getCurrentUser();
  const page = document.createElement("div");
  page.className = "bank";

  const wrapper = createElement("wrapper");

  const title = createElement("page-title");
  const info = createElement("accounts-info");
  const accountList = createElement("account-list");
  const control = createElement("control");

  wrapper.append(title, info, accountList, control);

  page.append(wrapper);

  registerEvents();
  //
  if (user) {
    bankAPI
      .getUserBankAccountList({ accessToken: AppStorage.getAccessToken() })
      .then(({ accounts, totalBalance }) => {
        render(info, { accountLength: accounts.length });
        render(accountList, { accounts });
      });
  }

  return page;
};
export default bankPage;

function createElement(type, props) {
  switch (type) {
    case "wrapper":
      const wrapper = document.createElement("div");
      wrapper.className = "inner";

      return wrapper;
    case "page-title":
      const pageTitle = document.createElement("h3");
      pageTitle.className = "title";
      pageTitle.textContent = "나의 계좌";

      return pageTitle;
    case "account-list":
      const accountList = document.createElement("ul");
      accountList.className = "account-list";

      const handleSelectChange = (e) => {
        accountList.dispatchEvent(new Event("afterAccountSelect"));
      };
      const handleAfterSelect = (e) => {
        const selectedAccountList = Array.from(
          document.querySelectorAll(
            '.account-item input[type="checkbox"]:checked'
          )
        );
        const closeAccountBtn = document.querySelector(
          ".control .btn-secondary"
        );

        if (selectedAccountList.length === 0) {
          closeAccountBtn.style.cssText = closeAccountBtn.style.cssText.replace(
            /color: .+?;/,
            ""
          );
          return;
        }

        closeAccountBtn.style.color = "#000";
      };

      bankPageEventMap.set(
        { target: accountList, eventType: "change" },
        handleSelectChange
      );

      bankPageEventMap.set(
        { target: accountList, eventType: "afterAccountSelect" },
        handleAfterSelect
      );

      return accountList;
    case "account-item":
      const { id, bankName, accountNumber, balance } = props.account;

      const accountItem = document.createElement("li");
      accountItem.className = "account-item";
      accountItem.dataset.id = id;
      accountItem.dataset.bankName = bankName;

      const checkBox = document.createElement("input");
      checkBox.type = "checkbox";

      const account = document.createElement("div");
      account.className = "account";

      const bankLogoWrapper = document.createElement("div");
      bankLogoWrapper.className = "bank-logo";

      const bankLogo = bankLogoImgMap.get(bankName).cloneNode(true);
      bankLogoWrapper.appendChild(bankLogo);

      const bankInfoWrapper = document.createElement("div");
      bankInfoWrapper.className = "bank--info";
      const bankAccountNumber = document.createElement("div");
      bankAccountNumber.className = "account-number";
      bankAccountNumber.innerHTML = `<span class="block-format">계좌번호</span> ${accountNumber.replaceAll(
        "X",
        "*"
      )}`;
      const bankBalance = document.createElement("div");
      bankBalance.className = "account-balance";
      bankBalance.innerHTML = `<span class="block-format">잔액</span> ${new Intl.NumberFormat(
        "ko-KR",
        { style: "currency", currency: "KRW" }
      ).format(balance)}`;
      bankInfoWrapper.append(bankAccountNumber, bankBalance);

      account.append(bankLogoWrapper, bankInfoWrapper);

      accountItem.append(checkBox, account);

      return accountItem;
    case "accounts-info":
      const info = document.createElement("div");
      info.className = "accounts-info";

      const totalBankAccount = document.createElement("div");
      totalBankAccount.className = "accounts--total";

      const allSelectBtn = document.createElement("button");
      allSelectBtn.classList.add("btn-outlined", "small");
      allSelectBtn.textContent = "전체 선택";
      const handleAllSeclectClick = (e) => {
        const accountItemlist = document.querySelector(".account-list");
        const allAccountItemCheckbox = document.querySelectorAll(
          '.account-item input[type="checkbox"]'
        );

        if (!allAccountItemCheckbox || !allAccountItemCheckbox.length) return;

        allAccountItemCheckbox.forEach((checkBox) => (checkBox.checked = true));

        accountItemlist.dispatchEvent(new Event("afterAccountSelect"));
      };

      bankPageEventMap.set(
        { target: allSelectBtn, eventType: "click" },
        handleAllSeclectClick
      );

      info.append(totalBankAccount, allSelectBtn);

      return info;
    case "control":
      const control = document.createElement("div");
      control.className = "control";

      // 선택 계좌 해지 버튼
      const closeAccountBtn = document.createElement("button");
      closeAccountBtn.classList.add("btn-secondary", "medium");
      closeAccountBtn.textContent = "선택 계좌 해지";

      const handleCloseAccount = () => {
        const selectedAccountList = Array.from(
          document.querySelectorAll(
            '.account-item input[type="checkbox"]:checked'
          )
        )?.map((selectedAccountInput) => {
          const accountItem = selectedAccountInput.closest(".account-item");
          return accountItem;
        });

        if (selectedAccountList.length === 0) {
          renderToast({
            message: "해지할 계좌를 선택후 진행해주세요",
            type: "error",
            autoUnmount: 3000,
          });
          return;
        }

        // closeAccountBtn.style.color = "#000";
        openCloseAccountModal({ closeAccountList: selectedAccountList });
      };
      bankPageEventMap.set(
        { target: closeAccountBtn, eventType: "click" },
        handleCloseAccount
      );

      // 계좌 추가 등록 버튼
      const connectAccountBtn = document.createElement("button");
      connectAccountBtn.classList.add("btn-primary", "medium");
      connectAccountBtn.textContent = "계좌 추가 등록";

      const handleConnectAccount = async () => {
        //
        const useAbleBankList = await bankAPI.getAvailableBankAccountList({
          accessToken: AppStorage.getAccessToken(),
        });
        if (!useAbleBankList || useAbleBankList.length === 0) {
          renderToast({
            message: "추가로 등록할 수 있는 은행이 없습니다",
            type: "error",
            autoUnmount: 3000,
          });
          return;
        }
        openConnectAccountModal({ useAbleBankList });
      };
      bankPageEventMap.set(
        { target: connectAccountBtn, eventType: "click" },
        handleConnectAccount
      );

      control.append(closeAccountBtn, connectAccountBtn);

      return control;
  }
}

export async function render(targetElement, props) {
  switch (targetElement.className) {
    case "accounts-info":
      const { accountLength } = props;

      const totalAccounts = Array.from(targetElement.children).find(
        (child) => child.className === "accounts--total"
      );
      totalAccounts.textContent = `총 ${accountLength}개`;
      return;
    case "account-list":
      const { accounts } = props;

      if (accounts.length === 0) {
        targetElement.classList.add("account-list--has-not-bank-accounts");
        targetElement.innerHTML = `
          연결된 계좌가 없습니다.
          <div style="display: flex; align-items: center;">
            <span class="block-format">계좌 추가 등록</span>을 통해 계좌를 연결해주세요.
          </div>
        `;

        return;
      }

      const accountItemList = Array.from(accounts).map((account) => {
        return createElement("account-item", { account });
      });

      targetElement.replaceChildren(...accountItemList);

      return;
    case "account-item":
      return;
  }
}

function registerEvents() {
  Array.from(bankPageEventMap.entries()).forEach(
    ([{ target, eventType }, eventCallback]) => {
      target.addEventListener(eventType, eventCallback);
    }
  );
}

function removeEvents() {
  Array.from(bankPageEventMap.entries()).forEach(
    ([{ target, eventType }, eventCallback]) => {
      target.removeEventListener(eventType, eventCallback);
    }
  );
  bankPageEventMap.clear();
}
