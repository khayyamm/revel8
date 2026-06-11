export default function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20 }}>
      {toasts.map((t) => (
        <div key={t.id} style={{ marginBottom: 8 }}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}