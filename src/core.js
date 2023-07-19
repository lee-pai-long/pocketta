import fs from 'fs';

import request from 'sync-request';

import { getReasonPhrase } from 'http-status-codes';

import CONFIG from './config.json';


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

    return lines
        .filter(
            ( line ) => {
                for (const to_exclude of CONFIG.exclude) {
                    if ( !line.includes(to_exclude) ) {
                        return line
                    }
                }
            }
        )
        .map(
            ( line ) => line.split('|')[0].trim()
        )
}


/**
 * Use pocket API to bulk save the given list of urls
 * @param {Array} urls - an array containing the urls to save to pocket
 * @returns {Array} - an array of urls
 * @throws {Error} - in case the pocket API call doesn't return a successful response
 */
export function save_urls_to_pocket(urls) {

    const error_message = "Saving urls to pocket failed: "

    const http_response = request(
        'POST',
        "https://getpocket.com/v3/send",
        {
            json: {
                "consumer_key": process.env.POCKET_CONSUMER_KEY,
                "access_token": process.env.POCKET_ACCESS_TOKEN,
                "actions": urls.map( url => ({action: 'add', url: url}))
            },
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Accept': 'application/json'
            }
    });

    let pocket_error = http_response.headers['X-Error'] || "";

    if (http_response.statusCode != 200) {
        throw new Error(
            error_message +
            `${http_response.statusCode} - ` +
            `${getReasonPhrase(http_response.statusCode)} - ` +
            `${pocket_error}`
        )
    };

    const pocket_response = JSON.parse(
        http_response.getBody().toString()
    );

    if (
        pocket_response.action_errors &&
        !!pocket_response.action_errors[0]
    ) {
        for (const error of pocket_response.action_errors) {
            console.log(error)
        }
    } else {
        console.log(
            "All URLs from the file were uploaded to pocket"
        );
    }

    return true
}
