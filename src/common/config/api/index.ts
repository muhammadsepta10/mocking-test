import { registerAs } from '@nestjs/config';
export default registerAs('app', () => ({
  NODE_ENV: process.env.NODE_ENV,
  APP_PORT: process.env.APP_PORT,
  DOPPLER: process.env.DOPPLER_TOKEN,
}));
