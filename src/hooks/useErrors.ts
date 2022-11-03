import { useState } from "react";

export const useErrors = () => {
  const [errors, setErrors] = useState<string[]>([]);

  const onError = (err: string) => setErrors((e) => [...e, err]);

  const removeError = (err: string) =>
    setErrors((e) => e.filter((r) => r !== err));

  return { errors, removeError, onError };
};
