function TextHighlighter(id, matchWhole)
{
    var searchIn = document.getElementById(id) || document.body;
    var hiliteTag = "EM";
    var skipTags = new RegExp("^(?:" + hiliteTag + "|SCRIPT|FORM|SPAN)$");
    var backgroundColor = "#ff6";
    var foregroundColor = "#000";
    var fontStyle = "inherit";
    var matchRegex = "";
    var matchWholeWord = matchWhole !== undefined ? matchWhole : false;
    this.matchCount = 0;

    // Generate Reular expression
    this.setRegex = function(input)
    {
        input = input.replace(/^[^\w]+|[^\w]+$/g, "");
        var re = "(" + input + ")";
        if (matchWholeWord) {
            re = "\\b" + re + "\\b";
        }
        matchRegex = new RegExp(re, "i");   //Case Insensitive
    };

    // Validate input text
    this.validateInput = function(node)
    {
        if (node === undefined || !node)
            return false;
        else if (!matchRegex)
            return false;
        else if (skipTags.test(node.nodeName))
            return false;
        else
            return true;
    };

    // Recursively apply word highlighting
    this.hiliteWords = function(node)
    {
        if (!this.validateInput(node))
            return;

        if (node.hasChildNodes()) {
            for (var i = 0; i < node.childNodes.length; i++)
                this.hiliteWords(node.childNodes[i]);
        }
        if (node.nodeType === 3) { // Text Node
            var regs = matchRegex.exec(node.nodeValue);
            if (regs) {
                var match = document.createElement(hiliteTag);
                match.appendChild(document.createTextNode(regs[0]));
                match.style.backgroundColor = backgroundColor;
                match.style.fontStyle = fontStyle;
                match.style.color = foregroundColor;

                var after = node.splitText(regs.index);
                after.nodeValue = after.nodeValue.substring(regs[0].length);
                node.parentNode.insertBefore(match, after);
                this.matchCount += 1;
            }
        }
        ;
    };

    // Erase highlighted text
    this.erase = function()
    {
        var arr = document.getElementsByTagName(hiliteTag);
        while (arr.length && (el = arr[0])) {
            var parent = el.parentNode;
            parent.replaceChild(el.firstChild, el);
            parent.normalize();
        }
    };

    // Show match count (-- match found)
    this.showMatchCount = function(){
        var matchCount = document.getElementById("matchCount");
        matchCount.innerHTML = "(" + this.matchCount + " match found)";
    };

    // Highlight text
    this.highlight = function(input)
    {
        this.erase();
        if (input === undefined || !input)
            return;
        this.setRegex(input);
        this.hiliteWords(searchIn);
        this.showMatchCount();
    };

}
