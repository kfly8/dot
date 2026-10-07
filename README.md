# dot

AIアシスタントの実験記録。日本語と英語の記事、動くBarefootJSの例を公開します。

- 公開先: https://dot.kobaken.co/
- 英語版: https://dot.kobaken.co/en/
- BarefootJS: CLI / client / Hono / JSX / shared / Vite / test **0.39.3**（公開npm版に固定）
- 検証環境: macOS、Bun 1.3.0、Vite 6.4.4、Wrangler 4.148.0

## ローカル起動

Node.js 22以降とBun 1.3以降を用意します。

```sh
npm ci
npm run dev
# http://localhost:8787
```

初回ビルド後にWranglerで静的ファイルを配信します。ファイルの変更後は別ターミナルで `npm run build` を実行し、ブラウザを再読み込みしてください。

```sh
npm test
npm run build
npm run typecheck
npx wrangler deploy --dry-run
```

`npm test` は `@barefootjs/test` の中間表現を使った静的な構造検査です。イベントの接続と子propsを検査しますが、クリックや計算を実行しません。ブラウザで見積の **500 → 600 → 800**、数量の下限1・上限99、チェック解除、日英切替、キーボード操作を別途確認してください。

```sh
npx bf debug signals ui/components/ui/estimate.tsx
npx bf debug trace ui/components/ui/estimate.tsx quantity
npx bf debug trace ui/components/ui/total-readout.tsx props.value
```

`bf` はプロジェクトに入っている0.39.3を使用します。別のグローバルな `barefoot` コマンドと混同しないでください。

## 構成と記事追加

- `content/posts.tsx`: 記事のslug、日付、日英タイトル・要約・本文。新しい `Post` を `posts` に追加する。
- `scripts/generate.tsx`: Hono JSXと `BfScripts` で6ページを事前レンダリング。記事を追加すると両言語の一覧・詳細・sitemapを生成。
- `ui/components/ui/`: BarefootJSのクライアントコンポーネントと静的テスト。
- `public/styles.css`: レスポンシブな文字組と余白。
- `site/`: デプロイ対象の生成物。Git管理しない。

日本語は `/posts/{slug}/`、英語は `/en/posts/{slug}/`。同じslugを共有し、対応ページへ切り替えます。タイトル・要約・本文を両言語で追加してください。本文はJSXなので、コードや動作例も安全に組み込めます。初回記事のコードは実際のソースファイルから読み込むため、表示例と実装がずれません。

執筆と推敲は [docs/writing.md](docs/writing.md) の手順に従います。

## 公開

既存のCloudflareアカウントの認可済みWrangler経路を使用します。`wrangler.jsonc` の独立した `dot` Workerへ静的アセットだけをデプロイし、Custom Domain `dot.kobaken.co` で公開します。既存の `kobaken-co` Workerは変更しません。追加のDB、認証、分析トラッカーはありません。

```sh
npm ci
npm test
npm run build
npm run typecheck
npx wrangler deploy --dry-run
npm run deploy
```

新たな認証情報・CIシークレットは作成していません。Gitへのpushだけでは再デプロイされません。初回公開ではCustom Domainと証明書が作成されます。既存DNSや他のWorkerとの競合を示す警告があれば、上書きを承認せず停止してください。

公開後、日英の一覧・記事・About、404、CSS/JSとHTTPSを確認します。`sharp` はWranglerのローカル開発用依存の既知問題を避けるため `^0.35.5` にoverrideしています。更新時には監査とローカル起動を再確認してください。
