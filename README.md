# JATTEA LP（フランチャイズ加盟店 0次募集）

`Frame 39.pdf` のデザインを、画像貼り付けではなく **すべてHTML/CSSのテキスト・レイアウト** として
再構築した1ページLP。Cloudflare Pages でホスティングしています。

- 本番URL: https://jattea-lp.pages.dev/
- Cloudflare Pages プロジェクト名: `jattea-lp`

## 構成

```
public/
├── index.html            全セクションの本文・リンク
├── robots.txt
├── _headers              キャッシュ／セキュリティヘッダ
└── assets/
    ├── css/style.css     デザイントークン（:root）で色・幅を一元管理
    └── img/              写真・ロゴ・装飾（差し替え可）
```

## よくある編集

### 1. CTAのリンク先を変える

`public/index.html` の冒頭 1箇所だけ書き換えます。ページ内の全CTA
（ヘッダー／CTAバンド4箇所／モバイル固定ボタン、計6箇所）にまとめて反映されます。

```js
window.JATTEA_LINKS = {
  line:   "https://lin.ee/xxxxxxx",   // ← LINE公式アカウントのURL
  chagee: "https://www.chagee.com/",  // 本文リンク：CHAGEE（覇王茶姫）
  heytea: "https://www.heytea.com/"   // 本文リンク：HEYTEA（喜茶）
};
```

### 2. 写真を差し替える

`public/assets/img/` の **同名ファイルを上書きする** だけです。拡張子を変える場合は
`index.html` 内の `src` も合わせて変更してください。

| ファイル | 使用箇所 |
|---|---|
| `hero-bg.jpg` | ファーストビュー背景（カップ合成込みの1枚画像） |
| `issue-chagee.jpg` | ISSUE：CHAGEEの写真 |
| `market-1〜4.jpg` | ISSUE：市場データ4タイル（51億ドル／364億円／14.1%／3,687万人） |
| `fc-tile-1〜4.jpg` | 0次募集：4タイル（粗利率75.4%／23.0%／SNS集客／研修14日） |
| `mission-bg.jpg` | MISSION 背景 |
| `reason-1〜4.jpg` | 選ばれる4つの理由 |
| `support-1〜8.jpg` | Q&A：サポート内容8枠 |
| `doc-1〜4.jpg` | CTAバンドの資料イメージ（重ね表示） |
| `member-secret.jpg` | CMO（SECRET MEMBER） |
| `ceo-yt-1.jpg` / `ceo-yt-2.jpg` | 代表：出演動画サムネイル |
| `logo-header.png` / `logo-emblem.png` / `logo-footer.png` / `favicon.png` | ロゴ各種 |
| `orn-white-*.jpg` / `orn-orange-*.jpg` | CTAバンド左右の花装飾（背景色込みの画像） |

### 3. 色・幅を変える

`public/assets/css/style.css` 冒頭の `:root` を編集します。

```css
--orange: #cc461d;   --cream: #f9f6ef;   --gold: #c2a560;
--content: 720px;    /* 本文カラム幅 */
--wide: 1100px;      /* セクション最大幅 */
```

## 開発・デプロイ

```bash
npm run dev      # ローカル確認（http://localhost:8788）
npm run deploy   # Cloudflare Pages に本番デプロイ
```

初回のみ `npx wrangler login` が必要です。

## PDFからの転記メモ

- 0次募集セクションの2枚目タイルは、PDF上の表記どおり「売上からの粗利率 23.0%」としています
  （本文の「ドリンク原価率23%」と揃えるなら、`index.html` の該当ラベルを変更してください）。
- ファーストビューの「???万人の圧倒的集客力」もPDFのまま伏せ字にしています。
