import test from 'ava'

import { join } from 'path'
import { readFile, remove } from 'fs-extra'
import * as stdMock from 'std-mocks'

import n9SonarGenerate from '../src'

test('Should generate sonar-project.properties for the project', async (t) => {
	stdMock.use()
	const pkg = require(join(__dirname, '../../package.json'))
	const sonarPath = join(__dirname, '../../sonar-project.properties')
	await n9SonarGenerate()
	const file = await readFile(sonarPath, 'utf-8')
	t.is(file, `sonar.coverage.exclusions=${pkg.sonar['coverage.exclusions']}
sonar.ts.coverage.lcovReportPath=${pkg.sonar['ts.coverage.lcovReportPath']}
sonar.ts.tslint.path=${pkg.sonar['ts.tslint.path']}
sonar.ts.tslint.configPath=${pkg.sonar['ts.tslint.configPath']}
sonar.projectKey=${pkg.name}
sonar.projectName=${pkg.description}
sonar.projectVersion=${pkg.version}
sonar.sources=${pkg.sonar.sources}
sonar.sourceEncoding=${pkg.sonar.sourceEncoding}
sonar.tests=${pkg.sonar.tests}
`)
	stdMock.restore()
	const output = stdMock.flush()
	t.is(output.stdout.length, 4)
	t.is(output.stderr.length, 0)
	t.true(output.stdout[0].includes('[n9-sonar-generate] Reading package.json...'))
	t.true(output.stdout[1].includes('[n9-sonar-generate] Removing sonar-project.properties'))
	t.true(output.stdout[2].includes('[n9-sonar-generate] Generating sonar-project.properties'))
	t.true(output.stdout[3].includes('[n9-sonar-generate] Done'))
	await remove(sonarPath)
})

test('Should generate sonar-project.properties for foo-project/', async (t) => {
	stdMock.use()
	const pkg = require(join(__dirname, 'fixtures/foo-project/package.json'))
	const sonarPath = join(__dirname, 'fixtures/foo-project/sonar-project.properties')
	await n9SonarGenerate(join(__dirname, 'fixtures/foo-project/'))
	const file = await readFile(sonarPath, 'utf-8')
	pkg.sonar = pkg.sonar || {}
	t.is(file, `sonar.projectKey=${pkg.name}
sonar.projectName=${pkg.name}
sonar.projectVersion=${pkg.version}
sonar.sources=./src
sonar.sourceEncoding=UTF-8
sonar.tests=./test
`)
	stdMock.restore()
	const output = stdMock.flush()
	t.is(output.stdout.length, 4)
	t.is(output.stderr.length, 0)
	t.true(output.stdout[0].includes('[n9-sonar-generate] Reading package.json...'))
	t.true(output.stdout[1].includes('[n9-sonar-generate] Removing sonar-project.properties'))
	t.true(output.stdout[2].includes('[n9-sonar-generate] Generating sonar-project.properties'))
	t.true(output.stdout[3].includes('[n9-sonar-generate] Done'))
	await remove(sonarPath)
})

test('Should not generate if no package.json is found', async (t) => {
	stdMock.use()
	let exitCode = 0
	const processExit = new Promise((resolve) => {
		const oldExit = process.exit
		process.exit = (code) => {
			process.exit = oldExit
			exitCode = code
			resolve()
		}
	})
	await n9SonarGenerate('dont-exist/')
	await processExit
	stdMock.restore()
	const output = stdMock.flush()
	t.true(output.stdout[0].includes('Reading package.json'))
	t.true(output.stderr[0].includes('Could not locate package.json, aborting'))
})
