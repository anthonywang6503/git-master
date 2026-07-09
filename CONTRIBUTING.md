# Contributing to GitMaster

## Set up

Install dependencies after git clone the repo.

```bash
$ pnpm install
```

## Development

```bash
# Chrome、Edge
$ pnpm run dev:chrome
```

### Load Extension

1. **More Tools** -> **Extensions** or open `chrome://extensions/`.

2. Click **'Load unpack'** (when Developer mode is open) and choose folder **'extensions/chrome'**.

![load-extension](https://i.loli.net/2020/10/30/94gn5swiYh76BfU.png)

## Build（Production）

```bash
# Chrome、Edge
$ pnpm run build:chrome
```

## Test

none

## Structure

```
.
├── extension                                           build result and zip file
├── materiel
├── package.json
├── release.config.js
├── scripts
├── src
│   ├── Background
│   ├── ContentScript
│   │   ├── PageLife
│   │   ├── codeTree.ts                                 content script entry
│   │   ├── feature                                     to be injected code
│   │   ├── index.less
│   │   ├── index.ts
│   │   ├── theme                                       dark mode theme is here
│   │   └── util.ts
│   ├── Options
│   ├── Popup
│   ├── assets
│   ├── common
│   │   ├── adapters                                    code for git tree
│   │   │   ├── adapter.js                              core code for adapter
│   │   │   ├── gist.js
│   │   │   ├── gitea.js
│   │   │   ├── github.js
│   │   │   ├── github.less
│   │   │   ├── gitlab.js
│   │   │   ├── gitlab.less
│   │   │   ├── octicons
│   │   │   ├── oschina.js
│   │   │   ├── oschina.less
│   │   │   ├── pageDetect
│   │   │   └── pjax.js
│   │   ├── libs
│   │   ├── styles
│   │   ├── template
│   │   │   ├── template-full.html
│   │   │   ├── template.html
│   │   │   └── template.js
│   │   ├── util.deXss.js
│   │   ├── util.ext.js
│   │   ├── util.misc.js
│   │   ├── util.plugins.js
│   │   ├── view.error.js
│   │   ├── view.help.js
│   │   ├── view.options.js
│   │   └── view.tree.js
│   ├── components
│   ├── manifest
│   └── styles
├── typings
├── views
│   ├── _locales
│   ├── assets
│   ├── inject.js
│   ├── libs
│   ├── options.html
│   └── popup.html
├── webpack.config.js
```

## Commit Message Format

We have very precise rules over how our Git commit messages must be formatted. This format leads to easier to read commit history.

Each commit message consists of a header, a body, and a footer.

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The header is mandatory and must conform to the Commit Message Header format.

The body is optional.

The footer is optional.

Any line of the commit message cannot be longer than 100 characters.

### Commit Message Header

```
<type>: <short summary>
  │        │
  │        └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|style|test
```

#### Type

Must be one of the following:

* **chore**: Other changes that don’t modify src or test files
* **ci**: Changes to our CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **test**: Adding missing tests or correcting existing tests
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semicolons, etc)
* **revert**: Reverts a previous commit

#### Summary

Use the summary field to provide a succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize the first letter
* no dot (.) at the end

## Release

```bash
$ pnpm run release
```
