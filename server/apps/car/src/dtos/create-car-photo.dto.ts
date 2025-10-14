import {
  IsNotEmpty,
  IsUrl,
  IsUUID,
  registerDecorator,
  ValidateIf,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

function IsAtLeastOnePresent(
  properties: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'isAtLeastOnePresent',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [properties],
      options: validationOptions,
      validator: {
        validate(_value, args: ValidationArguments) {
          const [relatedProperties] = args.constraints;
          const object = args.object;

          return relatedProperties.some(
            (prop: string) =>
              object[prop] !== undefined &&
              object[prop] !== null &&
              object[prop] !== '',
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedProperties] = args.constraints;
          return `At least one of the following fields must be provided: ${relatedProperties.join(', ')}`;
        },
      },
    });
  };
}

export class CreateCarPhotoDto {
  @IsUUID(4, { message: 'carId must be a valid UUID' })
  @ValidateIf((o) => !o.originalCarId || o.carId)
  @IsAtLeastOnePresent(['carId', 'originalCarId'])
  carId?: string;

  @IsUUID(4, { message: 'originalCarId must be a valid UUID' })
  @ValidateIf((o) => !o.carId || o.originalCarId)
  originalCarId?: string;

  @IsUUID(4)
  @IsNotEmpty()
  fileId: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;
}
