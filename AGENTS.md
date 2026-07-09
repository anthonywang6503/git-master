# AGENTS.md

## 專案概覽

Git Master 是瀏覽器擴充套件，提供 GitHub、GitLab、Gitee、Gitea、Gogs 的程式碼樹、檔案搜尋、下載、GitHub 通知與暗色模式等功能。

核心技術：

- Webpack 4 建置多入口瀏覽器擴充。
- TypeScript、JavaScript、React 16、Ant Design 4、Less/CSS。
- `webextension-polyfill-ts` 提供 WebExtension API 型別與 Promise 介面。
- Chrome/Opera 輸出 Manifest V3；Firefox 輸出 Manifest V2。

主要目錄：

- `src/manifest/index.js`：跨瀏覽器 manifest 來源，透過 `scripts/wext-manifest` 展開 vendor key。
- `src/Background/`：背景 service worker / background script、通知、badge、API helper。
- `src/ContentScript/`：注入頁面的主要功能，包含程式碼樹、下載、站台 adapter。
- `src/Popup/`：擴充 popup UI。
- `src/Options/`：設定頁 UI 與設定儲存流程。
- `src/common/`：共用常數、storage、adapter、template、工具函式。
- `views/`：popup/options HTML、locales、注入腳本與靜態資源。
- `extension/`：建置輸出目錄，通常不應手動編輯。

## 設定指令

優先使用專案既有 Node/npm 工具鏈。`package.json` 宣告 Node `>=10`，但此舊 Webpack 4 專案在新版 npm/Node 上可能遇到 peer dependency 或 `@types/node` 版本問題。

一般安裝：

```bash
npm install --legacy-peer-deps
```

若 `package-lock.json` 內舊的 `registry.nlark.com` resolved URL 造成安裝失敗，可使用 npm registry 並避免重寫 lockfile：

```bash
npm install --no-package-lock --legacy-peer-deps --registry=https://registry.npmjs.org/
```

若 TypeScript 4.6 因新版 `@types/node` 解析失敗，只調整本機 `node_modules`，不要改 `package.json` 或 `package-lock.json`：

```bash
npm install --no-save --package-lock=false --legacy-peer-deps --registry=https://registry.npmjs.org/ @types/node@16.11.7
```

pre-commit hook 需要 `magic-lint` 能找到 `prettier` 與 `lint-staged`。若本機安裝不完整，補齊本機套件即可：

```bash
npm install --no-save --package-lock=false --legacy-peer-deps --registry=https://registry.npmjs.org/ prettier@1.19.1 lint-staged@10.0.8
```

## 開發工作流程

開發監看：

```bash
npm run dev:chrome
npm run dev:firefox
npm run dev:opera
```

建置：

```bash
npm run build:chrome
npm run build:firefox
npm run build:opera
npm run build:safari
```

完整建置腳本：

```bash
npm run build
```

注意：`npm run build` 目前呼叫 `yarn run build:chrome && yarn run build:firefox && yarn run build:opera`，本機若沒有 Yarn，請分別執行單一 browser build。

建置輸出：

- Chrome：`extension/chrome/` 與 `extension/chrome.zip`
- Firefox：`extension/firefox/` 與 `extension/firefox.xpi`
- Opera：`extension/opera/` 與 `extension/opera.crx`
- Safari：`extension/safari/` 與 `extension/safari.zip`

修改 manifest 後至少跑：

```bash
npm run build:chrome
```

若有動到 vendor key、Firefox 專屬欄位或 background script，相同變更也要跑：

```bash
npm run build:firefox
```

## 測試與驗證

目前專案沒有單元測試或 E2E 測試腳本。驗證以建置、瀏覽器手動載入與提交 hook 為主。

Lint 指令：

```bash
npm run lint
```

注意：目前 full lint 基線不是乾淨的，會回報既有 TypeScript 規則錯誤。除非任務明確要求清理 lint，請不要順手修正無關檔案；針對你修改的原始碼，依 pre-commit hook 或目標檔案的 lint 結果處理即可。

建置驗證：

```bash
npm run build:chrome
npm run build:firefox
```

Chrome 手動驗證：

1. 執行 `npm run build:chrome`。
2. 到 `chrome://extensions` 開啟開發人員模式。
3. 載入 `extension/chrome`。
4. 重新載入擴充後，也要重新整理已開啟的目標網頁，避免頁面仍使用舊版 content script。

