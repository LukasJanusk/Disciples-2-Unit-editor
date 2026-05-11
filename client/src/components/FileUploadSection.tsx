import { deleteFile, downloadDbf, uploadDbf } from "@/api/https";
import type { DBFFileName } from "@/types/fileNames";
import { toast } from "sonner";

type Props = {
  label: DBFFileName;
  exist: boolean;
  onUpload: () => void;
};

export default function FileUploadSection({ label, exist, onUpload }: Props) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get(label) as File;

    if (file === null || file.size === 0 || !file.name.toLowerCase().endsWith(".dbf")) {
      toast.error(`No file selected for ${label}`, {
        description: "Please select a .dbf file to upload.",
      });
      return;
    }

    try {
      await uploadDbf(file, label);
      toast.success(`${label} uploaded successfully!`, {
        description: "The file has been uploaded and processed.",
      });
    } catch (error) {
      toast.error(`Failed to upload ${label}`, {
        description: error instanceof Error ? error.message : "An error occurred while uploading the file.",
      });
      console.error(`Error uploading ${label}:`, error);
    } finally {
      onUpload();
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFile(label);
      toast.success(`${label} deleted successfully!`, {
        description: "The file has been deleted.",
      });
    } catch (error) {
      toast.error(`Failed to delete ${label}`, {
        description: error instanceof Error ? error.message : "An error occurred while deleting the file.",
      });
      console.error(`Error deleting ${label}:`, error);
    } finally {
      onUpload();
    }
  };
  const handleDownload = () => {
    try {
      downloadDbf(label);
      toast.success(`Downloading ${label}...`, {
        description: "Your download should start shortly.",
      });
    } catch (error) {
      toast.error(`Failed to download ${label}`, {
        description: error instanceof Error ? error.message : "An error occurred while downloading the file.",
      });
      console.error(`Error downloading ${label}:`, error);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center bg-gray-100 p-4 rounded-lg">
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <label htmlFor={label} className="block text-md font-bold text-gray-700">
          {label} {exist && <span className="text-green-700 text-sm font-light">(uploaded)</span>}
        </label>
        <input
          id={label}
          name={label}
          type="file"
          accept=".dbf"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button type="submit" className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
          {exist ? "Re-upload" : "Upload"}
        </button>
      </form>
      {exist && (
        <>
          <button onClick={handleDelete} className="mt-2 px-4 py-2 w-full bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Delete
          </button>
          <button onClick={handleDownload} className="mt-2 px-4 py-2 w-full bg-blue-600 text-white rounded hover:bg-blue-800 transition-colors">
            Download
          </button>
        </>
      )}
    </div>
  );
}
