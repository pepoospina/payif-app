import { Box } from "grommet";
import { useThemeContext } from "../../ui-components/ThemedApp";
import { CaretRigthIcon } from "../icons/CaretRightIcon";

export const SideButton = (props: { expanded: boolean }) => {
  const { expanded } = props;

  const { constants } = useThemeContext();

  return (
    <Box
      style={{
        width: "70px",
        height: "70px",
        padding: "12px",
        borderTopLeftRadius: "8px",
        borderBottomLeftRadius: "8px",
        borderLeft: "2px solid #ffffff",
        borderTop: "2px solid #ffffff",
        borderBottom: "2px solid #ffffff",
        zIndex: 10,
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          style={{
            transition: "transform 0.3s ease-in-out",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transformOrigin: "center center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {expanded ? (
            <CaretRigthIcon color={constants.colors.textOnPrimary} />
          ) : (
            <Box align="center" gap="small">
              <Box>o</Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

// Add CSS keyframes for the bounce animation
const style = document.createElement("style");
style.innerHTML = `
@keyframes bounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.5); }
  100% { transform: scale(1); }
}
`;
document.head.appendChild(style);
