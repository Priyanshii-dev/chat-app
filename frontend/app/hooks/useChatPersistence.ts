import { useEffect, useRef } from "react";

import { loadMessages, saveMessages } from "../lib/storage";
import { MessagesByUser } from "../types/types";

interface Props {
  username: string;
  messages: MessagesByUser;
  setMessages: React.Dispatch<React.SetStateAction<MessagesByUser>>;
}

export function useChatPersistence({
  username,
  messages,
  setMessages,
}: Props) {
  const loaded = useRef(false);

  useEffect(() => {
    if (!username || loaded.current) return;

    setMessages(loadMessages(username));
    loaded.current = true;
  }, [username, setMessages]);

  useEffect(() => {
    if (!username) return;

    saveMessages(username, messages);
  }, [username, messages]);
}