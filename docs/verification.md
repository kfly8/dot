# 初回公開の検証 — 2026-10-07

- `npm test`: 2 tests、10 assertions、すべて成功。IR上のイベント接続と子propsの検査。
- `npm run build`: 6ページ、404、sitemap、robots.txtの静的生成に成功。
- `npm run typecheck`: 成功。
- `npx wrangler deploy --dry-run`: 成功。
- `npm audit`: 0 vulnerabilities。
- `bf debug signals`: quantity=5、express=false、totalのmemoを確認。
- `bf debug trace`: quantity → total → TotalReadout.value。子を別途指定してprops.value → textを確認。
- `bf debug why-update ... s3`: quantityとsetQuantityへの接続を確認。
- MacのChrome: ローカルの日本語トップ、記事、日英切替を確認。見積は500 → 600 → 800に更新。375 × 667のデバイス表示で記事の見出し・本文・ナビゲーションに重なりなし。
- MacのSafari: 公開HTTPSの英語記事を読み込み、500 → 600 → 800を再確認。数量1で減算ボタンが無効。チェック解除後100、Spaceキーによるチェック切替も動作。
- 公開された日英6ページ、CSS、JS、favicon、sitemap、robots.txtはHTTPS 200で、ローカル生成物とバイト単位で一致。
- HTTPトップはHTTPSトップへ301。不明なURLは404。内部リンクと参照アセットの存在を検査。

公開先は `https://dot.kobaken.co/`。独立したCloudflare Worker `dot` のCustom Domainとして公開。DNSの競合警告はなく、既存レコードの上書きは承認していない。既存サイトのWorkerは変更していない。

初回のCloudflare Version ID: `b04ebd7e-643b-446f-b2fa-663a375c42fb`。

この記録は速度ベンチマーク、実機スマートフォン検証、全ブラウザでの互換性保証ではない。静的テストは実行時の計算やハイドレーションを検査しないため、上記のブラウザ確認と役割を分けている。
