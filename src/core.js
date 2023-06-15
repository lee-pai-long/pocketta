import fs from 'fs';

import axios from 'axios';

import 'axios-debug-log';

/**
 * Read a tabs csv file with url and title separated by an '|'
 * and return an array of the urls
 *
 * @param {String} tabs_file_path - the path of the file to load
 * @returns {Array} - an array of urls
 * @throws {Error} - in case loading the tabs file fails
 */
export function extract_urls_from_tabs_file(tabs_file_path) {
    let lines = []
    try {
        lines = fs.readFileSync(tabs_file_path)
            .toString()
            .split('\n')
    } catch (e) {
        throw new Error(
            `Unable to load tab file '${tabs_file_path}': ${e.message}`,
            { cause: e }
        );
    }

    return lines.map(( line ) => line.split('|')[0].trim())
}


/**
 * Use pocket API to bulk save the given list of urls
 * @param {Array} urls - an array containing the urls to save to pocket
 * @returns {Array} - an array of urls
 * @throws {Error} - in case the pocket API call doesn't return a successful response
 */
export function save_urls_to_pocket(urls) {

    axios
        .post(
            "https://getpocket.com/v3/send",
            {
                "consumer_key": process.env.POCKET_CONSUMER_KEY,
                "access_token": process.env.POCKET_ACCESS_TOKEN,
                "actions": urls.map( url => ({action: 'add', url: url}))
            },
            {
                "headers": {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'X-Accept': 'application/json'
                }
            }
        )
            .then(function (response) {
                if (response.data.action_results.length == urls.length) {
                    console.log("All urls successfully saved in pocket");
                }
            })
            .catch(function (error) {
                console.log("Unable to save urls in pocket: " + error);
            });

    return true
}
