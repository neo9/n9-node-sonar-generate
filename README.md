# n9-node-sonar-generate

Generate a `sonar-project.properties` file based on the project `package.json`.


## Installation

```bash
npm install --save-dev n9-node-sonar-generate
```

## Usage

In your `package.json` add a `postinstall` script:

```json
{
    "scripts": {
        "postinstall": "n9-sonar-generate"
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
    "ts.coverage.lcovReportPath": "./coverage/lcov.info",
    "ts.tslint.path": "./coverage/lcov.info",
    "ts.tslint.path": "./node_modules/.bin/tslint",
    "ts.tslint.configPath": "./tslint.json"
}
```