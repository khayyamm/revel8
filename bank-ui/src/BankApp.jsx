import { useState, useEffect, useCallback } from "react";

import { api } from "./api/bankApi";

import AccountCard from "./components/account/AccountCard";
import CreateAccountModal from "./components/account/CreateAccountModal";
import Toast from "./components/common/Toast";

import { fmt } from "./utils/format";

export default function BankApp() {
  const [accounts, setAccounts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);


  const addToast = useCallback((type, msg) => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, type, msg }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);


  const loadAccounts = useCallback(async () => {
    try {
      const data = await api("GET", "/accounts");
      setAccounts(data);
    } catch (e) {
      addToast("error", e.message);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);


  const handleCreated = (account) => {
    setAccounts((prev) => [...prev, account]);

    addToast(
      "success",
      `Account created for ${account.owner}`
    );
  };

  const handleUpdate = async (updated) => {
    try {
   
      if (updated) {
        setAccounts((prev) =>
          prev.map((a) =>
            a.id === updated.id ? updated : a
          )
        );

        return;
      }

     
      const refreshed = await api("GET", "/accounts");

      setAccounts(refreshed);
    } catch (e) {
      addToast("error", e.message);
    }
  };

  const totalBalance = accounts.reduce(
    (sum, account) => sum + Number(account.balance),
    0
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Header */}

      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "0 24px",
          height: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 18,
          }}
        >
          Fast & Reckless Bank
        </h2>

        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
          <span>
            {accounts.length} account
            {accounts.length !== 1 ? "s" : ""}
          </span>

          <span>
            Total Balance: {fmt(totalBalance)}
          </span>

          <button
            onClick={() => setShowCreate(true)}
          >
            + New Account
          </button>
        </div>
      </div>

      {/* Body */}

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: 24,
        }}
      >
        {loading && (
          <p>Loading accounts...</p>
        )}

        {!loading && accounts.length === 0 && (
          <div
            style={{
              textAlign: "center",
              marginTop: 80,
            }}
          >
            <p>No accounts found.</p>

            <button
              onClick={() =>
                setShowCreate(true)
              }
            >
              Create First Account
            </button>
          </div>
        )}

        {!loading && accounts.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                accounts={accounts}
                onUpdate={handleUpdate}
                onToast={addToast}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Account Modal */}

      {showCreate && (
        <CreateAccountModal
          onClose={() =>
            setShowCreate(false)
          }
          onCreated={handleCreated}
        />
      )}

      {/* Toasts */}

      <Toast toasts={toasts} />
    </div>
  );
}