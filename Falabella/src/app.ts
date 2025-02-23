import express from "express";
import morgan from "morgan";
import cors from "cors";
import user_routes from "./routes/user.routes"

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(user_routes);

export default app;