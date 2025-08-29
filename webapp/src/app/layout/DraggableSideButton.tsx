import React from "react";
import { Box } from "grommet";
import { ReactNode, useState, useEffect, useRef, useMemo } from "react";
import { usePersist } from "../../utils/use.persist";
import { useResponsive } from "../../ui-components/ResponsiveApp";

interface DraggableSideButtonProps {
  children: ReactNode;
  onClick?: () => void;
  persistKey?: string;
  defaultPosition?: number;
  style?: React.CSSProperties;
}

export const DraggableSideButton = ({
  children,
  onClick,
  persistKey = "draggableButtonPosition",
  defaultPosition,
  style = {},
}: DraggableSideButtonProps) => {
  const { mobile } = useResponsive();

  // Calculate default position based on mobile/desktop
  const defaultPos = useMemo(() => {
    if (defaultPosition !== undefined) return defaultPosition;
    return mobile ? window.innerHeight - 300 : 60;
  }, [defaultPosition, mobile]);

  // State for button position - persisted between sessions
  const [buttonPosition, setButtonPosition] = usePersist<number>(
    persistKey,
    defaultPos
  );

  // Local state for tracking position during drag
  const [currentPosition, setCurrentPosition] = useState<number>(
    buttonPosition || defaultPos
  );

  // Update local position when persisted position changes (e.g., on initial load)
  useEffect(() => {
    setCurrentPosition(buttonPosition || defaultPos);
  }, [buttonPosition, defaultPos]);

  // Refs for drag functionality
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dragDistance = useRef(0); // Track drag distance to distinguish between drag and click

  // Add event listeners for drag movement and release - only once on component mount
  useEffect(() => {
    // Helper function to handle position updates during dragging
    const updatePosition = (clientY: number) => {
      if (!isDragging.current) return;

      const newPosition = clientY - dragStartY.current;

      // Calculate drag distance (absolute value of movement)
      dragDistance.current += Math.abs(newPosition - currentPosition);

      // Constrain to viewport bounds
      const maxY = window.innerHeight - 140; // Leave some space at bottom
      const minY = 20; // Leave some space at top
      const constrainedPosition = Math.min(Math.max(newPosition, minY), maxY);

      // Only update the local position during dragging
      setCurrentPosition(constrainedPosition);
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default browser behavior like pull-to-refresh
      e.preventDefault();
      updatePosition(e.touches[0].clientY);
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        // When dragging ends, update the persisted position
        setButtonPosition(currentPosition);
        isDragging.current = false;
      }
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleMouseUp);

    // Clean up
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this only runs once on mount

  const handleClick = () => {
    // Only trigger onClick if the user didn't drag (or dragged very little)
    if (dragDistance.current < 5 && onClick) {
      onClick();
    }
  };

  return (
    <Box
      ref={buttonRef}
      style={{
        position: "absolute",
        right: "0px",
        top: `${currentPosition}px`,
        zIndex: 10,
        cursor: "move",
        ...style,
      }}
      onMouseDown={(e) => {
        isDragging.current = true;
        dragStartY.current = e.clientY - currentPosition;
        dragDistance.current = 0;
        e.preventDefault(); // Prevent text selection during drag
      }}
      onTouchStart={(e) => {
        isDragging.current = true;
        dragStartY.current = e.touches[0].clientY - currentPosition;
        dragDistance.current = 0;
        e.preventDefault(); // Prevent scrolling during drag
        e.stopPropagation(); // Stop event propagation
      }}
      onClick={handleClick}
    >
      {children}
    </Box>
  );
};
