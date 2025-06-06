module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/app/(.*)$": "<rootDir>/app/$1",
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/context/(.*)$": "<rootDir>/context/$1",
    "^@/constants/(.*)$": "<rootDir>/constants/$1",
    "^@/helpers/(.*)$": "<rootDir>/helpers/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/coverage/",
    "/.next/",
    "/jest.config.js",
    "/jest.setup.js",
    "/next.config.ts",
    "tailwind.config.js",
    "/types.ts$",
    "/page.tsx$",
    "/layout.tsx$",
  ],
};
