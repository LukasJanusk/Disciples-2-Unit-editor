import Content from "@/components/layout/Content";
import PageState from "@/components/layout/PageState";
import { useEffect, useState } from "react";
import { checkFilesExist } from "@/api/https";
import FileUploadSection from "@/components/FileUploadSection";

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
        <PageState showLoader title="Checking uploaded files" description="Looking for the required .dbf files before the editor can be used." />
      </Content>
    );
  }

  if (error) {
    return (
      <Content>
        <PageState title="Files required" description={error} onAction={onFileUpload} actionLabel="Retry" variant="error" />
      </Content>
    );
  }

  return (
    <Content>
      <div className="h-full w-full rounded-md border border-gray-100 bg-white p-8">
        <div className="flex h-full w-full flex-col items-center justify-start gap-4">
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
      </div>
    </Content>
  );
}
