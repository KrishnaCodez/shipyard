import { useRef, useEffect } from "react";

export function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: {
  minHeight: number;
  maxHeight: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      Math.min(
        Math.max(textareaRef.current.scrollHeight, minHeight),
        maxHeight
      ) + "px";
  };

  useEffect(() => {
    adjustHeight();
  }, []); // Run once on mount

  return { textareaRef, adjustHeight };
}
