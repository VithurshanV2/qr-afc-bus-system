import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/postgres.js';
import './config/passport.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import oauthRouter from './routes/oauthRoutes.js';
import walletRouter from './routes/walletRoutes.js';
import ticketRouter from './routes/ticketRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

await connectDB();

const allowedOrigins = ['http://localhost:5173'];

// Mount webhook before express.json()
app.use(
  '/api/wallet/stripe-webhook',
  express.raw({ type: 'application/json' }),
  walletRouter,
);

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// API Endpoints
app.get('/', (req, res) => res.send('API Working'));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', oauthRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/ticket', ticketRouter);

app.listen(port, () => console.log(`Server started on PORT: ${port}`));
