import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  
  {
    languageOptions: {
      globals: {
        ...globals.node, // Thêm các biến global của Node.js, bao gồm `process`
        ...globals.browser, // Nếu bạn cũng muốn hỗ trợ môi trường browser
      },
    },
  },
  pluginJs.configs.recommended,
];