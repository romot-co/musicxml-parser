import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // describe, it, expectなどをグローバルに利用可能にする
    environment: 'jsdom', // DOM環境をシミュレート
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'], // 出力するカバレッジレポート形式
      reportsDirectory: './coverage/vitest', // Jestの出力と区別するため変更
      all: true, // プロジェクト内のすべてのファイルをカバレッジ対象とするか (テストされていないファイルも含む)
      include: ['src/**/*.ts'], // カバレッジ計測の対象ファイル
      exclude: [ // カバレッジ計測の対象外ファイル
        'src/index.ts',
        'src/types/**/*.ts',
        '**/*.test.ts',
        '**/*.config.ts',
      ],
    },
    alias: {
      // tsconfig.jsonのpathsと同期させるか、ここで明示的に設定
      // Vitestは通常tsconfig.jsonのpathsを自動で読み込む
      // '@/': new URL('./src/', import.meta.url).pathname,
    },
  },
});
