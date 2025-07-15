interface LoadingBarProps {
  /** Tailwind width class (e.g. 'w-full', 'w-1/2', 'w-32') */
  width?: string;
  /** Tailwind height class (defaults to a thin bar) */
  height?: string;
  /** Additional Tailwind classes */
  className?: string;
}

export default function LoadingBar({
  width = "w-full",
  height = "h-2",
  className = "",
}: LoadingBarProps) {
  return (
    <div
      role="status"
      className={`animate-pulse rounded bg-gray-200 ${width} ${height} ${className}`}
    />
  );
}

LoadingBar.defaultProps = {
  width: "w-full",
  height: "h-2",
  className: "",
};
