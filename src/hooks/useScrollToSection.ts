import { useCallback } from "react";

export const useScrollToSection = () => {
  const scrollTo = useCallback((id: string) => {
    if (id === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return { scrollTo };
};
