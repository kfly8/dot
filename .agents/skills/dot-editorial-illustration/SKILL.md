---
name: dot-editorial-illustration
description: dotの記事用に、少ない線・控えめな表情の白黒一コマ風刺画を制作・修正する。記事の主張を視覚的な矛盾で伝える挿絵が必要なときに使う。
---

# 少ない線で伝える記事の風刺画

ユーザーが別の画風を指定した場合はそちらを優先する。このスキルは画像生成・公開の権限を追加しない。

## 構図を決める

記事から一つの矛盾を取り出し、説明文を読まなくても見える場面にする。今回は「限定された検査には通るが、本来の用途には疑問が残る」を、空中で回る四角い車輪の自転車で表した。毎回自転車を使うのではなく、主張に応じて題材を選ぶ。

- 白黒、一コマ、横長。約3頭身の人物を基本にする。
- 古い新聞の風刺画のような細く不揃いな線。輪郭と少数の動線を中心に、陰影・ハッチング・機械の細部を減らす。
- 顔は少しいびつで非対称。小さい目、曲がった鼻、ほぼ水平の口。整った漫画顔や大げさな笑顔・しかめ面にしない。姿勢と状況で温度差を示す。
- 国や言語を問わず伝わる記号を使う。合格は文字でなく黒い「✔」。画像内のタイトル・説明文は原則入れず、記事のHTMLに置く。
- 動作の意味を見えるようにする。車輪なら地面との隙間、異なる回転角度、少数の曲線や角の残像を使い、四角い輪郭を保つ。
- 不要な事故・けが・災害の連想を使わず、身近な道具の不合理で伝える。参考画像の署名・透かし・文字・政治的題材を持ち込まない。

## 再現用プロンプト

下記は採用画像の特徴をまとめた再生成用プロンプト。新規生成で同一画像になる保証はない。実際の採用画像は [square-wheels.png](../../../public/images/square-wheels.png)。近い見た目を保つ修正では、この画像を参照として使い、変更箇所だけを指定する。

```text
A single-panel vintage newspaper editorial cartoon, landscape 3:2.
Sparse rough black pen lines on plain off-white paper. Large untouched white spaces.
Exactly two adult caricatures, approximately three heads tall, with awkward asymmetrical faces,
tiny uneven eyes, crooked noses and small nearly straight mouths. Understated expressions.
Left: a bespectacled inspector in a coat tests a bicycle drivetrain and holds a card with a black ✔.
Right: an observer stands with both arms folded, watching with quiet mild doubt.
Center: one recognizable bicycle on a repair stand, both wheels clearly suspended above the floor.
Both wheels are SQUARE, with straight sides and sharp corners. Tilt them at different rotation angles.
Use a few curved rotation strokes and faint corner echoes to show the square wheels spinning freely in air.
Keep the stand, chain and pedal recognizable; simplify mechanical details and use only 4–6 spokes per wheel.
The humor comes from approving the spinning wheels while their square shape makes riding questionable.
Use very few ink marks, almost no shading or cross-hatching, no floor texture, no elaborate paper distress.
Loose thin slightly wobbly border. No title, captions, letters, speech bubbles, watermark or signature.
Only the black checkmark symbol appears. No color. No polished manga faces, no big grins or dramatic eyebrows.
```

## 生成後の確認

画像生成ツールで制作・編集し、出力を目視確認する。人数・頭身・姿勢・表情・動作・余計な文字を点検し、スマートフォン幅でも主題が読めるか確かめる。狙いから外れた点だけを次の編集で直す。

採用後は実寸をHTMLと共有メタデータに反映し、日英の説明altを付ける。文字のない画像は日英で共有できる。画像だけで記事タイトルを代替しない。候補の作成とサイトへの公開を区別し、公開は依頼された範囲で行う。
