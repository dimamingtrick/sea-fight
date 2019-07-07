import { useState } from "react";

const useSetStateHook = initialState => {
  const [state, setState] = useState(initialState);
  const updateState = newState => {
    setState({ ...state, ...newState });
  };
  return [state, updateState];
};

export default useSetStateHook;
