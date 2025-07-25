const URL_BACKEND_SUMMARY = process.env.EXPO_PUBLIC_URL_BACKEND_SUMMARY!;

export const generateSummary = async (
  notes: string
): Promise<string | null> => {

  try {
	console.log("---------------------------------");
	// const response = await fetch("http://192.168.1.14:8000/generateSummary", {
	const response = await fetch(URL_BACKEND_SUMMARY, {
	  method: "POST",
	  body: notes,
	});
	const text = await response.text();
	console.log("Réponse brute résumé :", text);
	if (!response.ok) {
		throw new Error(`Erreur HTTP : ${response.status}`);
	} else
		return text;
  } catch (error) {
	console.error("Erreur lors de l'envoi :", error);
	return null;
  }
};
