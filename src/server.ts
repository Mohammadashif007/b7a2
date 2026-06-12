import app from "./app";
import { config } from "./app/config";

import { initDB } from "./db";

const main = () => {
    app.listen(config.PORT, () => {
        initDB();
        console.log(`Example app listening on port ${config.PORT}`);
    });
};

main();
