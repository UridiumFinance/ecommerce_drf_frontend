import { useState } from "react";
import parse from "html-react-parser";

interface Props {
  description?: string;
  // cuántas líneas quieres mostrar en el preview
  previewLines?: number;
}

export default function CollapsibleDescription({ description = "", previewLines = 4 }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggle = () => setIsExpanded(v => !v);

  // parseamos el HTML (o Markdown convertido a HTML)
  const content = parse(description);

  const clampStyle: React.CSSProperties = !isExpanded
    ? {
        display: "-webkit-box",
        WebkitLineClamp: previewLines,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }
    : {};

  return (
    <div className="relative">
      {/* Contenedor con clamp dinámico */}
      <div
        className="prose dark:prose-invert text-gray-700 transition-all duration-200 ease-in-out"
        style={clampStyle}
      >
        {content}
      </div>

      {/* Gradiente + botón “Ver más” */}
      {!isExpanded && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent dark:from-gray-900" />
          <button
            onClick={toggle}
            className="absolute right-0 bottom-0 font-semibold text-indigo-500"
          >
            Ver más
          </button>
        </>
      )}

      {/* Botón “Ver menos” */}
      {isExpanded && (
        <div className="mt-4 flex justify-end">
          <button onClick={toggle} className="font-semibold text-indigo-500">
            Ver menos
          </button>
        </div>
      )}
    </div>
  );
}

CollapsibleDescription.defaultProps = {
  previewLines: 4,
  description: "",
};
