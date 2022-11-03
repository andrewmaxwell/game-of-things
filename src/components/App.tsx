import { useState } from "react";
import { useErrors } from "../hooks/useErrors";
import { v4 } from "uuid";
import { Game, GAME_STATE } from "../types";
import { NameForm } from "./NameForm";
import { AnswerForm } from "./AnswerForm";
import { GuessForm } from "./GuessForm";
import { useGame } from "../hooks/useGame";
import { useGameId } from "../hooks/useGameId";
import { NewGameForm } from "./NewGameForm";
import pkg from "../../package.json";

const getUserId = (): string => (localStorage.id = localStorage.id || v4());

const getGameState = (userId: string, game: Game | undefined) => {
  if (!game) return GAME_STATE.NEW_GAME;
  if (!game.players || !game.players[userId]?.name)
    return GAME_STATE.ENTER_NAME;
  if (Object.values(game.players).some((p) => !p.answer))
    return GAME_STATE.ANSWER;
  return GAME_STATE.GUESS;
};

export const App = () => {
  const { errors, onError } = useErrors();
  const [userId] = useState(getUserId);
  const gameId = useGameId();
  const game = useGame(gameId, onError);
  const gameState = getGameState(userId, game);

  console.log(gameId, game);

  return (
    <div className="container">
      {errors.map((e, i) => (
        <p key={i}>{e}</p>
      ))}

      {gameState === GAME_STATE.NEW_GAME && <NewGameForm onError={onError} />}

      {gameId && (
        <p>Share the URL of this page to invite people to the game.</p>
      )}

      {gameState === GAME_STATE.ENTER_NAME && (
        <NameForm gameId={gameId} userId={userId} onError={onError} />
      )}

      {game && gameState === GAME_STATE.ANSWER && (
        <AnswerForm
          gameId={gameId}
          userId={userId}
          game={game}
          onError={onError}
        />
      )}

      {game && gameState === GAME_STATE.GUESS && (
        <GuessForm
          gameId={gameId}
          userId={userId}
          game={game}
          onError={onError}
        />
      )}

      <div style={{ position: "fixed", top: 0, right: 5 }}>v{pkg.version}</div>
    </div>
  );
};
