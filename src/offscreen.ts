import {MessageEvent} from "../types/messageEvent.ts";

chrome.runtime.onMessage.addListener(handleMessages);

// This function performs basic filtering and error checking on messages before
// dispatching the message to a more specific message handler.
async function handleMessages(message: MessageEvent) {
    // Return early if this message isn't meant for the offscreen document.
    if (message.target !== 'offscreen-doc') {
        return;
    }

    // Dispatch the message to an appropriate handler.
    switch (message.type) {
        case 'copy-data-to-clipboard':
            void handleClipboardWrite(message.data);
            break;
        default:
            console.warn(`Unexpected message type received: '${message.type}'.`);
    }
}

// We use a <textarea> element for two main reasons:
//  1. preserve the formatting of multiline text,
//  2. select the node's content using this element's `.select()` method.
const textEl = document.querySelector<HTMLTextAreaElement>('#text');

// Use the offscreen document's `document` interface to write a new value to the
// system clipboard.
//
// The `navigator.clipboard` API
// requires that the window is focused, but offscreen documents cannot be
// focused. As such, we have to fall back to `document.execCommand()`.
const handleClipboardWrite = async (data: string) => {
    try {
        if(!textEl){
            console.warn('textArea not found')
            return;
        }

        textEl.value = data;
        textEl.select();
        document.execCommand('copy');
    } finally {
        // Job's done! Close the offscreen document.
        window.close();
    }
}