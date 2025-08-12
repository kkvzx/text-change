import camelCase from "lodash/camelCase";
import kebabCase from "lodash/kebabCase";
import lowerCase from "lodash/lowerCase";
import snakeCase from "lodash/snakeCase";
import startCase from "lodash/startCase";
import upperCase from "lodash/upperCase";

import OnClickData = chrome.contextMenus.OnClickData;
import {OptionId} from "../types/optionId.ts";

interface Option {
    id: OptionId,
    title: string
}

const options: Option[] = [
    {id: OptionId.KebabCase, title: 'copy-to-kebab-case'},
    {id: OptionId.CamelCase, title: 'copyToCamelCase'},
    {id: OptionId.LowerCase, title: 'copy to lower case'},
    {id: OptionId.SnakeCase, title: 'copy_to_snake_case'},
    {id: OptionId.StartCase, title: 'Copy To Start Case'},
    {id: OptionId.UpperCase, title: 'COPY TO UPPER CASE'}
];

const addToClipboard = async (text: string) => {
    await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: [chrome.offscreen.Reason.CLIPBOARD],
        justification: 'Write text to the clipboard.'
    })

    // Now that we have an offscreen document, we can dispatch the
    // message.
    chrome.runtime.sendMessage({
        type: 'copy-data-to-clipboard',
        target: 'offscreen-doc',
        data: text
    });
}

const handleCopyTransformation = async (info: OnClickData) => {
    try {

        let selectionText = info.selectionText;

        switch (info.menuItemId) {
            case OptionId.KebabCase:
                void addToClipboard(kebabCase(selectionText))
                break;
            case OptionId.CamelCase:
                void addToClipboard(camelCase(selectionText))
                break;
            case OptionId.LowerCase:
                void addToClipboard(lowerCase(selectionText))
                break;
            case OptionId.SnakeCase:
                void addToClipboard(snakeCase(selectionText))
                break;
            case OptionId.StartCase:
                void addToClipboard(startCase(selectionText))
                break;
            case OptionId.UpperCase:
                void addToClipboard(upperCase(selectionText))
                break;
        }
    } catch (error) {
        console.log('Text Change: Copying error.');
        console.log(error);
    }
}

options.forEach(({id, title}) => {
    chrome.contextMenus.create({
        id,
        title,
        contexts: ["selection"],
    })
})

chrome.contextMenus.onClicked.addListener(handleCopyTransformation)