import { createUserDb } from "@/services/appwrite"

export interface ValidationError {
  field: string;
  message: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  setError: (value: string) => void;
}

export async function validateRegistration(data: RegisterData): Promise<boolean> {
  const { fullName, email, password, confirmPassword } = data;

  // Vérification des champs vides
  if (!fullName || fullName.trim() === '') {
    data.setError('You must provide a full name');
	return false;
  }

  if (!email || email.trim() === '') {
    data.setError('You must provide an email');
	return false;
  }

  if (!password || password.trim() === '') {
    data.setError('You must provide a password');
	return false;
  }

  if (!confirmPassword || confirmPassword.trim() === '') {
    data.setError('You must provide a confirm password');
	return false;
  }

  // Validation du nom complet (au moins 2 caractères, pas de chiffres au début)
  if (fullName && fullName.trim() !== '') {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
    if (!nameRegex.test(fullName.trim())) {
      data.setError('Le nom doit contenir uniquement des lettres et espaces (2-50 caractères)');
      return false;
    }
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

  // Vérification que les mots de passe correspondent
  if (password && confirmPassword && password !== confirmPassword) {
    data.setError('Les mots de passe ne correspondent pas');
    return false;
  }

    const result = await createUserDb(fullName, email, password, data.setError)
  	if (!result)
		return false
	return true;
}