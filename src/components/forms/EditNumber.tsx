import React from "react";

interface EditNumberProps {
  data: string;
  setData: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  maxTextLength?: number;
  placeholder?: string;
  title?: string;
  description?: string;
}

export default function EditNumber({
  data,
  setData,
  required = false,
  disabled = false,
  maxTextLength = 20,
  placeholder = "",
  title = "",
  description = "",
}: EditNumberProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    // Permitir sólo dígitos, espacios, guiones y signo + al inicio
    // Primero quitamos todo lo que no sea dígito, espacio, guión o +
    inputValue = inputValue.replace(/[^0-9+\-\s]/g, "");
    // Asegurarnos de que sólo haya un '+' y sea al principio
    if ((inputValue.match(/\+/g) || []).length > 1) {
      inputValue = inputValue.replace(/\+/g, "");
      inputValue = "+" + inputValue;
    }
    setData(inputValue);
  };

  return (
    <div>
      {title && (
        <span className="dark:text-dark-txt block text-sm font-bold text-gray-900">{title}</span>
      )}
      {description && (
        <span className="dark:text-dark-txt-secondary mb-2 block text-sm text-gray-500">
          {description}
        </span>
      )}
      <input
        type="tel"
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        value={data}
        maxLength={maxTextLength}
        className="outline-color-border placeholder:text-color-subtext focus:outline-color-secondary text-color-text w-full min-w-0 rounded-md px-3 py-1.5 text-base outline outline-1 -outline-offset-1 focus:outline focus:outline-2 focus:-outline-offset-2 sm:w-64 sm:text-sm/6 xl:w-full"
        onChange={handleInputChange}
      />
    </div>
  );
}

EditNumber.defaultProps = {
  required: false,
  disabled: false,
  maxTextLength: 20,
  placeholder: "",
  title: "",
  description: "",
};
