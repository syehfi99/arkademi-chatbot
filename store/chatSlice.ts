// store/chatSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "@/lib/firebaseConf"; // Adjust the path as needed
import { collection, onSnapshot, query } from "firebase/firestore";

interface Chat {
  userId: string;
  sessionId: string;
  title: string;
  history: any[];
  model: string;
}

interface ChatState {
  historyChat: Chat[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  historyChat: [],
  loading: false,
  error: null,
};

// Thunk to fetch chat history in real-time
export const fetchChatHistory = createAsyncThunk<Chat[], string>(
  "chat/fetchChatHistory",
  async (user: string) => {
    return new Promise<Chat[]>((resolve, reject) => {
      const unsubscribe = onSnapshot(
        query(collection(db, "chats")),
        (querySnapshot) => {
          const chats: Chat[] = [];
          querySnapshot.forEach((doc) => {
            const data = { ...doc.data() } as Chat; // Clone the data

            // Filter chats based on userId
            if (data.userId === user) {
              chats.push(data);
            }
          });
          resolve(chats); // Resolve with updated chats
        },
        (error) => {
          reject(error);
        }
      );

      // Return unsubscribe function to be called later
      return () => unsubscribe();
    });
  }
);

// Create slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true; // Set loading to true while fetching
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false; // Fetching done
        state.historyChat = action.payload; // Update the historyChat state
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false; // Fetching failed
        state.error = action.error.message || "Failed to fetch chat history"; // Set error message
      });
  },
});

// Export the reducer
export const { reducer } = chatSlice;
export default reducer;
