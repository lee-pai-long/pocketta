import fs from 'fs';

import { program  as cli } from 'commander';

import { extract_urls_from_tabs_file } from './src/core.js';
import { save_urls_to_pocket } from './src/core.js';


const DEFAULT_TABS_FILE_PATH = './tabs.csv'


function main() {

    cli 
        .name('pocketta')
        .description(
            'Save multiple urls to pocket.com at once.\n' +
            'If the `--file` option is ommitted,\n' +
            'we use the `tabs.csv` file present in\n' +
            'the root of the project as default.\n' +
            'Once the urls in the default file are saved without error,\n' +
            'we delete the file.'
        )
        .version(
            fs.readFileSync('./.node-version')
                .toString()
                .split('\n')[0]
        )
        .option('-f, --file <file>', 'path of the tabs file')
    ;
    cli.parse();

    const options = cli.opts();
    const tabs_file_path = options.file ? options.file : DEFAULT_TABS_FILE_PATH;

    let urls = []
    try {
        urls = extract_urls_from_tabs_file(tabs_file_path)
    } catch (e) {
        console.log(e.message)
        process.exit(1)
    }

    try {
        save_urls_to_pocket(urls)
    } catch (e) {
        console.log(e.message)
        process.exit(1)
    }

    process.exit(0)
}


main();


