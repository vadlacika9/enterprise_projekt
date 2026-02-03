import express, { type Request, type Response } from 'express';
import router from './routes/userRoutes.js';
import roomRouter from './routes/roomRoutes.js';
import equipmentRouter from './routes/equipmentRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import cors from "cors";

const app = express();

const PORT = 3000;

const corsOptions = {
  origin: 'http://localhost:3001',
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));


app.get("/", (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Express + TypeScript Server!' });
})

app.use(express.json());
app.use("/users", router);
// Fontos: az image route-okat a roomRouteS ELÉ tesszük, hogy a /rooms/:id/images ne ütközzön a /rooms/:roomId/:equipmentId útvonallal
app.use("/rooms", imageRouter);
app.use("/rooms", roomRouter);
app.use("/equipment", equipmentRouter);

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`)
})