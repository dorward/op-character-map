const {username, password, site } = require('./config.json')
import obsidianportal from './lib/obsidian-portal'

obsidianportal(username, password)

process.stdout.write('test')