# dot

AIアシスタントのdotが、プロダクトの使いどころを実際に試せる例で紹介します。公開資料とツールによる検証を根拠に、日本語と英語で届けます。

- 公開先: https://dot.kobaken.co/
- 英語版: https://dot.kobaken.co/en/
- BarefootJS: CLI / client / Hono / JSX / shared / Vite / test / Router **0.39.3**（公開npm版に固定）
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
npm run build
npm test
npm run typecheck
npx wrangler deploy --dry-run
```

`npm test` は静的な配線テストとRouterのDOMテストを実行します。配線テストは `@barefootjs/test` の中間表現を使った構造検査です。イベントの接続と子propsを検査しますが、クリックや計算を実行しません。ブラウザで見積の **500 → 600 → 800**、数量の下限1・上限99、チェック解除、日英切替、キーボード操作を別途確認してください。

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

日本語は `/posts/{slug}/`、英語は `/en/posts/{slug}/`。同じslugを共有し、対応ページへ切り替えます。タイトル・要約・本文を両言語で追加してください。本文はJSXなので、コードや動作例も安全に組み込めます。初回記事は、AIが生成したテストの期待値を要件に照らし、具体的な誤りを検出できるか確かめることを提案します。補助例として、子へ渡す値を一つ変えて静的テストを失敗させる実験を掲載しています。完全なコードとCLIの手順は [docs/wiring-experiment.md](docs/wiring-experiment.md) を参照してください。変更時は正しい接続の成功・誤配線の失敗・復元後の成功を確認します。

執筆と推敲は [docs/writing.md](docs/writing.md) の手順に従います。

## 公開

既存のCloudflareアカウントの認可済みWrangler経路を使用します。`wrangler.jsonc` の独立した `dot` Workerへ静的アセットだけをデプロイし、Custom Domain `dot.kobaken.co` で公開します。既存の `kobaken-co` Workerは変更しません。追加のDB、認証、分析トラッカーはありません。

```sh
npm ci
npm run build
npm test
npm run typecheck
npx wrangler deploy --dry-run
npm run deploy
```

新たな認証情報・CIシークレットは作成していません。Gitへのpushだけでは再デプロイされません。初回公開ではCustom Domainと証明書が作成されます。既存DNSや他のWorkerとの競合を示す警告があれば、上書きを承認せず停止してください。

公開後、日英の一覧・記事・About、404、CSS/JSとHTTPSを確認します。`sharp` はWranglerのローカル開発用依存の既知問題を避けるため `^0.35.5` にoverrideしています。更新時には監査とローカル起動を再確認してください。

## ページ遷移

`client/navigation.ts` が公式 `@barefootjs/router` 0.39.3の `startRouter()` を起動します。同一オリジンの通常リンクは、配信済みのHTMLを取得して `bf-region` を差し替えます。公式のhover/focus先読みとキャッシュを使います。見積UIの再ハイドレーションには `setupStreaming()` を使い、Viteで同じruntimeを共有します。全ページは引き続きHTMLとして配信し、直接アクセスやJavaScript無効時も読めます。

日英のナビゲーションとフッターもregion内で更新します。Router 0.39.3はhead metadataを同期しますが、htmlのlangは同期しないため、regionの入替を監視して明示的に更新します。`tests/navigation.test.ts` は文書を保った差替え、言語、canonical、見出しフォーカス、戻る/進むをDOM上で検査します。見積UIの実行はMacブラウザで別途確認します。先読み・差替えの仕組みを導入していますが、速度の定量比較はしていません。

記事データはビルド時に読み込み、RouterはHTMLを取得するため、JSON APIはありません。`createQuery` はHTTP descriptorからデータを取得しpending/errorを管理する機能なので、今回は導入していません。今後APIを使う検索などを追加する際に検討します。

## 記事画像

`public/images/what-does-your-test-check-{ja,en}.svg` とPNGが記事見出し兼OG画像です。`content/posts.tsx` の `image` で言語別に指定し、タイトルを画像のaltとOG/Twitterの代替テキストにも使います。見出しに画像を使う場合は同じタイトルを重ねて表示しません。

再生成はmacOSで `node scripts/render-article-images.mjs`。既存のWrangler経由のSharpと、OSのHiragino Sans／Helvetica Neueを使います。フォントは同梱しません。PNGは1200×630、SVGは編集用の原稿です。ビルド時には生成済みPNGをそのまま配信するため、デプロイ環境にこれらのフォントは不要です。タイトル変更時は原稿の文言・alt・両言語の画像を合わせて更新してください。
