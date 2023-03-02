import { createBankList } from ".";
import BankAPI from "../../api/bank";
import { AppStorage } from "../../util";
import { openConnectAccountModal } from "../bank/modalContent/connect_account";

const bankAPI = new BankAPI();

export const openAddAccountModal = async () => {
  const useAbleBankList = await bankAPI.getAvailableBankAccountList({
    accessToken: AppStorage.getAccessToken(),
  });

  async function onAfter() {
    await bankAPI
      .getUserBankAccountList({ accessToken: AppStorage.getAccessToken() })
      .then((bankList) => {
        const [
          ,
          ,
          {
            children: [_, paymentMethodAccordionContent],
          },
        ] = document.querySelectorAll(".page__accordion");

        paymentMethodAccordionContent.replaceChildren(
          createBankList(bankList.accounts)
        );
      });
  }

  openConnectAccountModal({ useAbleBankList }, { onAfter });
};
