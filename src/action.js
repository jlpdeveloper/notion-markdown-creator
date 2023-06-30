function action(core, Client, fs, markdownToBlocks){
    let notion = {};
    try {
        // `who-to-greet` input defined in action metadata file
        const filepath = core.getInput('filepath')
        const name = core.getInput('name')
        const token = core.getInput('token')
      
        const database = core.getInput('database')
      
        core.debug('Creating notion client ...')
        notion = new Client({
          auth: token,
          logLevel: LogLevel.ERROR
        })
        if (filepath.endsWith('.md')) {
          fs.readFile(filepath, 'utf-8', (err, data) => {
            if (err) {
              core.setFailed(err.message)
              return
            }
            addToNotion({
              content: data,
              name,
              database
            })
          })
        } else {
          addToNotion({
            content: filepath,
            name,
            database
          })
        }
      } catch (error) {
        core.setFailed(error.message)
      }
      function addToNotion (data) {
        const blocks = markdownToBlocks(data.content)
        core.debug('blocks: ' + JSON.stringify(blocks, null, 4))
        core.info('Creating page ...')
        notion.pages.create({
          parent: {
            database_id: data.database
          },
          properties: {
            Name: {
              title: [
                {
                  text: {
                    content: data.name
                  }
                }
              ]
            }
          },
          children: blocks
        }).then((result) => {
          core.debug(`${JSON.stringify(result, null, 4)}`)
          core.info('Successfully added Notion Page')
        })
      }
      
}

module.exports = action;