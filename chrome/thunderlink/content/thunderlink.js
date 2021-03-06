/* eslint-disable no-undef */
/*
   ThunderLink.
   Link from your browser to your email messages!

   Copyright (C) 2011 Christoph Zwirello
   Copyright (C) 2018 Mike Hardy <mike@mikehardy.net>

   This Source Code Form is subject to the terms of the Mozilla Public
   License, v. 2.0. If a copy of the MPL was not distributed with this
   file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
Components.utils.import("resource://thunderlinkModules/thunderlinkModule.js");

var ThunderLinkChromeNS = {

  CopyStringToClpBrd: function CopyStringToClpBrd(string) {
    try {
      console.log("CopyMessageUrlToClp mailboxMsgUrl: " + string + "\n");
      var clipboard = Components.classes["@mozilla.org/widget/clipboardhelper;1"]
        .getService(Components.interfaces.nsIClipboardHelper);
      clipboard.copyString(string);
    } catch (ex) {
      console.error(ex);
    }
  },

  CopyMessageUrlToClp: function CopyMessageUrlToClp() {
    ThunderLinkChromeNS.CopyStringToClpBrd(ThunderLinkChromeNS.GetThunderlink());
  },

  ActivateCustomTlString: function ActivateCustomTlString(cstrnum) {
    console.log("CopyCustomTlStringToClp: cstrnum: " + cstrnum + "\n");
    var prefService = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefService)
      .getBranch("extensions.thunderlink.");

    var customTlStr = prefService.getCharPref("custom-tl-string-" + cstrnum);
    console.log("ActivateCustomTlString: customTlStr: " + customTlStr + "\n");
    var copyToClipboardActive = prefService.getBoolPref("custom-tl-string-" + cstrnum + "-clipboard-checkbox");
    console.log("ActivateCustomTlString: copyToClipboardActive: " + copyToClipboardActive + "\n");
    var tagActive = prefService.getBoolPref("custom-tl-string-" + cstrnum + "-tagcheckbox");
    console.log("ActivateCustomTlString: tagActive: " + tagActive + "\n");
    var appendToFileActive = prefService.getBoolPref("custom-tl-string-" + cstrnum + "-appendtofile-checkbox");
    console.log("ActivateCustomTlString: appendToFileActive: " + appendToFileActive + "\n");

    var selectedMsgHeaders = gDBView.getSelectedMsgHdrs();
    var selectionDelimiter = prefService.getCharPref("custom-tl-string-" + cstrnum + "-selection-delimiter");
    var i = 0;

    // activate
    if (tagActive) {
      for (i = 0; i < selectedMsgHeaders.length; i++) {
        this.TagEmail(prefService.getIntPref("custom-tl-string-" + cstrnum + "-tag"), selectedMsgHeaders[i]);
      }
    }

    if (copyToClipboardActive) {
      var procCustomTlStr = "";
      for (i = 0; i < selectedMsgHeaders.length; i++) {
        var currentHeaderText = replaceVariables(customTlStr, selectedMsgHeaders[i]);
        procCustomTlStr += currentHeaderText;
        console.log("ActivateCustomTlString: procCustomTlStr resolved[" + i + "]: " + currentHeaderText + "\n");
        if ((i + 1) !== selectedMsgHeaders.length) {
          procCustomTlStr += convertEscapeCharacters(selectionDelimiter);
        }
      }
      procCustomTlStr = ThunderLinkChromeNS.FixNewlines(procCustomTlStr);
      console.log("ActivateCustomTlString: procCustomTlStr newlines fixed: " + procCustomTlStr + "\n");
      ThunderLinkChromeNS.CopyStringToClpBrd(procCustomTlStr);
    }

    if (appendToFileActive) {
      var filePath = prefService.getCharPref("custom-tl-string-" + cstrnum + "-appendtofile-path");
      console.log("ActivateCustomTlString: filePath: " + customTlStr + "\n");
      // eslint-disable-next-line max-len
      ThunderLinkChromeNS.AppendToFile(selectedMsgHeaders, customTlStr, filePath, selectionDelimiter);
    }
  },

  AppendToFile: function AppendToFile(hdrs, messageTemplate, filePath, selectionDelimiter) {
    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
      .getService(Components.interfaces.nsIPromptService);

    var alertTemplate = "Subject: <subject>\\nFrom: <sender> on <time>\\n\\n";

    try {
      // eslint-disable-next-line max-len
      var alertText = appendThunderlinkToFile(hdrs, messageTemplate, alertTemplate, filePath, selectionDelimiter);
      prompts.alert(null, "Thunderlink", alertText);
    } catch (err) {
      console.log(err);
      prompts.alert(null, "Thunderlink Error", "There is an error appending to file: \"" + filePath + "\".\nReason:\n" + err);
    }
  },

  TagEmail: function TagEmail(keywordIx, hdr) {
    console.log("TagEmail: keywordIx: " + keywordIx);
    var keywords = "" + hdr.getStringProperty("keywords");
    console.log("TagEmail: current keywords: " + keywords);

    function addKeywordToList(addKeywords, addKeywordIx) {
      var keyword = "$label" + addKeywordIx;
      if (addKeywords.includes(keyword)) return addKeywords;
      // eslint-disable-next-line no-param-reassign
      addKeywords += " " + keyword;
      console.log("TagEmail: keywords after processing: " + addKeywords);
      return addKeywords;
    }
    var msg = Components.classes["@mozilla.org/array;1"]
      .createInstance(Components.interfaces.nsIMutableArray);
    msg.clear();
    msg.appendElement(hdr, false);

    hdr.folder.addKeywordsToMessages(msg, addKeywordToList(keywords, keywordIx));
    hdr.folder.msgDatabase.Close(true);
    // eslint-disable-next-line no-param-reassign
    hdr.folder.msgDatabase = null;
  },

  FixNewlines: function FixNewlines(tlstring) {
    var osString = Components.classes["@mozilla.org/xre/app-info;1"]
      .getService(Components.interfaces.nsIXULRuntime).OS;

    var result = tlstring;
    if (osString === 'WINNT') result = tlstring.replace(/[\r]?\n/g, "\r\n");
    return result;
  },

  GetCustomTlStringTitle: function GetCustomTlStringTitle(cstrnum) {
    var prefService = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefService)
      .getBranch("extensions.thunderlink.");

    return prefService.getCharPref("custom-tl-string-" + cstrnum + "-title");
  },

  OnTlMenuLoad: function OnTlMenuLoad() {
    function createCstrMenuItem(cstrnum) {
      var label = ThunderLinkChromeNS.GetCustomTlStringTitle(cstrnum);
      // Skip when title is not configured or temporary unused
      if (!label.length || label.match(/^\./)) return null;

      var XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
      var item = window.document.createElementNS(XUL_NS, "menuitem");
      item.setAttribute("label", ThunderLinkChromeNS.ConvertToUnicode(label));
      item.addEventListener("command", () => { ThunderLinkChromeNS.ActivateCustomTlString(cstrnum); }, false);
      return item;
    }
    var popup = window.document.getElementById("thunderlink-custom-strings");

    if (popup.hasChildNodes()) {
      while (popup.firstChild) {
        popup.removeChild(popup.firstChild);
      }
    }

    // Add only valid menuitems
    for (var i = 1; i <= 8; i++) {
      var menuitem = createCstrMenuItem(i);
      if (menuitem) popup.appendChild(menuitem);
    }
  },

  ConvertToUnicode: function ConvertToUnicode(string) {
    var converter = Components
      .classes["@mozilla.org/intl/scriptableunicodeconverter"]
      .createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
    converter.charset = "UTF-8";
    // FIXME This can throw exceptions? NS_ERROR_ILLEGAL_INPUT if there are Spanish accents etc
    return converter.ConvertToUnicode(string);
  },

  OpenThunderlinkFromClipboard: function OpenThunderlinkFromClipboard() {
    var trans = Cc["@mozilla.org/widget/transferable;1"].createInstance(Ci.nsITransferable);
    trans.init(null); trans.addDataFlavor("text/unicode");
    Services.clipboard.getData(trans, Services.clipboard.kGlobalClipboard);
    var str = {};
    var strLength = {};
    trans.getTransferData("text/unicode", str, strLength);
    var pastetext = str.value.QueryInterface(Ci.nsISupportsString).data;
    openThunderlink(pastetext);
  },
};
