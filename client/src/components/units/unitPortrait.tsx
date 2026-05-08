import { portraits } from "@/alias/portraits";

type Props = {
  unitId: string;
};

export default function UnitPortrait({ unitId }: Props) {
  const getPortraitUrl = (unitId: string): string | null => {
    return portraits[unitId as keyof typeof portraits] || null;
  };

  const portrait = getPortraitUrl(unitId);

  if (portrait) {
    return (
      <div className="w-48 h-auto bg-gray-300 rounded-md flex items-center justify-center">
        <img src={portrait} alt="Unit Portrait" className="w-full h-full object-cover rounded-md" />
      </div>
    );
  }
  return (
    <div className="w-48 h-48 bg-gray-300 rounded-md flex items-center justify-center">
      <span className="text-gray-500">Unit Portrait</span>
    </div>
  );
}
