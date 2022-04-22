import { VectorPlotter } from "./VectorPlotter.mjs"

const canvas = document.getElementById("maincanvas")
const plane = new VectorPlotter(canvas)

var vectors = [{id: "vector-1", color: "rgb(100, 200, 140)"}]

function parseVectorFormat(text) {
    text = text.split("(")[1]
    if (text != undefined) {
        text = text.split(")")[0]
        let x = parseFloat(text.split(",")[0])
        let y = parseFloat(text.split(",")[1])
        if (isNaN(x) || isNaN(y)){
            return null
        } else {
            return {x: x, y: y}
        }
    }
}

function drawVectors() {
    plane.clear()
    for (const vector of vectors) {
        let inputVector = document.getElementById(vector.id)
        let vectorValue = parseVectorFormat(inputVector.value)
        if (vectorValue != null) {
            plane.plotVector(vectorValue.x, vectorValue.y, vector.color, vector.id)
        }
    }
}

function addNewVector() {
    let newId = `vector-${vectors.length+1}`
    vectors.push({
        id: newId,
        color: "rgb(100, 200, 140)"
    })

    let vectorItems = document.getElementById("vectorItems")
    let content = `
<div class="card m-2">
    <div class="card-body">
        <div class="row">
            <div class="col-auto">
                <label for="${newId}" class="form-label">Vector ${vectors.length}</label>
            </div>
            <div class="col-auto">
                <input type="text" class="form-control" id="${newId}" value="(0, 0)">
            </div>
        </div>
    </div>
</div>`
    vectorItems.insertAdjacentHTML('beforeend', content);
}

var doDraw = document.getElementById("doDraw")
doDraw.addEventListener("click", event => {
    drawVectors()
})

var newVectorBtn = document.getElementById("newVector")
newVectorBtn.addEventListener("click", event => {
    addNewVector()
})
