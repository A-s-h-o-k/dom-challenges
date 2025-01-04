// Add JS here

interface PixelArtTypes {
    rows: number,
    columns: number,
    generateRows(noRows: number): HTMLElement | null,
    generateColumns(noRows: number): void,
    createSquareBox(row: number, col: number): Node,
    initializeTheBoard(): void
    dragEnteredElements: Set<string>
    clearAll(): void
    isClicked: Boolean
    currentColor: string
    colorPicker(): HTMLElement | null
    operationFlow: { id: string, current: string, changed: string }[]
    pushToFlow(id: string, current: string, changed: string): void
    createUndoButton(): HTMLElement | null
    undo(): void
}

class PixelArts implements PixelArtTypes {
    rows: number;
    columns: number;
    dragEnteredElements: Set<string>;
    isClicked: Boolean;
    currentColor: string
    operationFlow: { id: string, current: string, changed: string }[]
    constructor(rows: number, columns: number) {
        this.rows = rows;
        this.columns = columns;
        this.dragEnteredElements = new Set();
        this.isClicked = false
        this.currentColor = '#478af5'
        this.operationFlow = []
    }

    generateRows(): HTMLElement | null {
        const mainContainer: HTMLElement | null = document.getElementById('mainContainer')
        const clearAll = document.createElement('button')
        clearAll.innerText = 'Clear All'
        clearAll.classList.add('clearButton')
        clearAll.onclick = () => { this.clearAll() }
        if (mainContainer) {
            for (let i = 0; i < this.rows; i++) {
                mainContainer.append(this.generateColumns(i))
            }
            mainContainer.append(clearAll)
        }

        return mainContainer

    }

    generateColumns(row: number) {
        const columnContainer = document.createElement('div')

        columnContainer.classList.add('rowContainer')
        for (let i = 0; i < this.columns; i++) {
            columnContainer.append(this.createSquareBox(row, i))
        }
        return columnContainer
    }

    pushToFlow(id: string, current: string, changed: string) {
        this.dragEnteredElements.add(id);
        this.operationFlow.push({ id, current, changed })
    }

    createSquareBox(row: number, col: number): Node {
        const htmlElement = document.createElement('div');
        htmlElement.id = `gridElement${row}-${col}`
        htmlElement.onmousedown = (e) => {
            let str: string = `gridElement${row}-${col}`
            this.pushToFlow(str, htmlElement.style.backgroundColor, this.currentColor)
            htmlElement.style.backgroundColor = this.currentColor;
            this.isClicked = true
        }
        htmlElement.classList.add('default')
        htmlElement.onmouseover = (e) => {
            let str: string = `gridElement${row}-${col}`
            if (this.isClicked) {
                this.pushToFlow(str, htmlElement.style.backgroundColor, this.currentColor)
                htmlElement.style.backgroundColor = this.currentColor;
            }
        }

        htmlElement.onmouseup = () => {
            this.isClicked = false
        }


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


        return htmlElement
    }

    clearAll() {
        this.dragEnteredElements.forEach((id) => {
            const ele: HTMLElement | null = document.getElementById(id)
            if (ele) {
                ele.style.backgroundColor = ''
            }
        })
        this.operationFlow = []
    }

    colorPicker(): HTMLElement | null {
        const label = document.createElement('label')
        label.innerText = 'Picker Color'
        label.htmlFor = "colorPicker"
        const div = document.createElement('div')
        div.appendChild(label)



        const colorPicker = document.createElement('input')
        colorPicker.type = 'color'
        colorPicker.name = 'colorPicker'
        colorPicker.id = 'colorPicker'
        colorPicker.defaultValue = this.currentColor;
        colorPicker.onchange = (e: Event) => {
            console.log(e.target, 'ppp')
            if (e?.target?.value) {
                this.currentColor = e?.target?.value
            }
        }
        div.appendChild(colorPicker)

        return div


    }

    undo(): void {
        console.log('calling undo', this.operationFlow)
        if (this.operationFlow) {
            const operation = this.operationFlow.pop()
            const ele = document.getElementById(operation?.id ?? '');
            if (ele) {
                ele.style.backgroundColor = operation?.current ?? ''
            }
        }
    }

    createUndoButton(): HTMLElement | null {
         
        const undoButton = document.createElement('button')
        undoButton.name = 'undoButton'
        undoButton.id = 'undoButton'
        undoButton.innerText = 'Undo'
        undoButton.onclick = () => this.undo()
        
        
        return undoButton

    }

    initializeTheBoard() {
        const mainEle = this.generateRows()
        const picker = this.colorPicker()
        const undoEle = this.createUndoButton()
        if (mainEle) {
            if (picker) {
                mainEle.appendChild(picker)
            }
            if (undoEle) {
                mainEle.appendChild(undoEle)
            }
        }


    }
}


new PixelArts(20, 20).initializeTheBoard();