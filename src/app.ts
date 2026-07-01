import express, {
    type Application,
    type Request,
    type Response,
} from "express";
import { router } from "./app/routes";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use("/api", router);

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "API not found",
    });
});

export default app;
