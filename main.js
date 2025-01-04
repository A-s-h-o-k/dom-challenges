// Add JS here
var PixelArts = /** @class */ (function () {
    function PixelArts(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.dragEnteredElements = new Set();
        this.isClicked = false;
        this.currentColor = '#478af5';
        this.operationFlow = [];
    }
    PixelArts.prototype.generateRows = function () {
        var _this = this;
        var mainContainer = document.getElementById('mainContainer');
        var clearAll = document.createElement('button');
        clearAll.innerText = 'Clear All';
        clearAll.classList.add('clearButton');
        clearAll.onclick = function () { _this.clearAll(); };
        if (mainContainer) {
            for (var i = 0; i < this.rows; i++) {
                mainContainer.append(this.generateColumns(i));
            }
            mainContainer.append(clearAll);
        }
        return mainContainer;
    };
    PixelArts.prototype.generateColumns = function (row) {
        var columnContainer = document.createElement('div');
        columnContainer.classList.add('rowContainer');
        for (var i = 0; i < this.columns; i++) {
            columnContainer.append(this.createSquareBox(row, i));
        }
        return columnContainer;
    };
    PixelArts.prototype.pushToFlow = function (id, current, changed) {
        this.dragEnteredElements.add(id);
        this.operationFlow.push({ id: id, current: current, changed: changed });
    };
    PixelArts.prototype.createSquareBox = function (row, col) {
        var _this = this;
        var htmlElement = document.createElement('div');
        htmlElement.id = "gridElement".concat(row, "-").concat(col);
        htmlElement.onmousedown = function (e) {
            var str = "gridElement".concat(row, "-").concat(col);
            _this.pushToFlow(str, htmlElement.style.backgroundColor, _this.currentColor);
            htmlElement.style.backgroundColor = _this.currentColor;
            _this.isClicked = true;
        };
        htmlElement.classList.add('default');
        htmlElement.onmouseover = function (e) {
            var str = "gridElement".concat(row, "-").concat(col);
            if (_this.isClicked) {
                _this.pushToFlow(str, htmlElement.style.backgroundColor, _this.currentColor);
                htmlElement.style.backgroundColor = _this.currentColor;
            }
        };
        htmlElement.onmouseup = function () {
            _this.isClicked = false;
        };
        // htmlElement.draggable = true
        // htmlElement.ondragenter = (e) => {
        //     e.preventDefault()
        //     this.dragEnteredElements.push(htmlElement);
        //     htmlElement.style.backgroundColor = '#478af5';
        // }
        // htmlElement.ondragstart = function(e:DragEvent | null) {
        //     e?.preventDefault()
        //     if(e) {
        //         e?.dataTransfer?.setDragImage(document.createElement('div'), 0,0)
        //     }
        // }
        return htmlElement;
    };
    PixelArts.prototype.clearAll = function () {
        this.dragEnteredElements.forEach(function (id) {
            var ele = document.getElementById(id);
            if (ele) {
                ele.style.backgroundColor = '';
            }
        });
        this.operationFlow = [];
    };
    PixelArts.prototype.colorPicker = function () {
        var _this = this;
        var label = document.createElement('label');
        label.innerText = 'Picker Color';
        label.htmlFor = "colorPicker";
        var div = document.createElement('div');
        div.appendChild(label);
        var colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.name = 'colorPicker';
        colorPicker.id = 'colorPicker';
        colorPicker.defaultValue = this.currentColor;
        colorPicker.onchange = function (e) {
            var _a, _b;
            console.log(e.target, 'ppp');
            if ((_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.value) {
                _this.currentColor = (_b = e === null || e === void 0 ? void 0 : e.target) === null || _b === void 0 ? void 0 : _b.value;
            }
        };
        div.appendChild(colorPicker);
        return div;
    };
    PixelArts.prototype.undo = function () {
        var _a, _b;
        console.log('calling undo', this.operationFlow);
        if (this.operationFlow) {
            var operation = this.operationFlow.pop();
            var ele = document.getElementById((_a = operation === null || operation === void 0 ? void 0 : operation.id) !== null && _a !== void 0 ? _a : '');
            if (ele) {
                ele.style.backgroundColor = (_b = operation === null || operation === void 0 ? void 0 : operation.current) !== null && _b !== void 0 ? _b : '';
            }
        }
    };
    PixelArts.prototype.createUndoButton = function () {
        var _this = this;
        var undoButton = document.createElement('button');
        undoButton.name = 'undoButton';
        undoButton.id = 'undoButton';
        undoButton.innerText = 'Undo';
        undoButton.onclick = function () { return _this.undo(); };
        return undoButton;
    };
    PixelArts.prototype.initializeTheBoard = function () {
        var mainEle = this.generateRows();
        var picker = this.colorPicker();
        var undoEle = this.createUndoButton();
        if (mainEle) {
            if (picker) {
                mainEle.appendChild(picker);
            }
            if (undoEle) {
                mainEle.appendChild(undoEle);
            }
        }
    };
    return PixelArts;
}());
new PixelArts(20, 20).initializeTheBoard();
