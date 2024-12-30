# Web-Components

Shopcloud Web Components - [Storybook](https://talk-point.github.io/shopcloud-web-components/).

## Development

```sh
$ npm install
$ npm run start
```

## Deploy

```sh
# Deploy NPM Package
$ rm -rf dist
$ npm run build --prod
$ npm version minor --no-git-tag-version
$ git commit -m "release"
$ git push origin develop
$ npm publish --access public

# Deploy Storybook to Github Pages
$ npm run postbuild
$ npm run publish
```