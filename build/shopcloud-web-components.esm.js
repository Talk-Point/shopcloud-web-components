import { B as BUILD, c as consoleDevInfo, H, w as win, N as NAMESPACE, p as promiseResolve, g as globalScripts, b as bootstrapLazy } from './index-DiXnqvCp.js';
export { s as setNonce } from './index-DiXnqvCp.js';

/*
 Stencil Client Patch Browser v4.41.1 | MIT Licensed | https://stenciljs.com
 */

var patchBrowser = () => {
  if (BUILD.isDev && !BUILD.isTesting) {
    consoleDevInfo("Running in development mode.");
  }
  if (BUILD.cloneNodeFix) {
    patchCloneNodeFix(H.prototype);
  }
  const scriptElm = BUILD.scriptDataOpts ? win.document && Array.from(win.document.querySelectorAll("script")).find(
    (s) => new RegExp(`/${NAMESPACE}(\\.esm)?\\.js($|\\?|#)`).test(s.src) || s.getAttribute("data-stencil-namespace") === NAMESPACE
  ) : null;
  const importMeta = import.meta.url;
  const opts = BUILD.scriptDataOpts ? (scriptElm || {})["data-opts"] || {} : {};
  if (importMeta !== "") {
    opts.resourcesUrl = new URL(".", importMeta).href;
  }
  return promiseResolve(opts);
};
var patchCloneNodeFix = (HTMLElementPrototype) => {
  const nativeCloneNodeFn = HTMLElementPrototype.cloneNode;
  HTMLElementPrototype.cloneNode = function(deep) {
    if (this.nodeName === "TEMPLATE") {
      return nativeCloneNodeFn.call(this, deep);
    }
    const clonedNode = nativeCloneNodeFn.call(this, false);
    const srcChildNodes = this.childNodes;
    if (deep) {
      for (let i = 0; i < srcChildNodes.length; i++) {
        if (srcChildNodes[i].nodeType !== 2) {
          clonedNode.appendChild(srcChildNodes[i].cloneNode(true));
        }
      }
    }
    return clonedNode;
  };
};

patchBrowser().then(async (options) => {
  await globalScripts();
  return bootstrapLazy([["sc-query-field",[[1,"sc-query-field",{"fields":[1],"inputClass":[1,"input-class"],"filters":[32],"inputValue":[32],"suggestions":[32],"currentStep":[32],"contextMenuVisible":[32]}]]],["sc-spreadsheet-uploader",[[1,"sc-spreadsheet-uploader",{"storageKey":[1,"storage-key"],"apiUrl":[1,"api-url"],"apiMethod":[1,"api-method"],"apiHeaders":[1,"api-headers"],"parsedData":[32],"isProcessing":[32]}]]],["sc-taxonomy",[[1,"sc-taxonomy",{"url":[1],"name":[1],"value":[1],"inputValue":[32],"suggestions":[32],"allData":[32],"contextMenuVisible":[32]}]]],["sc-textarea",[[1,"sc-textarea",{"suggestionUrl":[1,"suggestion-url"],"textareaClass":[1,"textarea-class"],"suggestions":[32],"filteredSuggestions":[32],"showSuggestions":[32],"currentInputValue":[32],"mentionStartIndex":[32],"highlightIndex":[32],"caretCoords":[32]},[[8,"keydown","handleKeyDown"]]]]]], options);
});
