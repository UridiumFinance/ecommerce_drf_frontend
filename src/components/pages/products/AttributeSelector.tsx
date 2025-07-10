// components/AttributeSelector.tsx
import classNames from "@/utils/classnames";

interface AttributeSelectorProps {
  label: string;
  options: any[];
  selected: any | null;
  onChange: (option: any) => void;
  optionType: string;
}

export default function AttributeSelector({
  label,
  options = [],
  selected,
  onChange,
  optionType,
}: AttributeSelectorProps) {
  return (
    <div>
      <div className="text-sm/6 font-medium text-gray-900">{label}</div>
      <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {options.map(option => {
          const inputId = `${optionType}-${option.id}`;
          const isSelected = selected?.id === option.id;

          return (
            <div key={option.id}>
              <input
                id={inputId}
                type="radio"
                name={optionType}
                value={option.id}
                checked={isSelected}
                onChange={() => onChange(option)}
                className="sr-only"
                disabled={option.stock === 0}
              />

              <label
                htmlFor={inputId}
                className={classNames(
                  "relative flex min-w-0 items-center justify-center rounded-md border p-3 transition-colors",
                  isSelected
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-300 bg-white hover:border-gray-400",
                  option.stock === 0 && "cursor-not-allowed opacity-50",
                )}
              >
                <span
                  className="line-clamp-2 block w-full text-center text-xs font-medium break-words whitespace-normal uppercase"
                  title={option.title}
                >
                  {option.title}
                </span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
