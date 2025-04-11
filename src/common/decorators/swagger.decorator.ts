import { SetMetadata } from '@nestjs/common';

export const Swagger = (...args: string[]) => SetMetadata('swagger', args);
