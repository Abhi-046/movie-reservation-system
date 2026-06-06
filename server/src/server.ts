import dotenv from "dotenv";

dotenv.config();

import app from "./app";

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
