import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConf';

export const saveChatHistory = async (
  // prompt: string,
  response: { role: string; content: string }[],
  user: string,
  sessionId: string,
  model: string
) => {
  // const title = prompt.split(' ').slice(0, 5).join(' ');
  // Store the session with the user's UID
  const chatDocRef = doc(db, "chats", sessionId);
  await setDoc(chatDocRef, {
    sessionId,
    // title,
    userId: user,
    history: response,
    model: model,
    createdAt: new Date(),
  });
};
