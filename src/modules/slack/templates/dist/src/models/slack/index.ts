export interface SlackUser {
  id: string;
  email?: string;
  fullName: string;
  photoUrl: string;
}

export interface SlackMessage {
  timestamp: Date;
  user: SlackUser;
  text: string;
  parsedText?: string;
}
