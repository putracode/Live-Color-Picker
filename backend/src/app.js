import express from 'express';
import router from './routes';
import 'dotenv/config';
import ErrorHandler from './middlewares/error';

const app = express();
app.use(express.json());
app.use(router);
app.use(ErrorHandler);

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});