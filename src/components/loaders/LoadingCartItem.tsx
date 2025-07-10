export default function LoadingCartItem() {
  return (
    <div className="flex animate-pulse">
      {/* Placeholder de imagen */}
      <div className="mr-4 shrink-0">
        <div className="h-16 w-16 rounded bg-gray-200" />
      </div>

      {/* Placeholder de texto */}
      <div className="flex-1 space-y-2 py-1">
        {/* Dos líneas de título */}
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />

        {/* Línea de precio */}
        <div className="mt-2 h-4 w-1/4 rounded bg-gray-200" />
      </div>
    </div>
  );
}
