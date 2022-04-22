function countDecimals(number) {
    if (number % 1 == 0) return 0;

    let str = number.toString();
    if (str.indexOf(".") !== -1 && str.indexOf("-") !== -1) {
        return str.split("-")[1] || 0;
    } else if (str.indexOf(".") !== -1) {
        return str.split(".")[1].length || 0;
    }
    return str.split("-")[1] || 0;
}

function numberToText2Decimals(number) {
    let text = null
    let testValue = Number(number)
    if (testValue < 0) { testValue = -testValue }
    if (countDecimals(testValue) > 2) {
        text = number.toFixed(2)
    } else {
        text = number.toString()
    }
    return text
}

class CartesianPlane {
    canvas
    ctx

    settings

    #planeWidth
    #planeHeight

    #pointMaxWidth
    #pointMaxHeight

    #step
    constructor(canvas  ) {
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')

        this.ctx.font = "12px Arial";
        this.ctx.strokeStyle = "rgba(153, 52, 231, 0.8)"
        this.ctx.fillStyle = "rgb(153, 52, 231)"

        this.ctx.save()
        
        this.settings = {
            planeMargin: 50,
            endPointMargin: 20,
            maxPointView: 1,
            strideCount: 2,
            drawPlaneLine: true
        }

        this.updateFrame()
    }
    
    drawPlaneLine() {
        // draw rectangle
        this.ctx.strokeRect(
            this.settings.planeMargin, this.settings.planeMargin,
            this.#planeWidth, this.#planeHeight
        )

        /**
         * Draw horizontal & vertical line
         */
        this.ctx.beginPath()
        // horizontal line
        this.ctx.moveTo(this.settings.planeMargin, this.canvas.height/2)
        this.ctx.lineTo(this.canvas.width-this.settings.planeMargin, this.canvas.height/2)
        
        // vertical line
        this.ctx.moveTo(this.canvas.width/2, this.settings.planeMargin)
        this.ctx.lineTo(this.canvas.width/2, this.canvas.height-this.settings.planeMargin)
        
        this.ctx.stroke() // draw
        this.ctx.closePath()

        for (let i = 0; i <= (this.settings.strideCount * 2); i++) {
            let currentX = this.settings.planeMargin + this.settings.endPointMargin + (i * ((this.#pointMaxWidth-this.settings.endPointMargin)/2/this.settings.strideCount))
            let currentY = this.settings.planeMargin + this.settings.endPointMargin + (i * ((this.#pointMaxHeight-this.settings.endPointMargin)/2/this.settings.strideCount))
            this.ctx.beginPath()
            // vertical line
            this.ctx.moveTo(currentX, this.settings.planeMargin)
            this.ctx.lineTo(currentX, this.#planeHeight+this.settings.planeMargin)
            // horizontal line
            this.ctx.moveTo(this.settings.planeMargin, currentY)
            this.ctx.lineTo(this.#planeWidth+this.settings.planeMargin, currentY)

            this.ctx.stroke()
            this.ctx.closePath()
            
            const xOffset = (i * this.#step) - this.settings.maxPointView
            const yOffset = -xOffset

            let strXOffset = null
            let strYOffset = null
            if (xOffset % 1 != 0) {
                strXOffset = numberToText2Decimals(xOffset)
                strYOffset = numberToText2Decimals(yOffset)
            } else {
                strXOffset = xOffset.toString()
                strYOffset = yOffset.toString()
            }
            const metrics = this.ctx.measureText(strXOffset)
            const strOffsetHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
            // horizontal text
            this.ctx.fillText(
                strXOffset,
                this.settings.planeMargin + this.settings.endPointMargin + (i * ((this.#planeWidth-(this.settings.endPointMargin*2))/2/this.settings.strideCount)) - (metrics.width/2),
                this.settings.planeMargin + this.#planeHeight + 15
            )

            // vertical text
            this.ctx.fillText(
                strYOffset,
                this.settings.planeMargin + this.#planeWidth + 5,
                this.settings.planeMargin + this.settings.endPointMargin + (i * ((this.#planeHeight-(this.settings.endPointMargin*2))/2/this.settings.strideCount)) + strOffsetHeight/2,
            )
        }
    }

    updateFrame() {
        this.ctx.clearRect(
            0, 0,
            this.canvas.width, this.canvas.height
        )

        this.#planeWidth = this.canvas.width - (this.settings.planeMargin*2)
        this.#planeHeight = this.canvas.height - (this.settings.planeMargin*2)
        
        this.#pointMaxWidth = this.#planeWidth - this.settings.endPointMargin
        this.#pointMaxHeight = this.#planeHeight - this.settings.endPointMargin

        this.#step = this.settings.maxPointView/this.settings.strideCount

        if (this.settings.drawPlaneLine) {
            this.drawPlaneLine()
        }
    }

    getPosition(virtualX, virtualY) {
        const kw = this.canvas.width / 2
        const kh = this.canvas.height / 2
        
        const x = kw + (virtualX * ((this.#pointMaxWidth-this.settings.endPointMargin)/(this.settings.maxPointView*2)))
        const y = kh - (virtualY * ((this.#pointMaxHeight-this.settings.endPointMargin)/(this.settings.maxPointView*2)))

        return {x: x, y: y}
    }

    isUpdateMaxPointView(virtualX, virtualY) {
        const absVirtualX = Math.abs(virtualX)
        const absVirtualY = Math.abs(virtualY)

        if (absVirtualX > this.settings.maxPointView || absVirtualY > this.settings.maxPointView) {
            if (absVirtualX > absVirtualY) {
                this.settings.maxPointView = absVirtualX
            } else {
                this.settings.maxPointView = absVirtualY
            }

            let rest = this.settings.maxPointView%10
            if (!(rest == 0)) {
                this.settings.maxPointView = this.settings.maxPointView + (10 - rest)
            }

            return true
        } else {
            return false
        }
    }

    validateCoordinate(x, y) {
        return !(
            x < (this.settings.planeMargin+this.settings.endPointMargin) || x > (this.settings.planeMargin+this.planeWidth-this.settings.endPointMargin) ||
            y < (this.settings.planeMargin+this.settings.endPointMargin) || y > (this.settings.planeMargin+this.planeHeight-this.settings.endPointMargin)
        )
    }

    get planeWidth() {
        return this.#planeWidth
    }

    get planeHeight() {
        return this.#planeHeight
    }

    get pointMaxWidth() {
        return this.#pointMaxWidth
    }

    get pointMaxHeight() {
        return this.#pointMaxHeight
    }
}

export { CartesianPlane }