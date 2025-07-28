import { makeRedirectUri } from "expo-auth-session";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import {
  Account,
  Client,
  Databases,
  ID,
  OAuthProvider,
  Query,
} from "react-native-appwrite";
import bcrypt from "react-native-bcrypt";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_ID = process.env.EXPO_PUBLIC_APPWRITE_USERS_ID!;
const NOTES_ID = process.env.EXPO_PUBLIC_APPWRITE_NOTES_ID!;
const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);
const account = new Account(client);

export const createUserDb = async (
  fullName: string,
  email: string,
  password: string,
  setError: (value: string) => void
) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    let user;
    const result = await database.listDocuments(DATABASE_ID, USERS_ID, [
      Query.equal("username", [fullName]),
      Query.equal("email", [email]),
    ]);

    // check if a record of that search has already been stored
    if (result.documents.length > 0) {
      setError("You must choose an other password or username.");
      return false;
    } else {
      user = await database.createDocument(DATABASE_ID, USERS_ID, ID.unique(), {
        username: fullName,
        password: hashedPassword,
        email: email,
      });
    }
    await SecureStore.setItemAsync("userId", user.$id);
    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createUserDbGoogle = async (
  fullName: string,
  email: string,
  authId: string
) => {
  try {
	let user = await database.createDocument(DATABASE_ID, USERS_ID, ID.unique(), {
		username: fullName,
		email: email,
		authId: authId,
	});
    await SecureStore.setItemAsync("userId", user.$id);
    await SecureStore.setItemAsync("authId", authId);
    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const loginUserDb = async (
  email: string,
  password: string,
  setError: (value: string) => void
) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, USERS_ID, [
      Query.equal("email", [email]),
    ]);

    // check if a record of that search has already been stored
    if (result.documents.length === 0) {
      setError("Invalid email.");
      return false;
    } else {
      const user = result.documents[0];
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        setError("Invalid password.");
        return false;
      }
      await SecureStore.setItemAsync("userId", user.$id);
    }
    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserInfo = async (userId: string, authId: string) => {
  try {
    let result;

	if (authId){
		result = await database.listDocuments(DATABASE_ID, USERS_ID, [
			Query.equal("authId", [authId]),
		]);
	} else {
		result = await database.listDocuments(DATABASE_ID, USERS_ID, [
			Query.equal("$id", [userId]),
		]);
	}
    if (result.documents.length === 0) {
      return null;
    }
    return result.documents[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createNote = async (
  notes: string,
  noteName: string,
  noteId: string,
  userId: string | null
) => {
  try {
    if (!userId || !notes || notes.length === 0) return null;
    const name = !noteName ? new Date().toLocaleDateString("fr-FR") : noteName;

    if (noteId) {
      await database.updateDocument(DATABASE_ID, NOTES_ID, noteId, {
        users: userId,
        notes: notes,
        name: name,
      });
      return;
    }

    await database.createDocument(DATABASE_ID, NOTES_ID, ID.unique(), {
      users: userId,
      notes: notes,
      name: name,
    });
    return;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteNote = async (
  noteId: string,
) => {
  try {
    if (!noteId) return null;
	await database.deleteDocument(DATABASE_ID, NOTES_ID, noteId);
    return;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserNotes = async (userId: string | null) => {
  try {
    if (!userId) return null;
    const result = await database.listDocuments(DATABASE_ID, NOTES_ID, [
      Query.equal("users", [userId]),
    ]);
    if (result.documents.length === 0) {
      return [];
    }
    return result.documents;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const googleConnection = async () => {
  // Create deep link that works across Expo environments
  // Ensure localhost is used for the hostname to validation error for success/failure URLs
  const deepLink = new URL(makeRedirectUri({ preferLocalhost: true }));
  const scheme = `${deepLink.protocol}//`; // e.g. 'exp://' or 'appwrite-callback-<PROJECT_ID>://'

  // Start OAuth flow
  const loginUrl = await account.createOAuth2Token(
    OAuthProvider.Google,
    `${deepLink}`,
    `${deepLink}`
  );

  // Open loginUrl and listen for the scheme redirect
  const result = await WebBrowser.openAuthSessionAsync(`${loginUrl}`, scheme);

  // Extract credentials from OAuth redirect URL
  if (result.type === "success" && result.url) {
    const url = new URL(result.url);
    const secret = url.searchParams.get("secret");
    const userId = url.searchParams.get("userId");

    if (userId && secret) {
      try {
        // Vérifier d'abord si une session existe déjà
        try {
			const currentAccount = await account.get();
			console.log("Existing session...");
			// await account.deleteSession("current");
			await SecureStore.setItemAsync("userId", currentAccount.$id);
        } catch {
			// Pas de session existante, on peut en créer une nouvelle
			console.log("Creating new session...");
			await account.createSession(userId, secret);
			const currentAccount = await account.get();
			await createUserDbGoogle(currentAccount.name, currentAccount.email, currentAccount.$id);
        }
      } catch (error) {
        console.error("Session creation failed:", error);
		return;
      }
    }
    router.push("/(tabs)/profile");
  }
};

export const facebookConnection = async () => {
  // Create deep link that works across Expo environments
  // Ensure localhost is used for the hostname to validation error for success/failure URLs
  const deepLink = new URL(makeRedirectUri({ preferLocalhost: true }));
  const scheme = `${deepLink.protocol}//`; // e.g. 'exp://' or 'appwrite-callback-<PROJECT_ID>://'

  // Start OAuth flow
  const loginUrl = await account.createOAuth2Token(
    OAuthProvider.Facebook,
    `${deepLink}`,
    `${deepLink}`
  );

  // Open loginUrl and listen for the scheme redirect
  const result = await WebBrowser.openAuthSessionAsync(`${loginUrl}`, scheme);

  // Extract credentials from OAuth redirect URL
  if (result.type === "success" && result.url) {
    const url = new URL(result.url);
    const secret = url.searchParams.get("secret");
    const userId = url.searchParams.get("userId");

    if (userId && secret) {
      try {
        // Vérifier d'abord si une session existe déjà
        try {
			const currentAccount = await account.get();
			console.log("Existing session...");
			// await account.deleteSession("current");
			await SecureStore.setItemAsync("userId", currentAccount.$id);
        } catch {
			// Pas de session existante, on peut en créer une nouvelle
			console.log("Creating new session...");
			await account.createSession(userId, secret);
			const currentAccount = await account.get();
			await createUserDbGoogle(currentAccount.name, currentAccount.email, currentAccount.$id);
        }
      } catch (error) {
        console.error("Session creation failed:", error);
		return;
      }
    }
    router.push("/(tabs)/profile");
  }
};
