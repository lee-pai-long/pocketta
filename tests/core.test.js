import fs from 'fs';

import { extract_urls_from_tabs_file } from '../src/core';


describe('extract_urls_from_tabs_file', () => {
    describe('When given a valid file_path', () => {

        const file_path = 'tabs.csv'

        const number_of_tabs = fs.readFileSync(file_path)
            .toString()
            .split('\n')
            .length

        it(
            'should return a list of tab objects with <title> and <url> for each one',
            () => {
                const tabs = extract_urls_from_tabs_file(file_path)

                expect(tabs).toBeInstanceOf(Array)
                expect(tabs).toHaveLength(number_of_tabs)

            }
        );
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

        )
    })
})
