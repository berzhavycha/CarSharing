module.exports = {
  "client/**/*.{js,jsx,ts,tsx}": [
    "npm run lint:client",
    "npm run format:client"
  ],
  "server/**/*.{js,ts}": [
    "npm run lint:server",
    "npm run format:server"
  ]
};