import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Highlight,
  HighlightItem,
} from "@/components/unlumen-ui/primitives/effects/highlight";

const MotionNavigationMenuContext = React.createContext(null);
const MotionNavigationMenuItemContext = React.createContext(null);

const contentVariants = {
  initial: (direction) => ({ x: `${100 * direction}%`, opacity: 0 }),
  active: { x: "0%", opacity: 1 },
  exit: (direction) => ({ x: `${-100 * direction}%`, opacity: 0 }),
};

export const MotionNavigationMenu = React.forwardRef(function MotionNavigationMenu(
  {
    className,
    children,
    viewport = true,
    viewportClassName,
    springBounce = 0,
    springStiffness = 380,
    springDamping = 32,
    value,
    onValueChange,
    onPointerLeave,
    onKeyDown,
    style,
    ...props
  },
  ref
) {
  const rootRef = React.useRef(null);
  const frameRef = React.useRef(null);
  const lastActiveValueRef = React.useRef(value ?? "");
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState("");
  const [direction, setDirection] = React.useState(1);
  const [viewportX, setViewportX] = React.useState(null);
  const [contentByValue, setContentByValue] = React.useState({});

  const activeValue = value ?? internalValue;

  const spring = React.useMemo(
    () => ({
      type: "spring",
      bounce: springBounce,
      stiffness: springStiffness,
      damping: springDamping,
    }),
    [springBounce, springStiffness, springDamping]
  );

  const getItemValues = React.useCallback(() => {
    const root = rootRef.current;
    if (!root) return [];
    return Array.from(
      root.querySelectorAll('[data-slot="navigation-menu-item"][data-value]'),
      (item) => item.dataset.value ?? ""
    ).filter(Boolean);
  }, []);

  const updateViewportPosition = React.useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      const root = rootRef.current;
      if (!root) return;

      const rootRect = root.getBoundingClientRect();
      const activeTrigger = root.querySelector(
        '[data-slot="navigation-menu-trigger"][data-state="open"]'
      );

      if (!activeTrigger) {
        setViewportX(rootRect.width / 2);
        return;
      }

      const triggerRect = activeTrigger.getBoundingClientRect();
      const idealX = triggerRect.left - rootRect.left + triggerRect.width / 2;

      const measureEl = root.querySelector('[data-slot="navigation-menu-measure"]');
      const viewportEl = root.querySelector('[data-slot="navigation-menu-viewport"]');
      const contentWidth =
        (measureEl ? measureEl.offsetWidth : 0) ||
        (viewportEl ? viewportEl.offsetWidth : 0);
      const half = contentWidth / 2;

      if (contentWidth > 0) {
        let boundary = null;
        let ancestor = root.parentElement;
        while (ancestor && ancestor !== document.body) {
          const styleComputed = window.getComputedStyle(ancestor);
          const overflow = styleComputed.overflow + styleComputed.overflowX;
          if (/hidden|clip|scroll|auto/.test(overflow)) {
            boundary = ancestor.getBoundingClientRect();
            break;
          }
          ancestor = ancestor.parentElement;
        }
        if (!boundary) {
          boundary = document.documentElement.getBoundingClientRect();
        }

        const margin = 12;
        const dropLeft = rootRect.left + idealX - half;
        const dropRight = rootRect.left + idealX + half;

        let adjustment = 0;
        if (dropLeft < boundary.left + margin) {
          adjustment = boundary.left + margin - dropLeft;
        } else if (dropRight > boundary.right - margin) {
          adjustment = boundary.right - margin - dropRight;
        }

        setViewportX(idealX + adjustment);
      } else {
        setViewportX(idealX);
      }
    });
  }, []);

  const setRootRef = React.useCallback(
    (node) => {
      rootRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  const setActiveValue = React.useCallback(
    (nextValue) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange]
  );

  const openValue = React.useCallback(
    (nextValue) => {
      if (!nextValue || nextValue === lastActiveValueRef.current) {
        return;
      }

      const itemValues = getItemValues();
      const previousIndex = itemValues.indexOf(lastActiveValueRef.current);
      const nextIndex = itemValues.indexOf(nextValue);

      if (previousIndex !== -1 && nextIndex !== -1) {
        setDirection(nextIndex > previousIndex ? 1 : -1);
      }

      lastActiveValueRef.current = nextValue;
      setActiveValue(nextValue);
      updateViewportPosition();
    },
    [getItemValues, setActiveValue, updateViewportPosition]
  );

  const closeMenu = React.useCallback(() => {
    lastActiveValueRef.current = "";
    setActiveValue("");
    updateViewportPosition();
  }, [setActiveValue, updateViewportPosition]);

  const registerContent = React.useCallback((value, content) => {
    setContentByValue((current) => {
      const previous = current[value];
      if (
        previous?.children === content.children &&
        previous?.className === content.className &&
        previous?.innerClassName === content.innerClassName
      ) {
        return current;
      }
      return { ...current, [value]: content };
    });

    return () => {
      setContentByValue((current) => {
        if (!current[value]) return current;
        const next = { ...current };
        delete next[value];
        return next;
      });
    };
  }, []);

  React.useEffect(() => {
    if (value === undefined) return;
    if (!value) {
      lastActiveValueRef.current = "";
      return;
    }
    openValue(value);
  }, [openValue, value]);

  React.useLayoutEffect(() => {
    updateViewportPosition();
  }, [activeValue, updateViewportPosition]);

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") {
      return () => {
        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
        }
      };
    }

    const observer = new ResizeObserver(updateViewportPosition);
    observer.observe(root);

    return () => {
      observer.disconnect();
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [updateViewportPosition]);

  React.useEffect(() => {
    function handlePointerDown(event) {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [closeMenu]);

  const contextValue = React.useMemo(
    () => ({
      activeValue,
      direction,
      spring,
      viewport,
      viewportX,
      openValue,
      closeMenu,
      registerContent,
      updateViewportPosition,
    }),
    [
      activeValue,
      closeMenu,
      direction,
      openValue,
      registerContent,
      spring,
      updateViewportPosition,
      viewport,
      viewportX,
    ]
  );

  return (
    <MotionNavigationMenuContext.Provider value={contextValue}>
      <nav
        ref={setRootRef}
        data-slot="navigation-menu"
        data-viewport={viewport}
        className={cn("mnm-root", className)}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...style,
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          closeMenu();
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.key === "Escape") {
            closeMenu();
          }
        }}
        {...props}
      >
        {children}
        {viewport && (
          <MotionNavigationMenuViewport
            className={viewportClassName}
            contentByValue={contentByValue}
          />
        )}
      </nav>
    </MotionNavigationMenuContext.Provider>
  );
});

