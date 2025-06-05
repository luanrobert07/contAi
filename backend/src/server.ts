import { app } from "./app";
import { myDataSource } from "./database/database";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

myDataSource.initialize()
  .then(() => {
    console.log("Data Source initialized");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization", error);
    process.exit(1);
  });
