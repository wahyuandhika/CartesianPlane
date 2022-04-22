import { CartesianPlane } from "../../CartesianPlane.mjs";

class Plotter extends CartesianPlane {
    #plots
    constructor(canvas) {
        super(canvas)

        this.#plots = []
    }

    redraw() {
        this.updateFrame()

        this.#plots.forEach((coordinate) => {
            const virtualX = coordinate[0]
            const virtualY = coordinate[1]

            this.drawPlot(virtualX, virtualY)
        })
    }

    drawPlot(virtualX, virtualY) {
        const pos = this.getPosition(virtualX, virtualY)
        const x = pos.x
        const y = pos.y

        if (this.validateCoordinate(x, y))
        {
            // inside of the plane
            this.ctx.fillRect(x-2, y-2, 4, 4)
        } else {
            // coordinate is on the outside of the plane
        }
    }

    // coordinates: [[x, y]. [x, y]]
    plot(coordinates) {
        let requireNewFrame = false
        for (let coordinate of coordinates) {
            const virtualX = coordinate[0]
            const virtualY = coordinate[1]
            
            this.#plots.push([virtualX, virtualY])

            if (this.isUpdateMaxPointView(virtualX, virtualY)) {
                requireNewFrame = true
            } else {
                if (!requireNewFrame) {
                    this.drawPlot(virtualX, virtualY)
                }
            }
        }

        if (requireNewFrame) {
            this.redraw()
        }
    }

    clear() {
        while (this.#plots.length > 0) {
            this.#plots.pop()
        }

        this.updateFrame()
    }
}

export { Plotter }