export const MotionNavigationMenuList = React.forwardRef(function MotionNavigationMenuList(
  { className, highlightClassName, style, ...props },
  ref
) {
  return (
    <Highlight
      mode="parent"
      controlledItems
      hover
      className={highlightClassName}
      containerClassName="mnm-list-wrapper"
    >
      <ul
        ref={ref}
        data-slot="navigation-menu-list"
        className={cn("mnm-list", className)}
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          listStyle: "none",
          margin: 0,
          padding: 0,
          gap: "6px",
          ...style,
        }}
        {...props}
      />
    </Highlight>
  );
});

export const MotionNavigationMenuItem = React.forwardRef(function MotionNavigationMenuItem(
  { className, value, style, ...props },
  ref
) {
  const itemContextValue = React.useMemo(() => ({ value }), [value]);

  return (
    <MotionNavigationMenuItemContext.Provider value={itemContextValue}>
      <li
        ref={ref}
        data-slot="navigation-menu-item"
        data-value={value}
        className={cn("mnm-item", className)}
        style={{
          position: "relative",
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "inline-flex",
          alignItems: "center",
          ...style,
        }}
        {...props}
      />
    </MotionNavigationMenuItemContext.Provider>
  );
});

export const MotionNavigationMenuTrigger = React.forwardRef(function MotionNavigationMenuTrigger(
  { className, children, onPointerEnter, onFocus, onClick, style, ...props },
  ref
) {
  const context = React.useContext(MotionNavigationMenuContext);
  const itemContext = React.useContext(MotionNavigationMenuItemContext);
  const value = itemContext?.value;
  const isOpen = !!value && context?.activeValue === value;

  return (
    <HighlightItem asChild>
      <button
        ref={ref}
        type="button"
        data-slot="navigation-menu-trigger"
        data-state={isOpen ? "open" : "closed"}
        aria-expanded={isOpen}
        className={cn("mnm-trigger", className)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          padding: "8px 14px",
          borderRadius: "8px",
          fontSize: "0.84rem",
          fontWeight: 600,
          color: isOpen ? "var(--primary, #2563EB)" : "var(--text-secondary, #334155)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          outline: "none",
          transition: "color 0.18s ease",
          fontFamily: "var(--font-sans, inherit)",
          whiteSpace: "nowrap",
          ...style,
        }}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          if (value) context?.openValue(value);
        }}
        onFocus={(event) => {
          onFocus?.(event);
          if (value) context?.openValue(value);
        }}
        onClick={(event) => {
          onClick?.(event);
          if (value) context?.openValue(value);
        }}
        {...props}
      >
        {children}
        <motion.span
          aria-hidden="true"
          animate={{
            rotate: isOpen ? 180 : 0,
            y: isOpen ? 1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
          }}
          style={{ display: "inline-flex", alignItems: "center" }}
        >
          <ChevronDown style={{ width: 13, height: 13, strokeWidth: 2.2 }} aria-hidden="true" />
        </motion.span>
      </button>
    </HighlightItem>
  );
});

