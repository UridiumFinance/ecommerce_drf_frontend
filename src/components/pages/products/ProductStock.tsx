import classNames from "@/utils/classnames";

interface Props {
  stock?: number;
}

export default function ProductStock({ stock = 0 }: Props) {
  return (
    <span
      className={classNames("text-sm font-medium", {
        "text-red-500": stock < 15,
        "text-gray-700": stock >= 15,
      })}
    >
      Stock: {stock}
    </span>
  );
}

ProductStock.defaultProps = {
  stock: 0,
};
