import { CartesianPlane } from "../../CartesianPlane.mjs";

class VectorPlotter extends CartesianPlane {
    #vectors
    constructor(canvas) {
        super(canvas)
        this.#vectors = []
    }
    
    #drawVector(vector) {
        const mid = this.getPosition(0, 0)
        let pos = this.getPosition(vector.x, vector.y)

        if (!(this.validateCoordinate(pos.x, pos.y))) {
            // cut
            if (pos.x < mid.x) {
                pos.x = this.settings.planeMargin+this.settings.endPointMargin
            } else if (pos.x > mid.x) {
                pos.x = this.settings.planeMargin+this.planeWidth-this.settings.endPointMargin
            }

            if (pos.y < mid.y){
                pos.y = this.settings.planeMargin+this.settings.endPointMargin
            } else if (y > mid.y) {
                pos.y = this.settings.planeMargin+this.planeHeight-this.settings.endPointMargin
            }
        }
        
        if (vector.color != null) {
            this.ctx.strokeStyle = vector.color
        }
        this.ctx.lineWidth = 2
        this.ctx.beginPath()
        
        this.ctx.moveTo(mid.x, mid.y)
        this.ctx.lineTo(pos.x, pos.y)
        
        this.ctx.stroke()
        this.ctx.closePath()
        this.ctx.lineWidth = 1
        if (vector.color != null) {
            this.ctx.strokeStyle = "rgba(153, 52, 231, 0.8)"
        }
    }

    redraw() {
        this.updateFrame()

        for (const vector of this.#vectors) {
            this.#drawVector(vector)
        }
    }
    
    plotVector(virtualX, virtualY, color=null, id=null) {
        let newVector = {
            x: virtualX,
            y: virtualY,
            color: color,
            id: id
        }
        this.#vectors.push(newVector)
        
        if (this.isUpdateMaxPointView(virtualX, virtualY)) {
            this.redraw()
        } else {
            this.#drawVector(newVector)
        }
    }
    
    clear() {
        while (this.#vectors.length > 0) {
            this.#vectors.pop()
        }

        this.updateFrame()
    }
}

export { VectorPlotter }