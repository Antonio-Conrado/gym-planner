import Image from "next/image";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
          alt="Background"
          className="w-full h-full object-cover opacity-30"
          height={1200}
          width={1200}
        />
        <div className="absolute inset-0 bg-linear-to-b from-gray-900/80 via-gray-900/70 to-gray-900/90"></div>
      </div>

      <div className="relative z-10 w-full  flex justify-center px-6">
        {children}
      </div>
    </div>
  );
}
