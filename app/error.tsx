"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.log(error);
  });
  return (
    <div>
      <h2>Upsy!</h2>
      <button onClick={() => reset()}>
        Dame aquí para intentarlo de nuevo
      </button>
    </div>
  );
}
