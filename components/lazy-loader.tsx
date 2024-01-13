"use client";
import { FC, useEffect, useState } from "react";

export interface LazyLoaderProps {
  delay?: number;
}

const LazyLoader: FC<LazyLoaderProps> = ({ delay = 250, ...props }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [delay]);

  return show ? (
    <div {...props}>
      <span className="text-9xl">🌀</span>Connecting to agent...
    </div>
  ) : null;
};

export { LazyLoader as default };
