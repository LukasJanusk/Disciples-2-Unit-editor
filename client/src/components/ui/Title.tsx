import { type ReactNode } from "react";

type Props = {
  text: string;
  icon?: ReactNode;
};

export default function Title({ text, icon }: Props) {
  return (
    <h1 className="text-4xl font-bold text-white">
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </h1>
  );
}
