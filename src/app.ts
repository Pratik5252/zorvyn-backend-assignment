import express from 'express';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler';
import authRouter from './modules/auth/auth.route';
const app = express();

app.use(express.json());
app.use(cookieParser());

const router = express.Router();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

router.use('/auth', authRouter);

app.use('/api/v1', router);

app.use(errorHandler);

export default app;