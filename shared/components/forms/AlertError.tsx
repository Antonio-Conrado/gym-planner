export function AlertError({ message }: { message: string | string[] }) {
  if (Array.isArray(message)) {
    return (
      <div className="text-red-500 text-sm">
        {message.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
    );
  }

  return <div className="text-red-500 text-sm">{message}</div>;
}
