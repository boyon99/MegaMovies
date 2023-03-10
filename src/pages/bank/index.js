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
      pageTitle.textContent = "ëě ęłě˘";

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
      bankAccountNumber.innerHTML = `<span class="block-format">ęłě˘ë˛í¸</span> ${accountNumber.replaceAll(
        "X",
        "*"
      )}`;
      const bankBalance = document.createElement("div");
      bankBalance.className = "account-balance";
      bankBalance.innerHTML = `<span class="block-format">ěěĄ</span> ${new Intl.NumberFormat(
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
      allSelectBtn.textContent = "ě ě˛´ ě í";
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

      // ě í ęłě˘ í´ě§ ë˛íź
      const closeAccountBtn = document.createElement("button");
      closeAccountBtn.classList.add("btn-secondary", "medium");
      closeAccountBtn.textContent = "ě í ęłě˘ í´ě§";

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
            message: "í´ě§í  ęłě˘ëĽź ě íí ě§íí´ěŁźě¸ě",
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

      // ęłě˘ ěśę° ëąëĄ ë˛íź
      const connectAccountBtn = document.createElement("button");
      connectAccountBtn.classList.add("btn-primary", "medium");
      connectAccountBtn.textContent = "ęłě˘ ěśę° ëąëĄ";

      const handleConnectAccount = async () => {
        //
        const useAbleBankList = await bankAPI.getAvailableBankAccountList({
          accessToken: AppStorage.getAccessToken(),
        });
        if (!useAbleBankList || useAbleBankList.length === 0) {
          renderToast({
            message: "ěśę°ëĄ ëąëĄí  ě ěë ěíě´ ěěľëë¤",
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
      totalAccounts.textContent = `ě´ ${accountLength}ę°`;
      return;
    case "account-list":
      const { accounts } = props;

      if (accounts.length === 0) {
        targetElement.classList.add("account-list--has-not-bank-accounts");
        targetElement.innerHTML = `
          ě°ę˛°ë ęłě˘ę° ěěľëë¤.
          <div style="display: flex; align-items: center;">
            <span class="block-format">ęłě˘ ěśę° ëąëĄ</span>ě íľí´ ęłě˘ëĽź ě°ę˛°í´ěŁźě¸ě.
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
