import { useState } from "react";
import AmountModal from "./AmountModal";
import TransferModal from "./TransferModal";
import HistoryModal from "./HistoryModal";
import { fmt } from "../../utils/format";

export default function AccountCard({ account, accounts, onUpdate, onToast }) {
  const [modal, setModal] = useState(null);

  const handleDone = (updated) => {
    if (updated) onUpdate(updated);
    else onUpdate(null);
    onToast("success", "Transaction completed");
  };

  return (
    <div style={{ border: "1px solid #eee", padding: 16, borderRadius: 10 }}>
      <div>
        <div><b>{account.owner}</b></div>
        <div>{fmt(account.balance)}</div>
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
        <button onClick={() => setModal("deposit")}>Deposit</button>
        <button onClick={() => setModal("withdraw")}>Withdraw</button>
        <button onClick={() => setModal("transfer")}>Transfer</button>
        <button onClick={() => setModal("history")}>History</button>
      </div>

      {modal === "deposit" && (
        <AmountModal
          account={account}
          mode="deposit"
          onClose={() => setModal(null)}
          onDone={handleDone}
        />
      )}

      {modal === "withdraw" && (
        <AmountModal
          account={account}
          mode="withdraw"
          onClose={() => setModal(null)}
          onDone={handleDone}
        />
      )}

      {modal === "transfer" && (
        <TransferModal
          account={account}
          accounts={accounts}
          onClose={() => setModal(null)}
          onDone={() => handleDone(null)}
        />
      )}

      {modal === "history" && (
        <HistoryModal
          account={account}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}