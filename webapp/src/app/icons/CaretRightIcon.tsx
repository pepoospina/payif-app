export const CaretRigthIcon = (props: { size?: number; color?: string }) => {
  const size = props.size || 24;
  const color = props.color || "#000000";

  return (
    <svg
      viewBox="0 0 24 24"
      style={{ transform: "rotate(180deg)" }}
      width={size}
      height={size}
    >
      <path
        fill="none"
        stroke={color}
        strokeWidth="2"
        d="m6 2 12 10L6 22z"
      ></path>
    </svg>
  );
};
