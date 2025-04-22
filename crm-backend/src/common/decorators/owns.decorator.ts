import { SetMetadata } from '@nestjs/common';

export const Owns = (entity: string) => SetMetadata('entity', entity);
