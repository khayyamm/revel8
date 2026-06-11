export default function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 13, marginBottom: 5, display: "block" }}>
        {label}
      </label>
      {children}
    </div>
  );
}