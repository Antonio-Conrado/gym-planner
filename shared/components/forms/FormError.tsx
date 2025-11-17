export function FormError({ message }: { message?: string[] }) {
  if (!message || message.length === 0) return null;

  return (
    <div className="text-red-500 text-sm">
      {message.map((msg, idx) => (
        <div key={idx}>{msg}</div>
      ))}
    </div>
  );
}
