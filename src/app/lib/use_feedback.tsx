import { useRef } from "react";
import { APIResponse } from "../types/api_response";

const useFeedback = () => {
  const feedbackMessageRef = useRef<HTMLDivElement | null>(null);

  const updateMessage = async (
    response: Awaited<APIResponse<any>>
  ) => {

    feedbackMessageRef.current?.classList.remove(
      "text-green-300",
      "text-red-400",
      "text-blue-400",
      "hidden",
    );

    if (!response.success) {
      feedbackMessageRef.current?.classList.add("text-red-400");
      feedbackMessageRef.current!.textContent = response.message;
    } else {
      feedbackMessageRef.current!.classList.add("text-green-300");
      feedbackMessageRef.current!.textContent = "Operação bem sucedida";
    }
  };

  return { feedbackMessageRef, updateMessage };
};

export default useFeedback;