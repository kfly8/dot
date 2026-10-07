# 見積UIの配線を変える / Change the estimate wiring

公開BarefootJS 0.39.3、Node.js 22以降、Bun 1.3以降を使用します。
Use public BarefootJS 0.39.3, Node.js 22+, and Bun 1.3+.

```sh
git clone https://github.com/kfly8/dot.git
cd dot
git checkout --detach c46692a1b81c210a63d1fcd61db20c90b90521aa
npm ci
bun test ui/components/ui/__tests__/estimate.test.ts --test-name-pattern 'passes total'
```

1件成功します。`ui/components/ui/estimate.tsx` の `value={total()}` だけを `value={quantity()}` に変え、同じテストを再実行してください。`Expected: "total()" / Received: "quantity()"` で失敗します。元に戻すと成功します。

One test passes. Change only `value={total()}` to `value={quantity()}` in `ui/components/ui/estimate.tsx`, then rerun the same command. It fails with `Expected: "total()" / Received: "quantity()"`. Restore the original expression and it passes again.

元に戻したあと、同じファイルの `quantity() * 100` を `quantity() * 101` に変え、同じテストを実行してみてください。このテストは成功します。表示部品に渡す式が `total()` のままなので、単価の要件違反は見つけません。確認後は100に戻してください。

After restoring the original, change `quantity() * 100` to `quantity() * 101` in the same file and rerun the same test. It passes: the display still receives `total()`, so this test does not detect the unit-price requirement violation. Restore 100 afterward.

- [実装 / Component](../ui/components/ui/estimate.tsx)
- [子の表示 / Child display](../ui/components/ui/total-readout.tsx)
- [完全なテスト / Complete test](../ui/components/ui/__tests__/estimate.test.ts)

`renderToTest` と `find({ componentName: 'TotalReadout' }).props.value` は実際の公開APIです。対象のassertionは子へ渡す式を調べます。計算やイベントを実行せず、同値な別の式でも文字列表現が違えば失敗する検査です。

These are actual public APIs. The assertion checks the expression passed to the child. It does not execute arithmetic or events; even a semantically equivalent expression can fail if its string representation differs.

## CLIで辿る / Follow with the CLI

```sh
npx bf debug signals ui/components/ui/estimate.tsx
npx bf debug trace ui/components/ui/estimate.tsx quantity
npx bf debug trace ui/components/ui/total-readout.tsx props.value
```

数量から合計、子のvalueまでを辿ったあと、子を明示的に指定して表示への接続を調べます。コンポーネント境界を自動で越えて追跡する例ではありません。`debug profile` は動的測定であり、この静的検査とは別です。

Trace quantity through total to the child prop, then explicitly target the child to inspect its display binding. This is not automatic cross-component traversal. `debug profile` performs dynamic measurements, separate from these static checks.

## ブラウザで確かめる / Check behavior in a browser

```sh
npm run dev
# http://localhost:8787/posts/inspect-ui-before-browser/
```

初期値500、数量を一つ増やして600、お急ぎ便で800を確認します。英語版は `/en/posts/inspect-ui-before-browser/`。全検査は `npm run build && npm test && npm run typecheck`。検証環境と履歴は [verification.md](verification.md) にあります。

Check 500 initially, 600 after increasing quantity, and 800 with express delivery. The English article is at `/en/posts/inspect-ui-before-browser/`. Run all checks with `npm run build && npm test && npm run typecheck`. See [verification.md](verification.md) for the environment and verification history.
