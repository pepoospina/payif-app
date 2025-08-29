import { keyframes } from "styled-components";
import styled from "styled-components";
import { Box } from "grommet";

// Define the horizontal rotation animation
const rotateHorizontally = keyframes`
  0% {
    transform: rotateX(0deg);
  }
  50% {
    transform: rotateX(180deg);
  }
  100% {
    transform: rotateX(360deg);
  }
`;

// Create a styled container for the animation
export const RotateHorizontally = styled(Box)`
  animation: ${rotateHorizontally} 2s infinite ease-in-out;
  transform-style: preserve-3d;
  display: inline-block;
`;

const rotateVertically = keyframes`
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(360deg);
  }
`;

// Create a styled container for the animation
export const RotateVertically = styled(Box)`
  animation: ${rotateVertically} 2s infinite ease-in-out;
  transform-style: preserve-3d;
  display: inline-block;
`;
