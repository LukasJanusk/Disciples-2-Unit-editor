import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Content({ children }: Props) {
  return (
    <main className="w-full h-full flex flex-col items-center justify-start min-h-0">
      <div className="max-w-7xl w-full min-w-xl flex-1 min-h-0 p-4">{children}</div>
    </main>
  );
}
