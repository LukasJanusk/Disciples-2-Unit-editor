type Variant = "default" | "error";

type Props = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  showLoader?: boolean;
  variant?: Variant;
};

const variantClasses: Record<Variant, string> = {
  default: "border-gray-200 bg-white text-gray-700",
  error: "border-red-200 bg-red-50 text-red-700",
};

export default function PageState({ title, description, actionLabel, onAction, showLoader = false, variant = "default" }: Props) {
  return (
    <div className="flex h-full w-full items-center justify-center px-6 py-10">
      <div className={`flex w-full max-w-2xl flex-col items-center rounded-xl border px-8 py-10 text-center shadow-sm ${variantClasses[variant]}`}>
        {showLoader ? <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-700" aria-hidden="true" /> : null}
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description ? <p className="mt-3 max-w-xl text-sm leading-6 text-inherit/80">{description}</p> : null}
        {actionLabel && onAction ? (
          <button
            className="mt-6 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
            onClick={onAction}
            type="button"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
