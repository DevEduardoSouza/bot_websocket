import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
