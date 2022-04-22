import { Plotter } from "./Plotter.mjs"

const canvas = document.getElementById("maincanvas")
const plane = new Plotter(canvas)

let dataset = []
for (let t = -20; t <= 20; t++) {
    dataset.push([t, t])
}

plane.plot(dataset)

var planeMarginSlider = document.getElementById("planeMargin")
planeMarginSlider.value = plane.settings.planeMargin
planeMarginSlider.oninput = function() {
    plane.settings.planeMargin = parseFloat(this.value)
    plane.redraw()
}

var endPointMarginSlider = document.getElementById("endPointMargin")
endPointMarginSlider.value = plane.settings.endPointMargin
endPointMarginSlider.oninput = function() {
    plane.settings.endPointMargin = parseFloat(this.value)
    plane.redraw()
}

var maxPointViewSlider = document.getElementById("maxPointView")
maxPointViewSlider.value = plane.settings.maxPointView
maxPointViewSlider.oninput = function() {
    plane.settings.maxPointView = parseInt(this.value)
    plane.redraw()
}

var strideCountSlider = document.getElementById("strideCount")
strideCountSlider.value = plane.settings.strideCount
strideCountSlider.oninput = function() {
    plane.settings.strideCount = parseInt(this.value)
    plane.redraw()
}

var drawPlanLine = document.getElementById("drawPlaneLine")
drawPlanLine.checked = plane.settings.drawPlaneLine
drawPlanLine.addEventListener('change', function() {
    plane.settings.drawPlaneLine = this.checked
    plane.redraw()
})