import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { api } from "../../api/bankApi";
import { fmt, ts } from "../../utils/format";

export default function HistoryModal({ account, onClose }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api("GET", `/account/transfers/outgoing/${account.id}`)
      .then(setData)
      .catch((e) => setErr(e.message));
  }, [account.id]);

  return (
    <Modal title="History" onClose={onClose}>
      {err && <p style={{ color: "red" }}>{err}</p>}
      {!data && !err && <p>Loading...</p>}

      {data?.map((t, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{ts(t.timestamp)}</span>
          <span>- {fmt(t.amount)}</span>
        </div>
      ))}
    </Modal>
  );
}