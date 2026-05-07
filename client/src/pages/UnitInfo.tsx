import Content from "@/components/layout/Content";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function UnitInfoPage() {
  const { id } = useParams<{ id: string }>();
  const unitId = id ?? "Unknown";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUnitData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Failed to load unit data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUnitData();
  }, [unitId]);

  if (loading) {
    return (
      <Content>
        <div className="text-gray-500 text-center mt-4">Loading unit data...</div>
      </Content>
    );
  }
  return (
    <Content>
      <div>
        <h1 className="text-2xl font-bold">Unit Info</h1>
        <p>{unitId}</p>
      </div>
    </Content>
  );
}
