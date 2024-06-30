import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AppErrors } from 'src/common/errors';
import { RegisterUserDTO } from 'src/modules/auth/dto';
// Audit compare passwords
@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatching implements ValidatorConstraintInterface {
  validate(passwordRepeat: string, args: ValidationArguments) {
    const obj = args.object as RegisterUserDTO;
    return obj.password === passwordRepeat;
  }

  defaultMessage(): string {
    return AppErrors.USER_NOT_FOUND;
  }
}
