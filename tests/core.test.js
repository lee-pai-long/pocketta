import fs from 'fs';

import { extract_urls_from_tabs_file } from '../src/core';

import CONFIG from '../src/config.json';


describe('extract_urls_from_tabs_file', () => {
    describe('When given a valid file_path', () => {

        const file_path = './tests/tabs.csv'

        const number_of_urls = fs.readFileSync(file_path)
            .toString()
            .split('\n')
            .filter(
                ( line ) => {
                    for (const to_exclude of CONFIG.exclude) {
                        if ( !line.includes(to_exclude) ) {
                            return line
                        }
                    }
                }
            )
            .length

        const urls = extract_urls_from_tabs_file(file_path)

        it(
            'should return a list of urls extracted from the given file',
            () => {
                expect(urls).toBeInstanceOf(Array)
                expect(urls).toHaveLength(number_of_urls)
            }
        );

        it(
            'should exclude any link for which the domain is in the CONFIG.exclude list',
            () => {
                urls.filter(
                    ( line ) => {
                        for (const to_exclude of CONFIG.exclude) {
                            expect(line.includes(to_exclude)).toBe(false);
                        }
                    }
                )
            }
        )
    }),
    describe('When given a invalid file_path', () => {
        it(
            'should throw an exception with a clean message',
            () => {
                const bad_path = 'bad/path'
                try {
                    extract_urls_from_tabs_file(bad_path)
                } catch (e) {
                    expect(e.message).toContain(
                        `Unable to load tab file '${bad_path}'`
                    )
                }
            }

        );
    })
})
