// use-is-onscreen.js
import React from "react";

function useIsOnscreen(elementRef: any) {
  const [isOnscreen, setIsOnscreen] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;

      setIsOnscreen(entry.isIntersecting);
    });

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [elementRef]);

  return isOnscreen;
}

export default useIsOnscreen;
