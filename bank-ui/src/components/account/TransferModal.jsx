import { useState } from "react";
import Modal from "../common/Modal";
import Field from "../common/Field";
import { api } from "../../api/bankApi";
import { fmt } from "../../utils/format";

export default function TransferModal({ account, accounts, onClose, onDone }) {
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");
  const [err, setErr] = useState("");

  const submit = async () => {
    const n = Number(amount);
    if (!toId) return setErr("Select account");
    if (!n || n <= 0) return setErr("Invalid amount");

    try {
       await api("POST", `/account/transfer/${account.id}`, {
            toAccountId: toId,
            amount: n,
        });

      onDone();
      onClose();
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <Modal title="Transfer" onClose={onClose}>
      <div>
        <div>
          From: {account.owner} ({fmt(account.balance)})
        </div>

        <Field label="To">
          <select value={toId} onChange={(e) => setToId(e.target.value)}>
            <option value="">Select</option>
            {accounts
              .filter((a) => a.id !== account.id)
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.owner}
                </option>
              ))}
          </select>
        </Field>

        <Field label="Amount">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Field>

        {err && <p style={{ color: "red" }}>{err}</p>}

        <button onClick={submit}>Send</button>
      </div>
    </Modal>
  );
}