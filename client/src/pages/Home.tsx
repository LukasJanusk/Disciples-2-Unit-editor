import Content from "@/components/layout/Content";
import { useEffect, useState } from "react";
import { checkFilesExist } from "@/api/https";
import FileUploadSection from "@/components/fileUploadSection";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filesExist, setFilesExist] = useState({
    Tglobal: false,
    Gunits: false,
    Gattacks: false,
  });

  useEffect(() => {
    const checkForFiles = async () => {
      try {
        const exist = await checkFilesExist();
        setFilesExist(exist);
        setError("");
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to check files existence");
      } finally {
        setLoading(false);
      }
    };
    void checkForFiles();
  }, []);

  const onFileUpload = async () => {
    try {
      const exist = await checkFilesExist();
      setFilesExist(exist);
    } catch (error) {
      console.error("Failed to update file existence:", error);
    }
  };

  if (loading) {
    return (
      <Content>
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-xl font-medium text-gray-700">Checking for uploaded files...</p>
        </div>
      </Content>
    );
  }

  if (error) {
    return (
      <Content>
        <div className="h-full w-full flex items-center justify-center px-8">
          <div className="max-w-2xl rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">
            <h1 className="text-2xl font-bold">Files Required</h1>
            <p className="mt-3">{error}</p>
          </div>
        </div>
      </Content>
    );
  }

  return (
    <Content>
      <div className="h-full w-full flex flex-col items-center justify-start gap-4 p-8">
        <h1 className="text-4xl font-bold">Welcome to the Disciples 2 Unit Editor</h1>

        <div className="flex gap-4 flex-col">
          <h2 className="block mb-2 text-lg font-medium text-gray-900 py-4">Upload your .dbf files to get started</h2>{" "}
          <p>
            Files can be found inside installation directory <code>/Globals</code>
          </p>
          <div className="flex gap-4">
            <FileUploadSection label="Tglobal" exist={filesExist.Tglobal} onUpload={onFileUpload} />
            <FileUploadSection label="Gunits" exist={filesExist.Gunits} onUpload={onFileUpload} />
            <FileUploadSection label="Gattacks" exist={filesExist.Gattacks} onUpload={onFileUpload} />
          </div>
        </div>
      </div>
    </Content>
  );
}
