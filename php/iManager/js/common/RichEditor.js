/*global window:false, define:false, document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**
 * 富文本编辑器
 */
define('common/RichEditor', [], function(require) {
    var $ = require('jQuery'),
        Util = require('Util'),
        Events = require('Events'),
        GDOM = require('GDOM'),
        Keys = {
            DEL: 8,
            TAB: 9,
            LEFT: 37,
            RIGHT: 39,
            UP: 38,
            DOWN: 40,
            B: 66,
            I: 73,
            CTRL: 17,
            SHIFT: 16,
            ALT: 18,
            ENTER: 13
        },
        /**
         * 颜色面板
         * @type {Array}
         */
        Colors = ['#000000', '#333399', '#000080', '#003366', '#003300', '#333300', '#993300', '#FFFFFF', '#666699', '#0000ff', '#008080', '#008000', '#808000', '#ff6600', '#800000', '#808080', '#800080', '#3366ff', '#33cccc', '#339966', '#99cc00', '#ff9900', '#ff0000', '#999999', '#993366', '#00ccff', '#00ffff', '#00ff00', '#ffff00', '#ffcc00', '#ff00ff', '#c0c0c0', '#cc99ff', '#99ccff', '#ccffff', '#ccffcc', '#ffff99', '#ffcc99', '#ff99cc', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#FFFFFF'],
        /**
         * 支持的字体
         * @type {Array}
         */
        FontFamily = [{
            'label': '宋体',
            'value': '宋体'
        }, {
            'label': '黑体',
            'value': '黑体'
        }, {
            'label': '楷体_GB2312',
            'value': '楷体_GB2312'
        }, {
            'label': '隶书',
            'value': '隶书'
        }, {
            'label': '幼圆',
            'value': '幼圆'
        }, {
            'label': 'Arial',
            'value': 'Arial'
        }, {
            'label': 'Tahoma',
            'value': 'Tahoma'
        }, {
            'label': 'Times New Roman',
            'value': 'Times New Roman'
        }, {
            'label': 'Courier New',
            'value': 'Courier New'
        }, {
            'label': 'Sans-serif',
            'value': 'Sans-serif'
        }, {
            'label': 'Verdana',
            'value': 'Verdana'
        }],
        /**
         * 富文本编辑器 特效功能集合
         */
        Plugins = {},

        /**
         * rootNode子节点允许的 标签
         * @type {Array}
         */
        TopNodeName = ['P', 'UL', 'OL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
        /**
         * 支持的 块级元素
         * @type {Array}
         */
        BlockNodeName = ['BODY', 'P', 'DIV', 'UL', 'OL', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
        /**
         * 公告事件管理对象
         * @type {Events}
         */
        EditorEvent = new Events();

    /***********************************
     *                      工具函数类
     ***********************************/
    /**
     * 工具函数
     * @module RichEditor
     * @class EditorUtil
     */
    var EditorUtil = {
        editor: null,
        eleEle: null,
        setEditor: function(editor) {
            this.editor = editor;
            this.eleEle = this.getRoot().lastChild;
        },
        /**
         * 获得 编辑器的 Window
         * @method getWindow
         * @return {Object} window|null
         */
        getWindow: function() {
            return this.editor ? this.editor.getWindow() : null;
        },
        /**
         * 获得 编辑器的 document
         * @method getDocument
         * @return {Object} document|null
         */
        getDocument: function() {
            return this.editor ? this.editor.getDocument() : null;
        },
        /**
         * 获得 编辑器的 body
         * @method getRoot
         * @return {Object} document|null
         */
        getRoot: function() {
            return this.editor ? this.editor.getRoot() : null;
        },
        getBody: function() {
            return this.editor ? this.editor.getRoot() : null;
        },
        /**
         * 获得当前 selection
         * @method getSelection
         * @return {object} selection|null
         */
        getSelection: function() {
            var window = this.getWindow();
            if (window.getSelection) {
                return window.getSelection();
            } else if (window.document.getSelection) {
                return window.document.getSelection();
            } else if (window.document.selection) {
                return window.document.selection;
            }
            return null;
        },
        /**
         * 获得 Ranges
         * @method getRange
         * @return {array} Ranges
         */
        getRanges: function() {
            var selection = this.getSelection(),
                ranges = [],
                ii = 0;
            if (selection) {
                if (selection.getRangeAt) {
                    for (ii = 0; ii < selection.rangeCount; ii += 1) {
                        ranges.push(selection.getRangeAt(ii));
                    }
                } else if (selection.createRange) {
                    ranges.push(selection.createRange());
                }
            }
            return ranges;
        },
        getRange: function() {
            var selection = this.getSelection();

            if (selection) {
                if (selection.getRangeAt) {
                    return selection.getRangeAt(0);
                } else if (selection.createRange) {
                    return selection.createRange();
                }
            }
            return null;
        },
        cacheRange: function() {
            this._range = this.getRanges();
        },
        lastRange: function() {
            return this._range;
        }
    };

    /**
     * DOM操作
     * @type {Object}
     */
    var DOM = {
        /**
         * 强制 root 下的子元素为 块元素；
         * @param{boolean} holdRange 是否要保持Range位置
         */
        forceBlocks: function(holdRange) {
            var node = Range.getRootStart(),
                range = EditorUtil.getRange(),
                doc = EditorUtil.getDocument(),
                rootNode = EditorUtil.getRoot(),
                wrapped = false,
                rootBlockNode = null,
                tempNode = null;

            DOM.parseFont();
            //无效元素
            if (!node || node.nodeType !== 1) {
                return;
            }

            // 检测是否已经是块级元素
            while (node && node != rootNode) {
                if (TopNodeName.indexOf(node.nodeName) >= 0) {
                    return;
                }

                node = node.parentNode;
            }

            if (holdRange !== false) {
                Range.hold();
            }
            // Wrap non block elements and text nodes
            node = rootNode.firstChild;
            while (node) {

                if (node.nodeType === 3 || (node.nodeType == 1 && TopNodeName.indexOf(node.nodeName) < 0)) {
                    // Remove empty text nodes
                    if (node.nodeType === 3 && node.nodeValue.length == 0) {
                        tempNode = node;
                        node = node.nextSibling;
                        DOM.remove(tempNode);
                        continue;
                    }

                    if (BlockNodeName.indexOf(node.nodeName) < 0) {
                        //新建元素，替换当前元素
                        if (!rootBlockNode) {
                            rootBlockNode = doc.createElement('p');
                            DOM.insertBefore(rootBlockNode, node);
                            wrapped = true;
                        }

                        tempNode = node;
                        node = node.nextSibling;
                        rootBlockNode.appendChild(tempNode);
                    }
                    //更改当前元素 nodeName
                    else {
                        tempNode = node;
                        node = node.nextSibling;
                        DOM.replaceNodeName(tempNode, 'p');
                    }
                    continue;
                } else {
                    rootBlockNode = null;
                }

                node = node.nextSibling;
            }

            wrapped && holdRange !== false && Range.refresh();

            return true;
        },
        /**
         * 获得 作为 root 子元素的 node 或 node 的父元素
         * @param  {DOM Object} node 特定元素
         * @return {DOM Object}      root子元素
         */
        getRootParent: function(node) {
            var rootNode = EditorUtil.getRoot();
            //找到最顶端元素
            while (node && node !== rootNode && node.parentNode !== rootNode) {
                node = node.parentNode;
            }

            return node;
        },
        /**
         * 获得 作为 root 子元素的 node 或 node 的父元素
         * @param  {DOM Object} node 特定元素
         * @return {DOM Object}      root子元素
         */
        getClosestBlockNode: function(node) {
            var rootNode = EditorUtil.getRoot();
            //找到最顶端元素
            while (node && node !== rootNode && node.parentNode !== rootNode) {
                if (BlockNodeName.indexOf(node.nodeName) >= 0) {
                    break;
                }
                node = node.parentNode;
            }

            return node;
        },
        /**
         * 在 DOM 中插入节点
         * @param  {DOM Object} newNode 要插入的节点
         * @param  {DOM Object} node    旧节点
         */
        insertBefore: function(newNode, node) {
            if (!node.parentNode) {
                return false;
            }
            var parent = node.parentNode;

            parent.insertBefore(newNode, node);
            return true;
        },
        /**
         * 在 DOM 中插入节点
         * @param  {DOM Object} newNode 要插入的节点
         * @param  {DOM Object} node    旧节点
         */
        insertAfter: function(newNode, node) {
            if (!node.parentNode) {
                return false;
            }
            var parent = node.parentNode;

            if (node.nextSibling) {
                parent.insertBefore(newNode, node.nextSibling);
            } else {
                parent.appendChild(newNode);
            }
            return true;
        },
        /**
         * 插入 HTML
         * @param  {String} html  插入的HTML
         * @param  {Object} range 当前Range
         */
        insertHTML: function(html, range) {
            var doc = EditorUtil.getDocument();

            this.editor.dom.focusWindow();

            if (!$.browser.msie) {

                doc.execCommand('insertHtml', false, html);
            } else {
                var sel = this.editor.dom.getSelection();

                if (sel.type == 'Control') {
                    sel.clear();
                }
                //range 丢失
                if (!range) {
                    range = this.editor.dom.getRanges();
                    if (!range || range.length === 0) {
                        return;
                    }
                    range = range[0];
                }
                // IE9 
                if (range.insertNode) {
                    var el = doc.createElement("div");
                    el.innerHTML = html;
                    var frag = doc.createDocumentFragment(),
                        node, lastNode;
                    while ((node = el.firstChild)) {
                        lastNode = frag.appendChild(node);
                    }
                    range.insertNode(frag);

                    // Preserve the selection
                    if (lastNode) {
                        range = range.cloneRange();
                        range.setStartAfter(lastNode);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
                //for IE6-IE8
                else {
                    if (!range || range && !range.pasteHTML) {
                        range = sel.createRange();
                    }

                    range.pasteHTML(html);

                    range.select();
                }
            }
        },
        /**
         * 判断是否是列表元素
         * @param  {[type]}  startNode [description]
         * @param  {[type]}  endNode   [description]
         * @return {Boolean}           [description]
         */
        isList: function(startNode, endNode) {
            if (startNode.nodeName === 'UL' || startNode.nodeName === 'OL') {
                startNode = startNode.firstChild;
            }
            if (endNode.nodeName === 'UL' || endNode.nodeName === 'OL') {
                endNode = endNode.lastChild;
            }
            var visitor = startNode,
                isList = false;
            //如果全是 LI, toUL 变为 false；
            while (visitor) {
                if (visitor.nodeName === 'LI') {
                    if (visitor === endNode) {
                        isList = true;
                        break;
                    }
                } else {
                    break;
                }
                visitor = visitor.nextSibling;
            }

            return isList;
        },
        /**
         * 改 Font 元素的属性为 style
         * @return {[type]} [description]
         */
        parseFont: function(options) {
            function parseFont(node) {
                var val = null,
                    oldStyle = node.getAttribute('style') || '',
                    style = '';

                val = oldStyle.match(/font-family:(.*?);/);
                val = options.face || node.getAttribute('face') || (val ? val[1] : '');
                node.removeAttribute('face');
                style += 'font-family:' + val + ';';
                val = oldStyle.match(/font-size:(.*?)px;/);
                val = options.size || node.getAttribute('size') || (val ? val[1] : '');
                node.removeAttribute('size');
                style += 'font-size:' + val + 'px;';

                node.setAttribute('style', style);
            }

            var nodes = Range.getRootParent(),
                visitor = nodes.startNode;

            options = options ? options : {};

            while (visitor) {
                $(visitor).find('font').each(function() {
                    parseFont(this);
                });
                if (visitor === nodes.endNode) {
                    break;
                }
                visitor = visitor.nextSibling;
            }

        },
        /**
         * 用指定TagName替换已有的元素 TagName
         * @method replaceNodeName
         * @param  {DOM Object} node        用于被替换的元素
         * @param  {String} newNodeName  用于替换的TagName
         */
        replaceNodeName: function(node, newNodeName) {
            var doc = EditorUtil.getDocument(),
                selection = EditorUtil.getSelection(),
                range = EditorUtil.getRange(),
                newNode = doc.createElement(newNodeName),
                isRangeStart = range.startContainer ? range.startContainer === node : false,
                isRangeEnd = range.endContainer ? range.endContainer === node : false;

            //对于文本节点
            if (node.nodeType === 3) {

            } else {
                var fragment = doc.createDocumentFragment(),
                    ele = node.firstChild,
                    next = ele;
                //将原元素的子元素转嫁给新元素
                while (ele) {
                    next = next.nextSibling;
                    fragment.appendChild(ele);
                    ele = next;
                }
                //新元素替代旧元素
                newNode.appendChild(fragment);
                DOM.insertBefore(newNode, node);
                DOM.remove(node);
            }
            if (isRangeStart) {
                Range.holdRange.startContainer = newNode;
            }
            if (isRangeEnd) {
                Range.holdRange.endContainer = newNode;
            }
            return newNode;
        },
        /**
         * 删除一个节点
         * @param  {DOM Object} node 要删除的记录
         */
        remove: function(node) {
            if (node && node.remove) {
                node.remove();
            } else if (node && node.parentNode) {
                node.parentNode.removeChild(node);
            }
        },
        /**
         * 设置 元素 css
         * @method setCss
         * @param {DOM Object}  node       元素
         * @param {string}  css        css 名
         * @param {int}  value      css值
         * @param {Boolean} isIncrease 是递增还是直接设置
         */
        setCss: function(node, css, value, isIncrease, canbeMinus) {
            var win = EditorUtil.getWindow(),
                jCss = '',
                style = null,
                oldVal = null;

            if (isIncrease && win && (style = win.getComputedStyle(node, null))) {
                oldVal = style.getPropertyValue(css);
                if (!oldVal) {
                    return;
                }
                oldVal = oldVal.match(/[-0-9.]*/)[0];
                oldVal = parseInt(oldVal, 10);
                oldVal = oldVal + value;
                if (canbeMinus === false && oldVal < 0) {
                    return;
                }
                value = oldVal + 'px';
            }
            jCss = css.replace(/-([a-z])/, function(all, letter) {
                return letter.toUpperCase();
            });
            node.style[jCss] = value;
        },
        /**
         * 在列表、非列表及不同类型列表间切换
         * 遍历Range 中的节点
         *     如果 Range 包含的节点属于一个 List
         *         如果List 类型与指定的相同
         *             将 改 List 变为 非 List;
         *         否则
         *             将  List 变为 指定 List;
         *     否则
         *          如果开始节点属于 同类型 List
         *               开始节点后移，将后续节点加入该节点
         *          如果开始节点属于不同类型 List
         *               将其改为同类型List，开始节点后移，将剩余节点加入该List
         *          否则
         *               新建 List, 将Range 中的元素加入 新建 List;
         */
        switchList: function(nodeName) {
            var doc = EditorUtil.getDocument(),
                nodes = Range.getBlockParent(),
                startNode = nodes.startNode,
                endNode = nodes.endNode,
                visitor = startNode,
                parent = null,
                tmpNode = null,
                toUL = true;

            Range.hold();
            //判断 Range 是否选中一个 List中的元素
            toUL = !DOM.isList(startNode, endNode);
            /**
             * 当选择区域不是 List，转为 List
             */
            if (toUL === true) {
                //使用旧 的 UL
                if (startNode.nodeName === 'LI') {
                    //将后续的并入已有 list
                    if (startNode.parentNode.nodeName === nodeName) {
                        parent = startNode.parentNode;
                    }
                    //抽出 LI，新建 List
                    else {
                        parent = DOM.replaceNodeName(startNode.parentNode, nodeName);
                    }

                    startNode = parent.nextSibling;
                }
                //新建UL
                else {
                    parent = doc.createElement(nodeName);
                    DOM.insertBefore(parent, startNode);
                }
                //将节点加入 UL
                visitor = startNode;
                var toBreak = false,
                    oldNode = null;
                nodes.startNode = null;

                if (endNode.nodeName === 'LI') {
                    endNode = endNode.parentNode.lastChild;
                }

                while (visitor) {
                    tmpNode = visitor;
                    if (tmpNode === endNode) {
                        toBreak = true;
                    }
                    // 遇到 列表，接受子元素
                    if (tmpNode.nodeName === 'UL' || tmpNode.nodeName === 'OL') {
                        visitor = visitor.firstChild;
                        tmpNode = visitor;
                    }
                    //子元素接受完毕,跳回上一级
                    else if (visitor.nextSibling === null && tmpNode.nodeName === 'LI') {
                        oldNode = visitor.parentNode;
                        visitor = oldNode;
                    }

                    visitor = visitor.nextSibling;
                    DOM.remove(oldNode);
                    tmpNode = DOM.replaceNodeName(tmpNode, 'li');
                    parent.appendChild(tmpNode);
                    if (!nodes.startNode) {
                        nodes.startNode = tmpNode;
                    }
                    if (toBreak) {
                        break;
                    }
                }
            }
            /**
             *  是 List 但不是指定类型 List，转为 List
             */
            else if (startNode.parentNode.nodeName !== nodeName) {
                DOM.replaceNodeName(startNode.parentNode, nodeName);
            }
            /** 
             * 是 List, 转为非 List
             */
            else {
                parent = startNode.parentNode;
                visitor = parent.firstChild;
                while (visitor) {
                    tmpNode = visitor;
                    visitor = visitor.nextSibling;
                    tmpNode = DOM.replaceNodeName(tmpNode, 'p');
                    DOM.insertBefore(tmpNode, parent);
                }
                DOM.remove(parent);
            }

            Range.refresh();
        },
        /**
         * 用指定元素包含指定节点
         * @method wrapNode
         * @param  {DOM Object} node        用于被包含的内容
         * @param  {String} newNodeName 包含容器的TagName
         */
        wrapNode: function(nodes, newNodeName) {
            var doc = EditorUtil.getDocument(),
                selection = EditorUtil.getSelection(),
                range = EditorUtil.getRange(),
                newNode = doc.createElement(newNodeName);

            DOM.insertBefore(newNode, nodes[0]);
            while (nodes.length) {
                newNode.appendChild(nodes.shift());
            }

            return newNode;
        }
    };
    /**
     * 封装 range 对象
     * @type {Object}
     */
    var Range = {
        holdRange: {},
        /**
         * 删除 range 对应的内容
         */
        deleteContent: function() {
            EditorUtil.getDocument().execCommand('delete');
        },
        getRng: function() {
            return EditorUtil.getRange();
        },
        /**
         * 获取 Range 起始 DOM 节点
         * @return {DOM Object} Range 起始 DOM 节点
         */
        getStart: function() {
            var self = this,
                rng = self.getRng(),
                startElement, parentElement, checkRng, node;

            if (rng.duplicate || rng.item) {
                // Control selection, return first item
                if (rng.item) {
                    return rng.item(0);
                }

                // Get start element
                checkRng = rng.duplicate();
                checkRng.collapse(1);
                startElement = checkRng.parentElement();
                if (startElement.ownerDocument !== EditorUtil.getDocument()) {
                    startElement = EditorUtil.getRoot();
                }

                // Check if range parent is inside the start element, then return the inner parent element
                // This will fix issues when a single element is selected, IE would otherwise return the wrong start element
                parentElement = node = rng.parentElement();
                while (node = node.parentNode) {
                    if (node == startElement) {
                        startElement = parentElement;
                        break;
                    }
                }

                return startElement;
            } else {
                startElement = rng.startContainer;

                if (startElement.nodeType == 1 && startElement.hasChildNodes()) {
                    startElement = startElement.childNodes[Math.min(startElement.childNodes.length - 1, rng.startOffset)];
                }

                if (startElement && startElement.nodeType == 3) {
                    return startElement.parentNode;
                }

                return startElement;
            }
        },
        /**
         * 获取 Range 结束 DOM 节点
         * @return {DOM Object} Range 结束 DOM 节点
         */
        getEnd: function() {
            var self = this,
                rng = self.getRng(),
                endElement, endOffset;

            if (rng.duplicate || rng.item) {
                if (rng.item) {
                    return rng.item(0);
                }

                rng = rng.duplicate();
                rng.collapse(0);
                endElement = rng.parentElement();
                if (endElement.ownerDocument !== EditorUtil.getDocument()) {
                    endElement = EditorUtil.getRoot();
                }

                if (endElement && endElement.nodeName == 'BODY') {
                    return endElement.lastChild || endElement;
                }

                return endElement;
            } else {
                endElement = rng.endContainer;
                endOffset = rng.endOffset;

                if (endElement.nodeType == 1 && endElement.hasChildNodes()) {
                    endElement = endElement.childNodes[endOffset > 0 ? endOffset - 1 : endOffset];
                }

                if (endElement && endElement.nodeType == 3) {
                    return endElement.parentNode;
                }

                return endElement;
            }
        },
        /**
         * 获得 range.endNode 对应的 第一个 块级 父元素
         * @return {DOM Object} 包含Range 结束位置的 第一个 块级 父元素
         */
        getBlockStart: function() {
            var node = DOM.getClosestBlockNode(this.getStart());
            if (node.nodeName === 'UL' || node.nodeName === 'OL') {
                node = node.firstChild;
            }
            return node;
        },
        /**
         * 获得 range.startNode 对应的 第一个 块级 父元素
         * @return {DOM Object} 包含Range 起始位置的 第一个 块级 父元素
         */
        getBlockEnd: function() {
            var node = DOM.getClosestBlockNode(this.getEnd());
            if (node.nodeName === 'UL' || node.nodeName === 'OL') {
                node = node.lastChild;
            }
            return node;
        },
        getBlockParent: function() {
            return {
                startNode: this.getBlockStart(),
                endNode: this.getBlockEnd()
            };
        },
        /**
         * 获得 range.startNode 对应的 root 子元素
         * @return {DOM Object} 包含Range 起始位置的 root 子元素
         */
        getRootStart: function() {
            return DOM.getRootParent(this.getStart());
        },
        /**
         * 获得 range.endNode 对应的 root 子元素
         * @return {DOM Object} 包含Range 结束位置的 root 子元素
         */
        getRootEnd: function() {
            return DOM.getRootParent(this.getEnd());
        },
        getRootParent: function() {
            return {
                startNode: this.getRootStart(),
                endNode: this.getRootEnd()
            };
        },
        /**
         * 检测 range 范围
         * @return {Boolean} 选择一个范围则返回false，否则返回true；
         */
        isCollapsed: function() {
            var selection = EditorUtil.getSelection();
            if (selection.type === 'None' || selection.type === 'Caret') {
                return true;
            }
            return false;
        },
        /**
         * 记录当前Range
         */
        hold: function() {
            var range = EditorUtil.getRange(),
                tmpRng = null,
                offset = -0xFFFFFF,
                node = null;

            if (range.setStart) {
                this.holdRange.startContainer = range.startContainer;
                this.holdRange.startOffset = range.startOffset;
                this.holdRange.endContainer = range.endContainer;
                this.holdRange.endOffset = range.endOffset;
            } else {
                // Force control range into text range
                if (range.item) {
                    node = range.item(0);
                    range = EditorUtil.getBody().createTextRange();
                    range.moveToElementText(node);
                }

                //  isInEditorDocument = range.parentElement().ownerDocument === editor.getDoc();
                tmpRng = range.duplicate();
                tmpRng.collapse(true);
                this.holdRange.startOffset = tmpRng.move('character', offset) * -1;

                if (!tmpRng.collapsed) {
                    tmpRng = range.duplicate();
                    tmpRng.collapse(false);
                    this.holdRange.endOffset = (tmpRng.move('character', offset) * -1) - this.holdRange.startOffset;
                }
            }
        },
        /**
         * 刷新当前 Range
         * @param  {DOM Object} startNode   [description]
         * @param  {int} startOffset [description]
         * @param  {DOM Object} endNode     [description]
         * @param  {int} endOffset   [description]
         */
        refresh: function(startNode, startOffset, endNode, endOffset) {
            var range = EditorUtil.getRange(),
                selection = EditorUtil.getSelection();

            startNode = startNode || this.holdRange.startContainer;
            startOffset = Util.isNumber(startOffset) ? startOffset : this.holdRange.startOffset;
            endNode = endNode || this.holdRange.endContainer;
            endOffset = Util.isNumber(endOffset) ? endOffset : this.holdRange.endOffset;

            if (range.setStart) {
                range = range.cloneRange();
                range.setStart(startNode, startOffset);
                range.setEnd(endNode, endOffset);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                // Only select if the previous selection was inside the document to prevent auto focus in quirks mode
                if (range.parentElement().ownerDocument === EditorUtil.getDocument()) {
                    try {
                        range = EditorUtil.getBody().createTextRange();
                        range.moveToElementText(EditorUtil.getRoot());
                        range.collapse(true);
                        range.moveStart('character', startOffset);

                        if (endOffset > 0) {
                            range.moveEnd('character', endOffset);
                        }

                        range.select();
                    } catch (ex) {
                        // Ignore
                    }
                }
            }
        }
    };

    Util.mix(Keys, {
        /**
         * 回车表示起一个新段，响应 keydown 事件
         * 例外：UL、OL
         * @param {Event Object} evt 按键消息
         * @return 该事件是否被处理
         */
        handleEnter: function(evt) {
            if (evt.keyCode !== Keys.ENTER) {
                return false;
            }

            var rootNode = EditorUtil.getRoot(),
                startNode = Range.getRootStart();

            //如果是选中了一个区域，删除区域内容
            if (!Range.isCollapsed()) {
                Range.deleteContent();
            }
            //对于root 下的空元素
            if (startNode === rootNode) {
                var newNode = $('<p><br> </p>')[0];
                startNode.appendChild(newNode);

                Range.refresh(newNode, 0, newNode, 0);
            }
            //对于 root 下的非顶级元素
            else if (TopNodeName.indexOf(startNode.nodeName) < 0) {
                DOM.replaceNodeName(startNode, 'p');
            }

            return true;
        },
        /**
         *
         * @param {Event Object} evt 按键消息
         * @return 该事件是否被处理
         */
        handleTab: function(evt) {
            if (evt.keyCode !== Keys.TAB) {
                return false;
            }

            if (evt.shiftKey) {
                Plugins.undent.action(evt);
            } else {
                Plugins.indent.action(evt);
            }

            evt.preventDefault();
            return true;
        },
        /**
         * [handleDel description]
         * @param {Event Object} evt 按键消息
         * @return 该事件是否被处理
         */
        handleDel: function(evt) {
            if (evt.keyCode !== Keys.DEL) {
                return false;
            }

            var rootNode = EditorUtil.getRoot(),
                range = EditorUtil.getRange(),
                startNode = range.startContainer,
                startOffset = range.startOffset;
            //不能删除 body
            if (rootNode.childNodes.length === 0) {
                evt.preventDefault();
            } else if (startNode && startNode.parentNode === rootNode && startOffset === 0 && startNode.getAttribute('style')) {
                startNode.removeAttribute('style');
                evt.preventDefault();
            }


            return true;
        }
    });

    /**********************************
     *             DOM 构建器
     **********************************/
    /**
     * 创建 富文本编辑器
     * @module RichEditor
     * @class Builder
     */
    var Builder = function(container, toolbar) {
        this.id = 1;
        this.container = container;
        this.toolbar = toolbar;
    };

    Util.mix(Builder.prototype, {
        build: function() {
            this._buildToolbar();
            return this._buildEditor();
        },
        /**
         * 创建 工具条
         * @return {[type]} [description]
         */
        _buildToolbar: function() {
            var html = '<ul class="comList hTabList">';
            Util.foreach(this.toolbar, function(item, key) {
                if (item === true) {
                    html += '<li>' + Plugins[key].builder() + '</li>';
                } else if (Util.isString(item)) {
                    html += '<li>' + item + '</li>';
                }
            });

            html += '</ul>';
            this.container.append(html);
        },
        _buildEditor: function() {
            var me = this,
                editorWrapper = '<div class="edtWrapper">',
                iframe;

            this.container.append(editorWrapper);

            iframe = GDOM.buildPlainIframe({
                container: this.container.find('.edtWrapper'),
                width: '100%',
                height: '100%',
                classes: 'b editor',
                editable: true,
                callback: function( data ) {
                    EditorEvent.fire( 'init.iframe', {iframe: data.iframe } );
                    EditorEvent.fire('loaded.iframe', {
                        id: me.id
                    });
                }
            });

            return iframe;
        }
    });

    /**
     * 富文本编辑器类
     * 组织 DOM 创建、插件初始化、编辑框消息响应
     * @param {[type]} options [description]
     */
    var RichEditor = function(options) {
        this.container = options.container;
        //  object 
        this.toolbar = options.toolbar;
        this.content = options.content;
        this.iframe = null;
        this._init();
    };

    Util.mix(RichEditor.prototype, {
        _init: function() {
            var me = this,
                ele = null,
                val = null,
                builder = new Builder(this.container, this.toolbar);
            this._bindEvents();
            builder.build();
            this.id = builder.id;

            //初始化工具栏
            var toolBarItem = this.container.find('[data-action]');
            Util.foreach(toolBarItem, function(item, key) {
                ele = $(item);
                val = ele.data('action');
                if (Plugins.hasOwnProperty(val)) {
                    //初始化 控件
                    Plugins[val].init(ele, me);
                    //绑定事件
                    if (Plugins[val].bindEvent) {
                        Plugins[val].bindEvent();
                    } else {
                        ele.bind('mousedown', function() {
                            return false;
                        });
                        ele.bind('mouseup', $.proxy(Plugins[val].action, Plugins[val]));
                        ele.bind('click', function(evt) {
                            evt.preventDefault();
                            evt.stopPropagation();
                            return false;
                        });
                    }
                }
            });
        },
        /**
         * 绑定输入框相关 事件
         */
        _bindEvents: function() {
            var me = this;
            EditorEvent.on( 'init.iframe', function( data ){
                me.iframe = data.iframe;
            } )
            /*
             * iframe 装载完成后绑定相关事件
             */
            EditorEvent.on('loaded.iframe', function(data) {
                if (me.id !== data.id) {
                    return;
                }
                var editorDom = $(me.getRoot());
                if (editorDom.length === 0) {
                    return;
                }
                editorDom.bind('keydown', $.proxy(me._onKeyDown, me));
                editorDom.bind('keyup', $.proxy(me._onKeyUp, me));
                editorDom.bind('keypress', $.proxy(me._onKeyPress, me));
                editorDom.bind('mouseup', $.proxy(me._onMouseUp, me));
                editorDom.bind('paste', $.proxy(me._onPaste, me));
            });
            //editor 初始化完成
            EditorEvent.on('loaded.iframe', function() {
                var body = me.getRoot();
                body.lastChild && body.removeChild(body.lastChild);
                EditorUtil.setEditor(me);
            });
            //初始化编辑器内容
            EditorEvent.on('loaded.iframe', function() {
                if (me.content) {
                    $(EditorUtil.getBody()).html(me.content);
                }
            });
        },
        /**
         * 清空编辑器内容
         */
        empty: function() {
            var body = this.getRoot();
            body && $(body).empty();
        },
        /**
         * 获得 编辑器的 Window
         */
        getWindow: function() {
            return this.iframe ? this.iframe.contentWindow : null;
        },
        /**
         * 获得 编辑器的 document
         */
        getDocument: function() {
            if (!this.iframe) {
                return null;
            }
            this.iframe.contentWindow.document.body.focus();
            return this.iframe.contentWindow.document;
        },
        /**
         * 获得 编辑器的 body
         */
        getRoot: function() {
            return this.iframe ? this.iframe.contentWindow.document.body : null;
        },
        /**
         * 获得 编辑器的 内容
         */
        getContent: function() {
            return this.iframe ? $(this.iframe.contentWindow.document.body).html() : null;
        },
        _onKeyDown: function(evt) {
            if (Keys.handleDel(evt) || Keys.handleEnter(evt) || Keys.handleTab(evt)) {}

        },
        _onKeyUp: function(evt) {
            EditorUtil.cacheRange();
            DOM.forceBlocks();
        },
        _onKeyPress: function(evt) {

        },
        _onMouseUp: function(evt) {
            EditorUtil.cacheRange();
            EditorUtil.setEditor(this);
            EditorEvent.fire('focus.editor');
        },
        _onPaste: function(evt) {
            setTimeout(function() {
                var doc = EditorUtil.getDocument();
                doc.execCommand('selectall');
                Range.hold();
                DOM.forceBlocks(false);
                Range.refresh();
            }, 100);
        }
    });

    /***************************************
     *              插件定义
     ***************************************/
    Plugins = {
        /**
         * 字体 背景色
         */
        backcolor: {
            title: '背景色',
            init: function(ele) {
                this.ele = Util.isString(ele) ? $(ele) : ele;
            },
            builder: function() {
                return '<a href="#" class="edtToolButton edtBtnBackColor" title="' + this.title + '" data-action="backcolor">BC</a>';
            },
            action: function(evt) {
                if (!this.ele) {
                    return;
                }
                //显示颜色面板
                var offset = this.ele.offset();
                offset.top += 20;
                new ColorPicker(offset, function(color) {
                    var doc = EditorUtil.getDocument();
                    doc.execCommand('backcolor', false, color);
                });

                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        },
        /**
         * 字体加粗
         */
        bold: {
            title: '加粗',
            /**
             * 绑定 trigger click 事件
             * @param  {[type]} ele [description]
             * @return {[type]}     [description]
             */
            init: function(ele) {
                this.ele = Util.isString(ele) ? $(ele) : ele;
            },
            /**
             * 创建触发器
             * @return {string} 触发器的DOM
             */
            builder: function() {
                return '<a href="#" class="edtToolButton edtBtnBold" title="' + this.title + '" data-action="bold">B</a>';
            },
            /**
             * 点击触发器 相关动作
             * @param  {Event Object} evt 点击事件
             */
            action: function(evt) {
                var doc = EditorUtil.getDocument();
                doc.execCommand('bold', false, null);

                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        },
        /**
         * 字体 颜色
         */
        forecolor: {
            title: '字体色',
            init: function(ele) {
                this.ele = Util.isString(ele) ? $(ele) : ele;
            },
            builder: function() {
                return '<a href="#" class="edtToolButton edtBtnForeColor" title="' + this.title + '" data-action="forecolor">AC</a>';
            },
            action: function(evt) {
                if (!this.ele) {
                    return;
                }
                //显示颜色面板
                var offset = this.ele.offset();
                offset.top += 20;
                new ColorPicker(offset, function(color) {
                    var doc = EditorUtil.getDocument();
                    doc.execCommand('forecolor', false, color);
                });

                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        },
        /**
         * 字体
         */
        fontface: {
            title: '字体',
            init: function(ele) {
                this.ele = Util.isString(ele) ? $(ele) : ele;
            },
            builder: function() {
                return '<a href="#" class="edtToolButton edtBtnFontFace" title="' + this.title + '" data-action="fontface">FF</a>';
            },
            action: function(evt) {
                if (Range.isCollapsed()) {
                    return;
                }
                var offset = this.ele.offset();
                offset.top += 20;
                new FontFamilyPicker(offset, function(fontfamily) {
                    var doc = EditorUtil.getDocument();
                    doc.execCommand('fontname', false, fontfamily);
                    DOM.parseFont();
                });

                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        },
        /**
         * 字体 大小
         */
        fontsize: {
            title: '字号',
            init: function(ele) {
                this.ele = Util.isString(ele) ? $(ele) : ele;
            },
            builder: function() {
                return '<a href="#" class="edtToolButton edtBtnFontSize" title="' + this.title + '" data-action="fontsize">FS</a>';
            },
            action: function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                if (Range.isCollapsed()) {
                    return false;
                }
                var size = EditorUtil.getWindow().prompt('输入字号'),
                    doc = EditorUtil.getDocument();

                if (Util.isNaN(parseInt(size, 10))) {
                    return;
                }
                doc.execCommand('fontsize', false, size);

                DOM.parseFont({
                    size: size
                });

                return false;
            }
        },

        /**
         * 将所选内容变为 标题
         * @param {jquery object| jquery selector} ele 触发器
         */
        hn: {
            title: '标题',
            init: function(ele) {
                this.ele = Util.isString(ele) ? $(ele) : ele;
                this.blockTag = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
            },
            builder: function() {
                return '<a href="#" class="edtToolButton edtBtnHn" title="' + this.title + '" data-action="hn">Hn</a>';
            },
            action: function(evt) {
                var lvl = EditorUtil.getWindow().prompt('输入标题级数'),
                    nodes = Range.getRootParent(),
                    nTag = 'h' + lvl;
                // hn -> p
                if (lvl == '0') {
                    nTag = 'p';
                }
                //最外层元素改为 hn；
                while (nodes.startNode !== nodes.endNode) {
                    nodes.startNode = DOM.replaceNodeName(nodes.startNode, nTag);
                    nodes.startNode = nodes.startNode.nextSibling;
                }
                DOM.replaceNodeName(nodes.startNode, nTag);

                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        },
        /**
         * 将所选内容缩进
         * @param {jquery object| jquery selector} ele 触发器
         */
        indent: {
            title: '增加缩进',
            init: function(ele) {
                this.ele = Util.isString(ele) ? $(ele) : ele;
            },
            builder: function() {
                return '<a href="#" class="edtToolButton edtBtnIndent" title="' + this.title + '" data-action="indent">IDT</a>';
            },
            action: function(evt) {
                var nodes = Range.getRootParent(),
                    rootNode = EditorUtil.getRoot();
                //当前还没有元素，先插入一个元素
                if (nodes.startNode === rootNode) {
                    var newNode = $('<p><br> </p>')[0];
                    rootNode.appendChild(newNode);

                    Range.refresh(newNode, 0, newNode, 0);
                    nodes = Range.getRootStart();
                }

                //最外层元素改为 hn；
                while (nodes.startNode !== nodes.endNode) {
                    DOM.setCss(nodes.startNode, 'margin-left', 20, true, false);
                    nodes.startNode = nodes.startNode.nextSibling;
                }
                DOM.setCss(nodes.startNode, 'margin-left', 20, true, false);

                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        },
        /**
         * 字体 斜体
         */
        italic: {
            title: '斜体',
            init: function(ele) {
                this.ele = Util.isString(ele) ? $(ele) : ele;
            },
            builder: function() {
                return '<a href="#" class="edtToolButton edtBtnItalic" title="' + this.title + '" data-action="italic">I</a>';
            },
            action: function(evt) {
                var doc = EditorUtil.getDocument();
                doc.execCommand('italic', false, null);

                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        },
        /**
         * 对齐方式
         * @param {jquery object| jquery selector} ele 触发器
         */
        jl: {
            title: '左对齐',
            init: function(ele) {
                this.ele = Util.isString(ele) ? $(ele) : ele;
            },
            builder: function() {
                return '<a href="#" class="edtToolButton edtBtnJL" title="' + this.title + '" data-action="jl">JL</a>';
            },
            action: function(evt) {
                var doc = EditorUtil.getDocument();
                doc.execCommand('justifyleft', false, null);

                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        },
        /**
         * 对齐方式
         * @param {jquery object| jquery selector} ele 触发器
         */
        jc: {
            title: '居中对齐',
            init: function(ele) {
                this.ele = Util.isString(ele) ? $(ele) : ele;
            },
            builder: function() {
                return '<a href="#" class="edtToolButton edtBtnJC" title="' + this.title + '" data-action="jc">JC</a>';
            },
            action: function(evt) {
                var doc = EditorUtil.getDocument();
                doc.execCommand('justifycenter', false, null);

                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        },
        /**
         * 对齐方式
         * @param {jquery object| jquery selector} ele 触发器
         */
        jr: {
            title: '右对齐',
            init: function(ele) {
                this.ele = Util.isString(ele) ? $(ele) : ele;
            },
            builder: function() {
                return '<a href="#" class="edtToolButton edtBtnJR" title="' + this.title + '" data-action="jr">JR</a>';
            },
            action: function(evt) {
                var doc = EditorUtil.getDocument();
                doc.execCommand('justifyright', false, null);

                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        },
        /**
         * 添加超链接
         */
        link: {
            title: '超链接',
            init: function(ele) {
                this.ele = Util.isString(ele) ? $(ele) : ele;
            },
            builder: function() {
                return '<a href="#" class="edtToolButton edtBtnLink" title="' + this.title + '" data-action="link">LK</a>';
            },
            action: function(evt) {
                var link = EditorUtil.getWindow().prompt('输入链接'),
                    doc = EditorUtil.getDocument();

                doc.execCommand('createlink', false, link);

                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        },
        /**
         * 添加超链接
         */
        unlink: {
            title: '超链接',
            init: function(ele) {
                this.ele = Util.isString(ele) ? $(ele) : ele;
            },
            builder: function() {
                return '<a href="#" class="edtToolButton edtBtnUnLink" title="' + this.title + '" data-action="unlink">ULK</a>';
            },
            action: function(evt) {
                var doc = EditorUtil.getDocument();
                doc.execCommand('unlink');

                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        },
        /**
         * 将所选内容变为列表
         * @param {jquery object| jquery selector} ele 触发器
         */
        ol: {
            title: '有序列表',
            init: function(ele) {
                this.ele = Util.isString(ele) ? $(ele) : ele;
            },
            builder: function() {
                return '<a href="#" class="edtToolButton edtBtnOL" title="' + this.title + '" data-action="ol">OL</a>';
            },
            action: function(evt) {
                DOM.switchList('OL');

                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        },
        /**
         * 重做
         * @param {jquery object| jquery selector} ele 触发器
         */
        redo: {
            title: '重做',
            init: function(ele) {
                this.ele = Util.isString(ele) ? $(ele) : ele;
            },
            builder: function() {
                return '<a href="#" class="edtToolButton edtBtnRD" title="' + this.title + '" data-action="redo">RD</a>';
            },
            action: function(evt) {
                var doc = EditorUtil.getDocument();
                doc.execCommand('redo');

                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        },
        /**
         * 删除 格式
         * @param {jquery object| jquery selector} ele 触发器
         */
        rf: {
            title: '删除格式',
            init: function(ele) {
                this.ele = Util.isString(ele) ? $(ele) : ele;
            },
            builder: function() {
                return '<a href="#" class="edtToolButton edtBtnRF" title="' + this.title + '" data-action="rf">RF</a>';
            },
            action: function(evt) {
                var doc = EditorUtil.getDocument();
                doc.execCommand('removeformat');

                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        },
        /**
         * 将所选内容变为列表
         * @param {jquery object| jquery selector} ele 触发器
         */
        ul: {
            title: '无序列表',
            init: function(ele) {
                this.ele = Util.isString(ele) ? $(ele) : ele;
            },
            builder: function() {
                return '<a href="#" class="edtToolButton edtBtnUl" title="' + this.title + '" data-action="ul">UL</a>';
            },
            action: function(evt) {
                DOM.switchList('UL');
                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        },
        /**
         * 字体 下划线
         */
        underline: {
            title: '下划线',
            init: function(ele) {
                this.ele = Util.isString(ele) ? $(ele) : ele;
            },
            builder: function() {
                return '<a href="#" class="edtToolButton edtBtnUnderline" title="' + this.title + '" data-action="underline">U</a>';
            },
            action: function(evt) {
                var doc = EditorUtil.getDocument();
                doc.execCommand('underline', false, null);

                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        },
        /**
         * 将所选内容缩进
         * @param {jquery object| jquery selector} ele 触发器
         */
        undent: {
            title: '减少缩进',
            init: function(ele) {
                this.ele = Util.isString(ele) ? $(ele) : ele;
            },
            builder: function() {
                return '<a href="#" class="edtToolButton edtBtnUndent" title="' + this.title + '" data-action="undent">UDT</a>';
            },
            action: function(evt) {
                var nodes = Range.getRootParent();

                //最外层元素改为 hn；
                while (nodes.startNode !== nodes.endNode) {
                    DOM.setCss(nodes.startNode, 'margin-left', -20, true, false);
                    nodes.startNode = nodes.startNode.nextSibling;
                }
                DOM.setCss(nodes.startNode, 'margin-left', -20, true, false);

                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        },
        /**
         * 取消
         * @param {jquery object| jquery selector} ele 触发器
         */
        undo: {
            title: '取消',
            init: function(ele) {
                this.ele = Util.isString(ele) ? $(ele) : ele;
            },
            builder: function() {
                return '<a href="#" class="edtToolButton edtBtnUD" title="' + this.title + '" data-action="undo">UD</a>';
            },
            action: function(evt) {
                var doc = EditorUtil.getDocument();
                doc.execCommand('undo');

                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        }

    };

    /******************************************
     *                      工具对象类
     * ****************************************/
    /* 颜色选择器
     * @module RichEditor
     * @class ColorPicker
     * @constructor
     * @param {object}   offset   显示位置
     * @param {Function} callback 选中颜色后的回调
     */
    var ColorPicker = function(offset, callback) {
        this.offset = offset;
        this.callback = callback;
        this._id = 'editor_colorpicker';
        this._init();
    };
    Util.mix(ColorPicker.prototype, {
        /**
         * 构建颜色面板
         * @return {[type]} [description]
         */
        _init: function() {
            this.container = $('#' + this._id);
            if (this.container.length === 0) {
                var html = ['<div id="' + this._id + '" class="clrPanel">', '<div>'],
                    length = Colors.length,
                    ii = 0;

                for (ii = 0; ii < length; ii += 1) {
                    html.push('<a href="#" class="fl b clrBlock" data-color="' + Colors[ii] + '" style="background:' + Colors[ii] + '"></a>');
                }

                html.concat(['</div>', '</div>']);
                $(document.body).append(html.join(''));
            }
            this.container = $('#' + this._id);
            this.container.offset(this.offset);
            this._bindEvents();
        },
        /**
         * 绑定相关事件
         */
        _bindEvents: function() {
            var me = this;
            this.container.undelegate();
            //选取一种颜色
            this.container.delegate('a', 'click', function(evt) {
                me.callback ? me.callback.call(null, $(evt.currentTarget).data('color')) : null;
            });
            //关闭
            this.container.delegate('', 'click', function(evt) {
                me.close();
                evt.preventDefault();
                evt.stopPropagation();
                return false;
            });
            EditorEvent.on('focus.editor', function() {
                me.close();
            });
        },
        close: function() {
            this.container && this.container.remove();
        }
    });

    /**
     *  字体选择器
     *  @module RichEditor
     * @class FontFamilyPicker
     * @constructor
     */
    var FontFamilyPicker = function(offset, callback) {
        this.offset = offset;
        this.callback = callback;
        this._id = 'editor_FontFamilyPicker';
        this._init();
    };
    Util.mix(FontFamilyPicker.prototype, {
        /**
         * 构建颜色面板
         * @return {[type]} [description]
         */
        _init: function() {
            this.container = $('#' + this._id);
            if (this.container.length === 0) {
                var html = ['<div id="' + this._id + '" class="ffPanel">', '<div>'],
                    length = FontFamily.length,
                    ii = 0;

                for (ii = 0; ii < length; ii += 1) {
                    html.push('<a href="#" class="b ffItem" data-fontfamily="' + FontFamily[ii].value + '" style="font-family:' + FontFamily[ii].value + '">' + FontFamily[ii].label + '</a>');
                }

                html.concat(['</div>', '</div>']);
                $(document.body).append(html.join(''));
            }
            this.container = $('#' + this._id);
            this.container.offset(this.offset);
            this._bindEvents();
        },
        /**
         * 绑定相关事件
         */
        _bindEvents: function() {
            var me = this;
            this.container.undelegate();
            //选取一种字体
            this.container.delegate('a', 'click', function(evt) {
                me.callback ? me.callback.call(null, $(evt.currentTarget).data('fontfamily')) : null;
            });
            //关闭
            this.container.delegate('', 'click', function(evt) {
                me.close();
                evt.preventDefault();
                evt.stopPropagation();
                return false;
            });
            EditorEvent.on('focus.editor', function() {
                me.close();
            });
        },
        close: function() {
            this.container && this.container.remove();
        }
    });
    return RichEditor;
});