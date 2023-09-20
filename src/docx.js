const fs = require('fs').promises;
const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    UnderlineType,
} = require('docx')
const { CONFIG } = require('./config')

/** generate document paragraph with title and content */
const generateParagraph = (title, content) => {
    return new Paragraph({
        children: [
            new TextRun({ text: '', break: 2 }),
            new TextRun({
                text: title,
                bold: true,
                italics: true,
                underline: {
                    type: UnderlineType.SINGLE
                }
            }),
            new TextRun({ text: '', break: 1 }),
            new TextRun({
                text: content,
            }),
        ],
    })
}

/** generate document section from target directory */
const generateDocSection = async (directoryPath) => {
    try {
        const documentParagraph = []

        const files = await fs.readdir(directoryPath);

        for (const file of files) {
            const filePath = `${directoryPath}/${file}`;
            const fileStat = await fs.stat(filePath);

            if (fileStat.isFile()) {
                if (CONFIG.extension.some(it => file.endsWith(it))) {
                    const fileContent = await fs.readFile(filePath, 'utf8');
                    // generate paragraph
                    const paragraph = generateParagraph(filePath, fileContent)
                    documentParagraph.push(paragraph)
                }
            } else {
                if (CONFIG.depth) {
                    // deep generate from child folder
                    const childParagraph = await generateDocSection(filePath)
                    documentParagraph.push(childParagraph)
                }
            }
        }

        return documentParagraph
    } catch (error) {
        console.error('Error reading files:', error);
        return []
    }
}

/** write document section to the docx file */
const writeToDoc = async (sectionChildren) => {
    try {
        const children = Array.isArray(sectionChildren) ? sectionChildren : [sectionChildren]

        const document = new Document({
            sections: [{
                children
            }],
        });

        const docBuffer = await Packer.toBuffer(document);

        await fs.writeFile(CONFIG.fileName, docBuffer);

        console.log(`🎉 Write to doc succeed, Total ${children.length} file.`)
    } catch (err) {
        console.log('🐛 Write to doc error : ', err)
    }
}

module.exports = {
    generateParagraph,
    generateDocSection,
    writeToDoc,
}