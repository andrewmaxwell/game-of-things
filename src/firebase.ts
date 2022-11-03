import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { ref, getDatabase, update, onValue, off } from "firebase/database";
import { OnError } from "./types";

const app = initializeApp({
  apiKey: "AIzaSyBdq-ftq1MqK0YqJYlphDoBW-Pk-w_Hi-Q",
  authDomain: "game-of-things-cfb14.firebaseapp.com",
  projectId: "game-of-things-cfb14",
  storageBucket: "game-of-things-cfb14.appspot.com",
  messagingSenderId: "561239950813",
  appId: "1:561239950813:web:5fb371150554d893192234",
  measurementId: "G-7EQLSVD1Z0",
});
if (typeof window !== "undefined") getAnalytics(app);

const db = getDatabase();
const dbRef = ref(db);

// {path1: val1, path2: val2}
export const updateDb = (updates: object, onError: OnError) => {
  try {
    // console.log('updates', updates);
    return update(dbRef, updates);
  } catch (e) {
    console.error(e);
    onError((e as Error).message);
  }
};

if (typeof location !== "undefined" && location.host === "localhost:3000") {
  (window as any).update = async (x: object) => await update(dbRef, x);
}

export const listen = (
  pathStr: string,
  onChange: (s: any) => void,
  onError: OnError
) => {
  try {
    const r = ref(db, pathStr);
    onValue(r, (snapshot) => onChange(snapshot.val() || {}));
    return () => off(r);
  } catch (e) {
    console.error(e);
    onError((e as Error).message);
  }
};
