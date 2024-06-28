/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  semi: true,
  printWidth: 170,
  trailingComma: "es5",
};

export default config;
