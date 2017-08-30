# n9-node-sonar-generate

Generate a `sonar-project.properties` file based on the project `package.json`.

[![npm version](https://img.shields.io/npm/v/@neo9/n9-node-sonar-generate.svg)](https://www.npmjs.com/package/@neo9/n9-node-sonar-generate)
[![Travis](https://img.shields.io/travis/neo9/n9-node-sonar-generate/master.svg)](https://travis-ci.org/neo9/n9-node-sonar-generate)
[![Coverage](https://img.shields.io/codecov/c/github/neo9/n9-node-sonar-generate/master.svg)](https://codecov.io/gh/neo9/n9-node-sonar-generate)
[![license](https://img.shields.io/github/license/neo9/n9-node-sonar-generate.svg)](https://github.com/neo9/n9-node-sonar-generate/blob/master/LICENSE)

## Installation

```bash
npm install --save-dev @neo9/n9-node-sonar-generate
```

## Usage

In your `package.json` add the end of your `test` script, add `n9-sonar-generate` command:

```json
{
  "scripts": {
    "test": "... && n9-sonar-generate"
  }
}
```

## Default

For this example, we asume that `pkg` is the representation of `package.json`.

`n9-sonar-generate` will create a `sonar-project.properties` file with these properties:

- `sonar.projectKey = pkg.name || pkg.sonar.projectKey`
- `sonar.projectName = pkg.description || pkg.sonar.projectName`
- `sonar.projectVersion = pkg.version || pkg.sonar.projectVersion`
- `sonar.sources = pkg.sonar.sources || ./src`
- `sonar.sourceEncoding = pkg.sonar.sourceEncoding || UTF-8`
- `sonar.tests = pkg.sonar.tests || ./test`

## Configuration

Every key added to the `sonar` property in the `package.json` will be added to `sonar-project.properties` with the `sonar.` prefix.

Example:

`package.json`

```json
{
  "sonar": {
    "host.url": "http://localhost:9000"
  }
}
```

Will add to `sonar-project.properties`:

```
sonar.host.url=http://localhost:9000
```

## TypeScript Project

To use with a TypeScript project, please add the following to your `package.json`:

Example:

```json
{
  "sonar": {
    "coverage.exclusions": "src/*.d.ts",
    "ts.coverage.lcovReportPath": "./coverage/lcov.info",
    "ts.tslint.path": "./node_modules/.bin/tslint",
    "ts.tslint.configPath": "./tslint.json"
  }
}
```

## Gitignore

Don't forget to add `sonar-project.properties` in your `.gitignore`
