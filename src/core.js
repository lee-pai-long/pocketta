const fs = require("fs");
const { parse } = require("csv-parse");


/**
 * Read a tabs csv file with url and title separated by an '|'
 * and return a tabs array containing tab object with attributes 'url' and 'title'
 *
 * @param {String} tabs_file_path - the path of the file to load
 * @returns {Array} - an array of tabs(url, title)
 */
export function load_tabs_file(tabs_file_path) {
    
    let raw_tabs = []
    try {
        raw_tabs = fs.readFileSync(tabs_file_path)
            .toString()
            .split('\n')
    } catch (e) {
        throw new Error(
            `Unable to load tab file '${tabs_file_path}'`,
            { cause: e }
        );
    }

    const tabs = []
    for (const raw_tab of raw_tabs){
        const splitted_tab = raw_tab.split('|')
        const tab = {'url': splitted_tab.shift()}
        tab['title'] = (
            splitted_tab.length > 1 
            ? splitted_tab.join(' ')
            : splitted_tab[0]
        )
        tabs.push(tab)
    }

    return tabs
}
