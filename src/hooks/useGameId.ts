import { useEffect, useState } from "react";

export const useGameId = () => {
  const [gameId, setGameId] = useState(location.hash.slice(1));

  useEffect(() => {
    const hashChange = () => {
      setGameId(location.hash.slice(1));
    };
    window.addEventListener("hashchange", hashChange);
    () => window.removeEventListener("hashchange", hashChange);
  }, []);

  return gameId;
};
