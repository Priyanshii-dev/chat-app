export type ChatMessage = {
  type: "message";
  from: string;
  to: string;
  message: string;
  timestamp: string;
};

export type UserListMessage = {
  type: "user_list";
  users: string[];
};

export type IncomingMessage = ChatMessage | UserListMessage;

export type MessagesByUser = Record<string, ChatMessage[]>;

export type ChatProps = {
  username: string;
  selectedUser: string;
  messages: ChatMessage[];
  onSend: (text: string) => void;
  onClearChat: () => void;
};

export type LoginProps = {
  error: string;
  onConnect: (name: string) => void;
};

export type MsgProps = {
  message: ChatMessage;
  mine: boolean;
};

export type SidebarProps = {
  username: string;
  onlineUsers: string[];
  selectedUser: string | null;
  onSelectUser: (user: string) => void;
};