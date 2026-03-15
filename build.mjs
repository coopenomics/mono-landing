#!/usr/bin/env node
/**
 * Сборка лендинга Цифровой Кооператив
 * Объединяет партиалы. CSS и JS подключаются из src/
 *
 * Запуск: node build.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname);
const SRC = join(ROOT, 'src');

const PARTIALS_ORDER = [
  'nav',
  'hero',
  'ready',
  'registries',
  'docsplit',
  'base',
  'store',
  'reporting',
  'chatcoop',
  'pricing',
  'connect',
  'cta',
  'footer',
];

function build() {
  // 1. Собираем HTML из партиалов
  const bodyParts = [];
  for (const name of PARTIALS_ORDER) {
    const path = join(SRC, 'partials', `${name}.html`);
    try {
      bodyParts.push(readFileSync(path, 'utf-8'));
    } catch (e) {
      console.warn(`Пропуск ${name}.html:`, e.message);
    }
  }
  const bodyContent = bodyParts.join('\n\n');

  // 2. Шаблон index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Цифровой Кооператив — система управления кооперативом</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=JetBrains+Mono:wght@300;400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="src/css/main.css">
<script>!function(){var t=localStorage.getItem("coop-theme");if(t&&t!=="system")document.documentElement.setAttribute("data-theme",t)}();</script>
</head>
<body>

${bodyContent}

<script src="src/js/main.js"></script>
</body>
</html>
`;

  // 3. Записываем index.html
  writeFileSync(join(ROOT, 'index.html'), indexHtml, 'utf-8');
  console.log('✓ index.html');

  console.log('\nСборка завершена.');
}

build();
