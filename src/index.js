const { CONFIG } = require('./config')
const { deepFlatten } = require('./helper')
const { generateDocSection, writeToDoc } = require('./docx')

const run = async () => {
    // generate document section from target folder 
    const documentSection = await generateDocSection(CONFIG.directory)

    // flat the document section array
    const flatDocumentSection = deepFlatten(documentSection);

    // write document section to docx file
    writeToDoc(flatDocumentSection)

}

run()