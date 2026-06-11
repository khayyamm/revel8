import { useState } from "react";
import Modal from "../common/Modal";
import Field from "../common/Field";
import { api } from "../../api/bankApi";
import { fmt } from "../../utils/format";

export default function AmountModal({ account, mode, onClose, onDone }) {
  const [amount, setAmount] = useState("");
  const [err, setErr] = useState("");

  const submit = async () => {
    const n = Number(amount);
    if (!n || n <= 0) return setErr("Invalid amount");

    try {
      const updated = await api(
        "POST",
       `/account/${mode}/${account.id}`,
        { amount: n }
      );

      onDone(updated);
      onClose();
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <Modal title={mode} onClose={onClose}>
      <div>
        <div>
          {account.owner} — {fmt(account.balance)}
        </div>

        <Field label="Amount">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Field>

        {err && <p style={{ color: "red" }}>{err}</p>}

        <button onClick={submit}>
          {mode === "deposit" ? "Deposit" : "Withdraw"}
        </button>
      </div>
    </Modal>
  );
}