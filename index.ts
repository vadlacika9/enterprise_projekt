import express, { type Request, type Response } from 'express';
import router from './routes/userRoutes.js';
import roomRouter from './routes/roomRoutes.js';
import equipmentRouter from './routes/equipmentRoutes.js';

const app = express();

const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Express + TypeScript Server!' });
})

app.use(express.json());
app.use("/users", router);
app.use("/rooms", roomRouter);
app.use("/equipment", equipmentRouter);

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`)
})