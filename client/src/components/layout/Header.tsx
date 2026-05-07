import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Header({ children, className }: Props) {
  return (
    <header className={`w-full h-36 flex items-center justify-center bg-gray-800 ${className ?? ""}`}>
      <div className=" w-full">{children}</div>
    </header>
  );
}
