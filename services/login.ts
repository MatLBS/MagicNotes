import { loginUserDb } from "@/services/appwrite"

export interface ValidationError {
  field: string;
  message: string;
}

export interface RegisterData {
  email: string;
  password: string;
  setError: (value: string) => void;
}

export async function validateLogin(data: RegisterData): Promise<boolean> {
  const { email, password } = data;

  // Vérification des champs vides
  if (!email || email.trim() === '') {
	data.setError('You must provide an email');
	return false;
  }

  if (!password || password.trim() === '') {
	data.setError('You must provide a password');
	return false;
  }

  // Validation de l'email avec regex
  if (email && email.trim() !== '') {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	if (!emailRegex.test(email.trim())) {
	  data.setError('Veuillez entrer une adresse email valide');
	  return false;
	}
  }

  // Validation du mot de passe avec regex
  if (password && password.trim() !== '') {
	// Au moins 8 caractères, une majuscule, une minuscule, un chiffre
	const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
	if (!passwordRegex.test(password)) {
	  data.setError('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre');
	  return false;
	}
  }

	const result = await loginUserDb(email, password, data.setError)
	if (!result){
		return false
	}
	return true
}
