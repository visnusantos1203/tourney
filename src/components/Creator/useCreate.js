import { useReducer } from "react";
import { useHistory } from "react-router-dom";
import uniqid from "uniqid";

export default function useCreate(tournamentName) {
  const history = useHistory();
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    error: null,
  });

  const endPoint = `https://api.challonge.com/v2/tournaments.json`;
  const options = {
    method: "POST",
    headers: {
      Authorization: "RBPOlPeuprbZYFGh5ZZzapjSlEiLElU8tUsQbumv",
      "Authorization-type": "v1",
      "Content-type": "application/vnd.api+json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      data: {
        type: "Tournaments",
        attributes: {
          name: tournamentName,
          url: uniqid(),
          tournament_type: "single elimination",
        },
      },
    }),
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!tournamentName) {
      return;
    }
    try {
      dispatch({ type: "start" });
      const res = await fetch(endPoint, options);
      const jsonData = await res.json();
      console.log(jsonData);
      dispatch({ type: "done" });
      history.push("/tournament");
    } catch (err) {
      console.log(err);
      dispatch({ type: "error", payload: "failed to add participant" });
    }
  }

  return {
    handleSubmit,
    isLoading: state.isLoading,
    error: state.error,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "start":
      return { ...state, isLoading: true };
    case "done":
      return { ...state, isLoading: false };
    case "error":
      return { ...state, isLoading: false, error: action.payload };
    default: {
      console.log("no such adder action");
      return state;
    }
  }
}
