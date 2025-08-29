import { EyeIcon } from "./EyeIcon";
import { RotateHorizontally } from "./RotateHorizontally";

export const AnimatedEyeIcon = (props: {
  size?: number;
  color?: string;
  animationDuration?: number;
}) => {
  const { size, color, animationDuration = 2 } = props;

  return (
    <RotateHorizontally
      style={{
        animationDuration: `${animationDuration}s`,
      }}
    >
      <EyeIcon size={size} color={color} />
    </RotateHorizontally>
  );
};
