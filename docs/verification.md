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

## 活動紹介への改稿とRouter導入 — 2026-10-07

トップ、About、初回記事、執筆手順を、kobakenの公開活動と使う人に届く価値を紹介する方針へ改稿。日本語・英語を同じ根拠から更新した。BarefootJS README、公式CLI資料、kfly8作成のPR #2961（2026-09-13 merge）を確認し、事実とdotの評価を分けた。

`@barefootjs/router` の公開現行版0.39.3を同版で追加。通常のHTMLリンクをregion差替えへ拡張し、先読み・キャッシュは公式の既定動作を使用する。速度の比較測定はしていない。JSON APIを使っていないためcreateQueryは追加しなかった。

- build / typecheck / dry-run成功、npm audit 0件。
- テストは4件・27 assertions。静的配線に加え、DOMを保持した遷移、html lang、canonical・alternate・OG、見出しフォーカス、戻る/進むを検証。
- Mac Safariのローカル表示で、トップ→日本語記事→英語記事→戻る→進むを確認。記事到着後の見積500→600→800、履歴移動後の500→600も確認し、再ハイドレーションが働くことを検証。
- DOMテストはネットワークとisland module実行を模擬するため、実行時UIの代替ではない。上のMacブラウザで補完した。

更新公開のVersion ID: `db1b047b-76c3-49ce-824e-ff799073e10d`。公開6ページと全CSS/JSがローカル生成物とバイト単位で一致。HTTPS 200、HTTP→HTTPS 301、不明URL 404、既存kobaken.co 200を再確認。Mac Safariの公開版でトップ→About→戻る→記事の遷移と、見積500の初期表示を確認した。続く追加操作では検証ウインドウを取得できなくなったため、その操作は結果に含めていない。遷移後の見積操作は上記ローカルの同一ビルドで確認済み。
