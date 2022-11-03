import { v4 } from "uuid";
import { updateDb } from "../firebase";
import { OnError } from "../types";

const startGame = async (onError: OnError) => {
  const gameId = v4();
  await updateDb({ [`games/${gameId}`]: { prompt: "" } }, onError);
  location.hash = gameId;
};

type NewGameFormProps = {
  onError: OnError;
};

export const NewGameForm = ({ onError }: NewGameFormProps) => (
  <button onClick={() => startGame(onError)}>New Game</button>
);
