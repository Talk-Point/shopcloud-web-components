# Web-Components

Shopcloud Web Components

## Development

```sh
$ npm install
$ npm run start
```

## Deploy

```sh
$ rm -rf dist
$ npm run build --prod
$ npm version minor --no-git-tag-version
$ git commit -m "release"
$ git push origin develop
$ npm publish --access public
```