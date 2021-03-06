interface IListener {
  (message: any, sender: browser.runtime.MessageSender, sendResponse: () => void): void;
}

var listeners = new Map();

/**
 * Send a message to another part of the extension
 */
export function sendMessage<R>(operation: string, message: any = {}): Promise<R> {
  // Extend message with one custom property
  message._chrome_operation = operation;

  return new Promise<R>((resolve, reject) => {
    // Send message and look at response.error
    browser.runtime.sendMessage(message, undefined, (response: R) => {
      if (browser.runtime.lastError) {
        reject(browser.runtime.lastError);

      } else if (response && response.error) {
        reject(response);

      } else {
        resolve(response);
      }
    });
  });
}

/**
 * Collective listener
 */
const globalHandler: IListener = function globalHandler(message, sender, sendResponse) {
  let listener = listeners.get(message._chrome_operation);
  if (listener) {
    listener(message, sender, sendResponse);
  }
}

/**
 * Add a message listener. Only accepts one listener for each operation value.
 * To un-listen, just do this:
 *   onMessage('operation name', null)
 */
export function onMessage(operation: string, handler?: (data: any => void) | null) {
  if (listeners.size === 0) {
    browser.runtime.onMessage.addListener(globalHandler);
  }
  listeners.set(operation, handler);
}