# typescript-boilerplate-package

`typescript-boilerplate-package` is a package that helps you to create a typescript project with a nice structure. It uses [semantic-release](https://github.com/semantic-release/semantic-release) to publish your package on npm and generate a changelog.

## Usage

Set `NPM_TOKEN` in your Github actions secret, and that's it :)

![Alt Text](https://raw.githubusercontent.com/maxgfr/typescript-boilerplate-package/main/.github/assets/token.png)

## Test this boilerplate

To test it, you can install it with `npm install typescript-boilerplate-package`. Then :

```ts
import {sayHello} from "typescript-boilerplate-package";
sayHello();
```
