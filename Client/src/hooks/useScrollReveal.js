import { useEffect } from "react";

export default function useScrollReveal(ref) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    element.classList.add("has-scroll-reveal");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      element.classList.add("is-visible");
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      element.classList.toggle("is-visible", entry.isIntersecting);
    }, { threshold: 0.18 });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
}
