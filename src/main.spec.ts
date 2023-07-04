import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
describe('Main', () => {
    it('should bootstrap the Nest application', async () => {
      const app = await NestFactory.create(AppModule);
      expect(app).toBeDefined();
      await app.close();
    });
  });