Manifest 版本快速檢查：

```bash
node -e "const m=require('./extension/chrome/manifest.json'); console.log(m.version, m.manifest_version, m.background)"
```

預期 Chrome 輸出為 Manifest V3，且 `background.service_worker` 指向 `js/background.bundle.js`。

## 程式碼風格

- 依現有檔案風格做精準修改，不做無關重構。
- TypeScript / TSX 使用 `ts-loader` 與 `babel-loader`，路徑別名 `@/*` 對應 `src/*`。
- ESLint 設定在 `.eslintrc.json`，基底為 `magic`、`magic/react`、`magic/typescript`。
- Prettier 設定在 `.prettierrc.js`，主要規則包含單引號、`printWidth: 150`、`trailingComma: 'es5'`。
- 不要手動修改 `extension/` 的建置產物；修改來源後重新建置。
- 若新增或移除 public API / manifest 欄位，同步檢查 `README.md` 與 `CHANGELOG.md` 是否需要更新。

## Manifest 與瀏覽器相容性

`src/manifest/index.js` 使用 `__chrome__`、`__firefox__`、`__chrome|opera__` 等 vendor key，轉換器位於 `scripts/wext-manifest/`。

目前狀態：

- Chrome/Opera：Manifest V3，使用 `action`、`host_permissions`、`background.service_worker`。
- Firefox：Manifest V2，使用 `browser_action`、`permissions` 內 host 權限、`background.scripts`。
- Chrome 最低版本為 88。

注意事項：

- Chrome MV3 background 是 service worker，不能依賴 `window`、`document` 或遠端 script 注入。
- 需要同時支援 MV2/MV3 的 action API 時，使用 `src/common/extension-action.ts`。
- Chrome MV3 對 `chrome.storage.local.get/set/remove` 有 StorageArea brand check；不要把原生方法拆出來保存後再呼叫。
- Manifest CSP 不可加入遠端 script；Chrome MV3 extension pages 目前使用 `script-src 'self'; object-src 'self'`。

## 提交與 PR 指南

- 使用 Conventional Commits，例如 `feat(manifest): 升級 Chrome 擴充至 Manifest V3`。
- 提交前至少檢查目標瀏覽器建置：

```bash
npm run build:chrome
```

- 若變更影響 Firefox manifest 或 background script，另跑：

```bash
npm run build:firefox
```

- 若修改 TypeScript/JavaScript 原始碼，讓 Husky pre-commit hook 執行 `magic-lint` / lint-staged，並修正 hook 指出的相關檔案問題。不要用 `--no-verify` 跳過 hook，除非使用者明確要求。

## CI/CD 與發布

- `.github/workflows/main.yml` 只做 GitHub 到 Gitee 的鏡像同步，不執行測試或建置。
- `npm run release` 使用 `semantic-release`。
- 版本來源在 `package.json`，manifest 會讀取 `pkg.version`。
- 發版時同步更新 `package.json`、`package-lock.json`、`CHANGELOG.md`，必要時更新 `README.md`。

## 安全與權限

- 不要提交 token、私鑰或本機瀏覽器設定。
- GitHub/GitLab/Gitee access token 存在瀏覽器本機儲存空間；避免新增會把 token 傳到非預期網域的邏輯。
- 修改 `permissions`、`host_permissions`、`optional_permissions` 前，確認 Chrome MV3 與 Firefox MV2 的輸出都合理。
- Content script 頁面處理 HTML 時，優先沿用既有 DOMPurify / adapter 模式，不新增未消毒的 HTML 注入。

## 常見陷阱

- `package-lock.json` 含舊 registry resolved URL；不要只因本機安裝問題大幅重寫 lockfile。
- 新版 npm 可能因 peer dependency 失敗，使用 `--legacy-peer-deps`。
- 新版 `@types/node` 可能讓 TypeScript 4.6 build 失敗；只修本機 `node_modules` 即可。
- `clean-webpack-plugin` 會清掉目標 browser 的 `extension/<browser>` 與 archive；不要並行跑不同 browser build。
- 重新載入 Chrome 擴充後，已注入的頁面仍可能使用舊 content script，需重新整理頁面。
