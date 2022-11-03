export type OnError = (s: string) => void;

export enum GAME_STATE {
  NEW_GAME,
  ENTER_NAME,
  ANSWER,
  GUESS,
  DONE,
}

export type Game = {
  players: {
    [playerId: string]: { name?: string; answer?: string; guessedBy: string };
  };
  prompt: string;
};
