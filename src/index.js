const core = require('@actions/core')
const { Client, LogLevel } = require('@notionhq/client')
const { markdownToBlocks } = require('@tryfabric/martian')
const fs = require('fs')


let action = require('./action.js');

action(core, Client, fs, markdownToBlocks);