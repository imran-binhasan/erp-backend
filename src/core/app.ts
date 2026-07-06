import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { corsOptions } from './cors.config';
import { errorHandler } from './middleware/errorHandler.middleware';
import { rateLimiter } from './middleware/rateLimiter.middleware';
import routes from '../routes/index';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import mongoose from 'mongoose';
import { ApiResponse } from '../shared/utils/ApiResponse';
import { requestLogger } from './middleware/requestLogger.middleware';

const app = express();

app.disable('x-powered-by');
app.use(cors(corsOptions));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(requestLogger);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(rateLimiter);

app.use('/api/v1', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (_req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.status(200).json(
    ApiResponse.success(
      {
        database: dbReady ? 'connected' : 'disconnected',
      },
      'Server is running'
    )
  );
});

app.use(errorHandler);

export default app;
