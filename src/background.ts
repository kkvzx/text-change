import camelCase from "lodash/camelCase";
import kebabCase from "lodash/kebabCase";
import lowerCase from "lodash/lowerCase";
import snakeCase from "lodash/snakeCase";
import startCase from "lodash/startCase";
import upperCase from "lodash/upperCase";

import OnClickData = chrome.contextMenus.OnClickData;

const options = [
    {id: 'copy-to-camel-case', title: 'copyToCamelCase'},
    {id: 'copy-to-kebab-case', title: 'copy-to-kebab-case'},
    {id: 'copy-to-lower-case', title: 'copy to lower case'},
    {id: 'copy-to-snake-case', title: 'copy_to_snake_case'},
    {id: 'copy-to-start-case', title: 'Copy To Start Case'},
    {id: 'copy-to-upper-case', title: 'COPY TO UPPER CASE'}
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

const handleCopyTransformation = async (info: OnClickData) =>{
    try {

        let selectionText = info.selectionText;
        const xd = kebabCase(selectionText);

        console.log('selectionText: ', selectionText);
        console.log('kebabCase: ', xd);
        switch (info.menuItemId) {
            case 'copy-to-camel-case':
                addToClipboard(camelCase(selectionText))
                break;
            case 'copy-to-kebab-case':
                addToClipboard(kebabCase(selectionText))
                break;
            case 'copy-to-lower-case':
                addToClipboard(lowerCase(selectionText))
                break;
            case 'copy-to-snake-case':
                addToClipboard(snakeCase(selectionText))
                break;
            case 'copy-to-start-case':
                addToClipboard(startCase(selectionText))
                break;
            case 'copy-to-upper-case':
                addToClipboard(upperCase(selectionText))
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