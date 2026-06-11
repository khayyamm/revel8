import { useState } from "react";
import Modal from "../common/Modal";
import Field from "../common/Field";
import { api } from "../../api/bankApi";

export default function CreateAccountModal({ onClose, onCreated }) {
  const [owner, setOwner] = useState("");
  const [balance, setBalance] = useState("");
  const [err, setErr] = useState("");

  const submit = async () => {
    if (!owner.trim()) return setErr("Owner required");

    try {
      const acc = await api("POST", "/account", {
        owner: owner.trim(),
        initialBalance: Number(balance) || 0,
      });

      onCreated(acc);
      onClose();
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <Modal title="Create account" onClose={onClose}>
      <Field label="Owner">
        <input value={owner} onChange={(e) => setOwner(e.target.value)} />
      </Field>

      <Field label="Initial balance">
        <input
          type="number"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
        />
      </Field>

      {err && <p style={{ color: "red" }}>{err}</p>}

      <button onClick={submit}>Create</button>
    </Modal>
  );
}