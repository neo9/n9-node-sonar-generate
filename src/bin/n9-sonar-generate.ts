#!/usr/bin/env node
import { resolve } from 'path'

import n9SonarGenerate from '../index'

let path = (process.argv[2] || '.')
path = resolve(process.cwd(), path)

n9SonarGenerate(path)
