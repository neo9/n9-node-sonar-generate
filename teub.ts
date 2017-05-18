import n9SonarGenerate from './src'

(async () => {
	const sonarProject = await n9SonarGenerate('teub')
	console.log(sonarProject)
})()
