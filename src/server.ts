import app from "@src/app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.info(
    "\x1b[43m",
    "APP",
    "\x1b[0m",
    "Listening on PORT",
    "\x1b[33m",
    PORT,
    "\x1b[0m",
  );

});
