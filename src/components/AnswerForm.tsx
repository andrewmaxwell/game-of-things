import { useState } from "react";
import { updateDb } from "../firebase";
import { Game, OnError } from "../types";

const setPrompt = (gameId: string, prompt: string, onError: OnError) =>
  updateDb({ [`games/${gameId}/prompt`]: prompt }, onError);

const submitAnswer = (
  gameId: string,
  userId: string,
  answer: string,
  onError: OnError
) =>
  updateDb({ [`games/${gameId}/players/${userId}/answer`]: answer }, onError);

const kick = async (
  gameId: string,
  userId: string,
  userName: string,
  onError: OnError
) => {
  if (confirm(`Are you sure you want to kick ${userName}?`)) {
    await updateDb({ [`games/${gameId}/players/${userId}`]: null }, onError);
  }
};

type AnswerFormProps = {
  gameId: string;
  userId: string;
  game: Game;
  onError: OnError;
};

export const AnswerForm = ({
  gameId,
  userId,
  game,
  onError,
}: AnswerFormProps) => {
  const [answer, setAnswer] = useState("");
  const waiting = Object.values(game.players)
    .filter((p) => !p.answer)
    .map((p) => p.name)
    .join(", ");
  return (
    <>
      {!game.players[userId].answer && (
        <>
          <textarea
            placeholder="Enter the Prompt"
            value={game.prompt || ""}
            onChange={(e) => setPrompt(gameId, e.target.value, onError)}
          />

          <input
            type="text"
            placeholder="Your Answer"
            value={answer || ""}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button onClick={() => submitAnswer(gameId, userId, answer, onError)}>
            Submit
          </button>
        </>
      )}

      <p style={{ marginBottom: 200 }}>Waiting for {waiting}</p>

      <p>In case someone leaves:</p>
      {Object.entries(game.players)
        .filter(([id, p]) => id !== userId && !p.answer)
        .map(([id, p]) => (
          <button
            key={id}
            onClick={() => kick(gameId, id, p.name || "???", onError)}
          >
            Kick {p.name}
          </button>
        ))}
    </>
  );
};
