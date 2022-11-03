import { useEffect, useState } from "react";
import { listen } from "../firebase";
import { Game, OnError } from "../types";

export const useGame = (gameId: string, onError: OnError) => {
  const [game, setGame] = useState<Game | undefined>();

  useEffect(() => {
    if (gameId) return listen(`games/${gameId}`, setGame, onError);
  }, [gameId]);

  return game;
};
