import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      include: ['src/protocols/*/**'],
      exclude: [
        'src/index.ts', // исключаем конкретный файл
      ],
    },
  },
});
