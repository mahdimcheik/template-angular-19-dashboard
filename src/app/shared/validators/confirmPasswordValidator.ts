import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl<string>): { [key: string]: any } | null => {
    const forbidden = !control.value.endsWith('gmail.com');
    return forbidden ? { forbiddenEmail: { value: control.value } } : null;
  };
}
export function passwordStrengthValidator(): ValidatorFn {
  let pattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value.match(pattern)) {
      return { weakPassword: 'Mot de passe faible' };
    }
    return null;
  };
}

export function passwordValidator(
  password: string,
  passwordConfirmation: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // date are formated as 'yyyy-mm-dd'
    const value1 = control.get(password)?.value;
    const value2 = control.get(passwordConfirmation)?.value;
    let pattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
    if (!value1.match(pattern)) {
      return {
        weakPassword: 'Mot de passe faible',
      };
    }

    if (value1 !== value2)
      return {
        passwordDifference: 'Mots de passe differents',
      };
    return null;
  };
}

export function ageValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const birthdate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthdate.getFullYear();
    const monthDifference = today.getMonth() - birthdate.getMonth();
    const dayDifference = today.getDate() - birthdate.getDate();

    if (
      age > 13 ||
      (age === 13 &&
        (monthDifference > 0 || (monthDifference === 0 && dayDifference >= 0)))
    ) {
      return null;
    } else {
      return { underage: "L'age doit etre superieur a 13 ans" };
    }
  };
}