export function MotionNavigationMenuContent({
  className,
  highlightClassName,
  innerClassName,
  children,
}) {
  const context = React.useContext(MotionNavigationMenuContext);
  const itemContext = React.useContext(MotionNavigationMenuItemContext);
  const value = itemContext?.value;
  const isOpen = !!value && context?.activeValue === value;

  React.useLayoutEffect(() => {
    if (!context || !value || !context.viewport) {
      return;
    }

    return context.registerContent(value, {
      children,
      className,
      highlightClassName,
      innerClassName,
    });
  }, [children, className, context, highlightClassName, innerClassName, value]);

  if (!context || !value || context.viewport) {
    return null;
  }

  return (
    <AnimatePresence initial={false} custom={context.direction}>
      {isOpen && (
        <motion.div
          data-slot="navigation-menu-content"
          key={value}
          custom={context.direction}
          variants={contentVariants}
          initial="initial"
          animate="active"
          exit="exit"
          transition={context.spring}
          className={cn("mnm-content-floating", className)}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 50,
            marginTop: "12px",
            background: "rgba(255, 255, 255, 0.98)",
            borderRadius: "20px",
            border: "1px solid rgba(226, 232, 240, 0.9)",
            padding: "20px",
            boxShadow: "0 20px 48px -12px rgba(15, 23, 42, 0.12)",
          }}
        >
          <MotionNavigationMenuContentInner
            highlightClassName={highlightClassName}
            innerClassName={innerClassName}
          >
            {children}
          </MotionNavigationMenuContentInner>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MotionNavigationMenuContentInner({
  highlightClassName,
  innerClassName,
  children,
}) {
  return (
    <Highlight
      mode="parent"
      controlledItems
      hover
      className={highlightClassName}
    >
      <div className={innerClassName} style={{ position: "relative", zIndex: 10 }}>
        {children}
      </div>
    </Highlight>
  );
}

export function MotionNavigationMenuViewport({ className, contentByValue }) {
  const context = React.useContext(MotionNavigationMenuContext);
  const measureRef = React.useRef(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const [lastSize, setLastSize] = React.useState({ width: 0, height: 0 });
  const activeContent =
    context?.activeValue && contentByValue
      ? contentByValue[context.activeValue]
      : undefined;

  React.useLayoutEffect(() => {
    const node = measureRef.current;
    if (!node || !activeContent) return;

    const updateSize = () => {
      const rect = node.getBoundingClientRect();
      const nextSize = {
        width: rect.width,
        height: rect.height,
      };

      setSize(nextSize);
      if (nextSize.width > 0 || nextSize.height > 0) {
        setLastSize(nextSize);
      }
      context?.updateViewportPosition();
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(updateSize);
    observer.observe(node);

    return () => observer.disconnect();
  }, [activeContent, context]);

  const width = size.width > 0 ? size.width : lastSize.width;
  const height = size.height > 0 ? size.height : lastSize.height;

  return (
    <motion.div
      style={{
        position: "absolute",
        top: "100%",
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        transform: "translateX(-50%)",
        pointerEvents: activeContent ? "auto" : "none",
      }}
      initial={false}
      animate={{ left: context?.viewportX ?? "50%" }}
      transition={context?.spring}
    >
      <motion.div
        data-slot="navigation-menu-viewport"
        initial={false}
        animate={{
          width: activeContent ? width : 0,
          height: activeContent ? height : 0,
          opacity: activeContent ? 1 : 0,
          scale: activeContent ? 1 : 0.96,
        }}
        transition={context?.spring}
        className={cn("mnm-viewport", className)}
        style={{
          position: "relative",
          marginTop: "12px",
          overflow: "hidden",
          borderRadius: "18px",
          background: "rgba(255, 255, 255, 0.98)",
          border: "1px solid rgba(226, 232, 240, 0.95)",
          boxShadow: "0 20px 48px -12px rgba(15, 23, 42, 0.12), 0 2px 8px rgba(15, 23, 42, 0.04)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <AnimatePresence
          mode="popLayout"
          initial={false}
          custom={context?.direction ?? 1}
        >
          {activeContent && context?.activeValue && (
            <motion.div
              data-slot="navigation-menu-content"
              key={context.activeValue}
              custom={context.direction}
              variants={contentVariants}
              initial="initial"
              animate="active"
              exit="exit"
              transition={context.spring}
              className={activeContent.className}
              style={{ padding: "16px" }}
            >
              <MotionNavigationMenuContentInner
                highlightClassName={activeContent.highlightClassName}
                innerClassName={activeContent.innerClassName}
              >
                {activeContent.children}
              </MotionNavigationMenuContentInner>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div
        ref={measureRef}
        aria-hidden="true"
        data-slot="navigation-menu-measure"
        style={{
          position: "absolute",
          top: "12px",
          left: 0,
          visibility: "hidden",
          pointerEvents: "none",
          width: "max-content",
        }}
      >
        {activeContent && (
          <div className={activeContent.className} style={{ padding: "16px" }}>
            <MotionNavigationMenuContentInner
              highlightClassName={activeContent.highlightClassName}
              innerClassName={activeContent.innerClassName}
            >
              {activeContent.children}
            </MotionNavigationMenuContentInner>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export const MotionNavigationMenuLink = React.forwardRef(function MotionNavigationMenuLink(
  { className, style, ...props },
  ref
) {
  return (
    <HighlightItem asChild>
      <a
        ref={ref}
        data-slot="navigation-menu-link"
        className={cn("mnm-link", className)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "8px 14px",
          borderRadius: "8px",
          fontSize: "0.84rem",
          fontWeight: 600,
          color: "var(--text-secondary, #334155)",
          textDecoration: "none",
          cursor: "pointer",
          outline: "none",
          transition: "color 0.18s ease",
          fontFamily: "var(--font-sans, inherit)",
          whiteSpace: "nowrap",
          ...style,
        }}
        {...props}
      />
    </HighlightItem>
  );
});

export default MotionNavigationMenu;
