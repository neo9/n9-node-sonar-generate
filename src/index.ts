import { join } from 'path'

import { remove, writeFile } from 'fs-extra'
import * as appRootDir from 'app-root-dir'
import n9Log from '@neo9/n9-node-log'

const log = n9Log('n9-sonar-generate')
const SONAR_FILENAME = 'sonar-project.properties'

export default async function(path?: string): Promise<string> {
	// Default options
	path = path || appRootDir.get()
	// Fetch package.json
	log.info('Reading package.json...')
	let pkg
	try {
		pkg = require(join(path, 'package.json'))
	} catch (err) {
		log.error('Could not locate package.json, aborting.')
		process.exitCode = 1
		return
	}
	// Remove sonar project file
	log.info(`Removing ${SONAR_FILENAME}...`)
	await remove(join(path, SONAR_FILENAME))
	// Add sonar keys
	const sonar = pkg.sonar || {}
	sonar.projectKey = (sonar.projectKey || pkg.name).replace(/@/g, '').replace(/\//g, ':')
	sonar.projectName = sonar.projectName || pkg.description || sonar.projectKey
	sonar.projectVersion = sonar.projectVersion || pkg.version
	sonar.sources = sonar.sources || './src'
	sonar.sourceEncoding = sonar.sourceEncoding || 'UTF-8'
	sonar.tests = sonar.tests || './test'
	// Generate file content
	let content = ''
	Object.keys(sonar).forEach((key) => {
		content += `sonar.${key}=${sonar[key]}\n`
	})
	// Create file
	log.info(`Generating ${SONAR_FILENAME}...`)
	await writeFile(join(path, SONAR_FILENAME), content, { encoding: 'utf-8' })
	log.info(`Done`)
	// Return content generated
	return content
}
