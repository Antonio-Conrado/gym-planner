export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50  px-5">
      {children}
    </div>
  );
}
