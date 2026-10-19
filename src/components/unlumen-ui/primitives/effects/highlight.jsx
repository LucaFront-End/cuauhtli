import React, { createContext, useContext, useState, useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const HighlightContext = createContext(null);

export function Highlight({
  children,
  className,
  containerClassName,
  style,
  mode = "parent",
  hover = true,
  controlledItems = false,
  ...props
}) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <HighlightContext.Provider value={{ hoveredId, setHoveredId, highlightClassName: className }}>
      <div 
        className={cn("hl-container", containerClassName)} 
        style={{ position: 'relative', display: 'flex', alignItems: 'center', ...style }} 
        {...props}
      >
        {children}
      </div>
    </HighlightContext.Provider>
  );
}

export function HighlightItem({ children, asChild = false, className, id, style, ...props }) {
  const context = useContext(HighlightContext);
  const autoId = useId();
  const itemId = id || autoId;
  const isHovered = context?.hoveredId === itemId;

  const handleMouseEnter = () => {
    context?.setHoveredId(itemId);
  };

  const handleMouseLeave = () => {
    if (context?.hoveredId === itemId) {
      context?.setHoveredId(null);
    }
  };

  if (asChild && React.isValidElement(children)) {
    return (
      <div 
        className="hl-item-wrap"
        style={{ 
          position: 'relative', 
          display: 'inline-flex', 
          alignItems: 'center',
          ...style 
        }}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
      >
        {isHovered && (
          <motion.div
            layoutId="highlight-pill"
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '10px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #DBEAFE',
              pointerEvents: 'none',
              zIndex: 0,
            }}
            className={context?.highlightClassName}
          />
        )}
        {React.cloneElement(children, {
          ...props,
          style: {
            position: 'relative',
            zIndex: 1,
            ...children.props.style,
          }
        })}
      </div>
    );
  }

  return (
    <div
      className={cn("hl-item-wrap", className)}
      style={{ 
        position: 'relative', 
        display: 'inline-flex', 
        alignItems: 'center',
        ...style 
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {isHovered && (
        <motion.div
          layoutId="highlight-pill"
          transition={{ type: "spring", stiffness: 450, damping: 32 }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '10px',
            backgroundColor: '#EFF6FF',
            border: '1px solid #DBEAFE',
            pointerEvents: 'none',
            zIndex: 0,
          }}
          className={context?.highlightClassName}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center' }}>
        {children}
      </div>
    </div>
  );
}

export default Highlight;
