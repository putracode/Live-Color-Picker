import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import 'dotenv/config';
import ErrorHandler from './middlewares/error.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use(ErrorHandler);

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});