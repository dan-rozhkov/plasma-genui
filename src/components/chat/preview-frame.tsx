import { useRef, useState, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { StyleSheetManager } from "styled-components";
import { FloatingPortal } from "@floating-ui/react";
import { cn } from "@/lib/utils";

interface PreviewFrameProps {
  children: ReactNode;
  width: string;
  darkMode: boolean;
  glowing?: boolean;
}

export function PreviewFrame({ children, width, darkMode, glowing }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLDivElement | null>(null);
  const [iframeHead, setIframeHead] = useState<HTMLHeadElement | null>(null);
  const iframeBodyRef = useRef<HTMLElement | null>(null);
  const [showGlow, setShowGlow] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (glowing) {
      setShowGlow(true);
      setFading(false);
    } else if (showGlow) {
      setFading(true);
      const timer = setTimeout(() => {
        setShowGlow(false);
        setFading(false);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [glowing]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      // Copy all styles from parent head into iframe head
      const styleElements = document.querySelectorAll(
        'style, link[rel="stylesheet"]',
      );
      styleElements.forEach((el) => {
        doc.head.appendChild(el.cloneNode(true));
      });


      // Reset iframe body margin
      doc.body.style.margin = "0";
      doc.body.style.overflow = "hidden";

      // Create mount point
      const mount = doc.createElement("div");
      mount.id = "portal-root";
      doc.body.appendChild(mount);

      setIframeHead(doc.head);
      iframeBodyRef.current = doc.body;
      setMountNode(mount);
    };

    iframe.addEventListener("load", handleLoad);
    // For about:blank, load may have already fired
    if (iframe.contentDocument?.readyState === "complete") {
      handleLoad();
    }

    return () => iframe.removeEventListener("load", handleLoad);
  }, []);

  // Sync dark mode class on iframe html element
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    doc.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode, mountNode]);

  // Auto-resize iframe height to fit content
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    const iframe = iframeRef.current;
    if (!doc || !iframe || !mountNode) return;

    const ro = new ResizeObserver(() => {
      const height = doc.documentElement.scrollHeight;
      iframe.style.height = height + "px";
    });
    ro.observe(doc.body);

    return () => ro.disconnect();
  }, [mountNode]);

  return (
    <div
      className={cn(showGlow && "glow-border", fading && "glow-fade")}
      style={{
        width: width === "100%" ? "calc(100% - 6rem)" : width,
        marginTop: "4rem",
        marginInline: "auto",
        borderRadius: "var(--radius-xl)",
      }}
    >
      <iframe
        ref={iframeRef}
        style={{
          border: "none",
          width: "100%",
          height: "0",
          display: "block",
          borderRadius: "inherit",
          overflow: "hidden",
        }}
      >
        {mountNode &&
          iframeHead &&
          createPortal(
            <StyleSheetManager target={iframeHead}>
              <FloatingPortal root={iframeBodyRef}>
                {children}
              </FloatingPortal>
            </StyleSheetManager>,
            mountNode,
          )}
      </iframe>
    </div>
  );
}
