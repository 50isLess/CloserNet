import type { ReactNode } from "react";

export function FormLabel({
  htmlFor,
  children,
  required = false,
  optional = false,
  hint,
}: {
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
  optional?: boolean;
  hint?: string;
}) {
  return (
    <div className="mb-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-zinc-300">
        {children}
        {required && (
          <span className="text-red-400 ml-1" aria-label="required">
            *
          </span>
        )}
        {optional && <span className="text-zinc-500 font-normal ml-1.5">(optional)</span>}
      </label>
      {hint && <p className="text-xs text-zinc-500 mt-0.5">{hint}</p>}
    </div>
  );
}