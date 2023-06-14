import { load_tabs_file } from '../src/core';
const fs = require("fs");


describe('load_tabs_file', () => {
    describe('When given a valid file_path', () => {

        const file_path = 'tabs.csv'

        const number_of_tabs = fs.readFileSync(file_path)
            .toString()
            .split('\n')
            .length

        it(
            'should return a list of tab objects with <title> and <url> for each one',
            () => {
                
                const tabs = load_tabs_file(file_path)
                
                expect(tabs).toBeInstanceOf(Array)
                expect(tabs).toHaveLength(number_of_tabs)

                for (const tab of tabs){
                    expect(tab).toBeInstanceOf(Object)
                    expect(tab).toHaveProperty('title')
                    expect(tab).toHaveProperty('url')
                }
            }
        );
    })
})
