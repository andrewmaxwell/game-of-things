import { useState } from "react";
import { updateDb } from "../firebase";
import { OnError } from "../types";

const saveName = (
  gameId: string,
  userId: string,
  name: string,
  onError: OnError
) => updateDb({ [`games/${gameId}/players/${userId}/name`]: name }, onError);

type NameFormProps = {
  gameId: string;
  userId: string;
  onError: OnError;
};

export const NameForm = ({ gameId, userId, onError }: NameFormProps) => {
  const [name, setName] = useState("");
  return (
    <>
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={() => saveName(gameId, userId, name, onError)}>
        Submit
      </button>
    </>
  );
};
