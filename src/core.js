const fs = require("fs");


/**
 * Read a tabs csv file with url and title separated by an '|'
 * and return an array of the urls
 *
 * @param {String} tabs_file_path - the path of the file to load
 * @returns {Array} - an array of urls
 */
export function extract_urls_from_tabs_file(tabs_file_path) {
    
    let lines = []
    try {
        lines = fs.readFileSync(tabs_file_path)
            .toString()
            .split('\n')
    } catch (e) {
        throw new Error(
            `Unable to load tab file '${tabs_file_path}'`,
            { cause: e }
        );
    }

    return lines.map(( line ) => line.split('|')[0].trim())
}
