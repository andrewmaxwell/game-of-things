import { useState } from "react";
import { updateDb } from "../firebase";
import { Game, OnError } from "../types";

const saveCorrectGuess = (
  gameId: string,
  userId: string,
  guessedAnswer: string,
  onError: OnError
) =>
  updateDb(
    { [`games/${gameId}/players/${guessedAnswer}/guessedBy`]: userId },
    onError
  );

const reset = (gameId: string, game: Game, onError: OnError) => {
  const pathsToClear = [
    `games/${gameId}/prompt`,
    ...Object.keys(game.players).flatMap((id) => [
      `games/${gameId}/players/${id}/answer`,
      `games/${gameId}/players/${id}/guessedBy`,
    ]),
  ];
  updateDb(Object.fromEntries(pathsToClear.map((p) => [p, null])), onError);
};

type GuessFormProps = {
  gameId: string;
  userId: string;
  game: Game;
  onError: OnError;
};

export const GuessForm = ({
  gameId,
  userId,
  game,
  onError,
}: GuessFormProps) => {
  const [guessedPerson, setGuessedPerson] = useState("");
  const [guessedAnswer, setGuessedAnswer] = useState("");

  const submitGuess = async () => {
    if (guessedPerson === guessedAnswer) {
      await saveCorrectGuess(gameId, userId, guessedAnswer, onError);
    }
    setGuessedPerson("");
    setGuessedAnswer("");
  };

  const remainingPeople = Object.entries(game.players).filter(
    (p) => !p[1].guessedBy
  );

  return (
    <>
      <p>Choose a person:</p>
      {Object.entries(game.players).map(([id, p]) => (
        <div key={id}>
          <label>
            <input
              type="radio"
              checked={guessedPerson === id}
              onChange={() => setGuessedPerson(id)}
              disabled={!!p.guessedBy || id === userId}
            />
            {p.name}:{" "}
            {p.guessedBy
              ? `${p.answer} (${game.players[p.guessedBy].name})`
              : "???"}
          </label>
        </div>
      ))}

      {remainingPeople.length ? (
        <>
          <p>Choose what you think they wrote:</p>

          {remainingPeople.map(([id, p]) => (
            <div key={id}>
              <label>
                <input
                  type="radio"
                  checked={guessedAnswer === id}
                  onChange={() => setGuessedAnswer(id)}
                />
                {p.answer}
              </label>
            </div>
          ))}

          <button onClick={submitGuess}>Submit</button>
        </>
      ) : (
        <button onClick={() => reset(gameId, game, onError)}>Next Round</button>
      )}
    </>
  );
};
