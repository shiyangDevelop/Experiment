<template>
  <div class='progress' ref='container'></div>
</template>
<script>
export default {
  name: 'progressComponent',
  props: {
    percent: {
      type: Number,
      default: 0.7
    },
    offsetLeft: {
      type: Number,
      default: 0
    },
    offsetTop: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      containerStyle: {},
      elCanvas: '',
      pointers: [],
      drawWidth: 1,
      progress: {}
    }
  },
  mounted () {
    this.getContentStyle()
    this.createCanvas()
    this.computedPointers()
    this.init()
  },
  methods: {
    async init () {
      // 初始化画布，描点画线
      let that = this
      let { progress, endPointer } = this.computedProgress()
      for (let index = 0; index < progress + 1; index++) {
        let pointer = this.pointers[index]
        if (index < that.pointers.length - 1) {
          let image = await that.convertCanvasToImage()
          that.elCanvas = that.convertImageToCanvas(image)
          let ctx = that.elCanvas.getContext('2d')
          ctx.lineWidth = 20
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.moveTo(pointer.x, pointer.y)
          let gnt = ctx.createLinearGradient(pointer.x, pointer.y, that.pointers[index + 1].x, that.pointers[index + 1].y)
          if (index === progress) {
            gnt = ctx.createLinearGradient(pointer.x, pointer.y, endPointer.x, endPointer.y)
            gnt.addColorStop(0, 'rgba(72, 107, 236, ' + index / (this.pointers.length - 1) + ')')
            gnt.addColorStop(1, 'rgba(72, 107, 236, 1)')
          } else {
            gnt.addColorStop(0, 'rgba(72, 107, 236, ' + index / (this.pointers.length - 1) + ')')
            gnt.addColorStop(1, 'rgba(72, 107, 236, ' + (index + 1) / (this.pointers.length - 1) + ')')
          }
          ctx.strokeStyle = gnt
          if (index === progress) {
            ctx.lineTo(endPointer.x, endPointer.y)
          } else {
            ctx.lineTo(that.pointers[index + 1].x, that.pointers[index + 1].y)
          }
          ctx.stroke()
          if (index < progress) {
            that.clearArcFun(that.pointers[index + 1].x, that.pointers[index + 1].y, 10, ctx)
            // ctx.clearRect(that.pointers[index + 1].x - 10, that.pointers[index + 1].y - 10, 20, 20)
          }
          if (index === progress) {
            that.reDrawCanvas()
          }
        }
      }
    },
    createCanvas () {
      // 创建画布元素
      let elCanvas = document.createElement('canvas')
      elCanvas.width = this.containerStyle.width
      elCanvas.height = parseFloat(this.containerStyle.height)
      this.elCanvas = elCanvas
      this.$refs.container.appendChild(elCanvas)
    },
    reDrawCanvas () {
      this.$refs.container.removeChild(this.$refs.container.childNodes[0])
      this.$refs.container.appendChild(this.elCanvas)
    },
    convertCanvasToImage (callback) {
      let that = this
      let image = new Image()
      image.width = that.elCanvas.width
      image.height = that.elCanvas.height
      image.src = this.elCanvas.toDataURL('image/png')
      return new Promise(function (resolve, reject) {
        image.onload = function () {
          resolve(image)
        }
      })
    },
    convertImageToCanvas (image) {
      let canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      canvas.getContext('2d').drawImage(image, 0, 0)
      return canvas
    },
    getContentStyle () {
      // 获取容器元素的样式做自适应
      let container = this.$refs.container
      let containerStyle = JSON.parse(JSON.stringify(window.getComputedStyle(container)))
      for (let style in containerStyle) {
        if (!isNaN(parseFloat(containerStyle[style]))) {
          containerStyle[style] = parseFloat(containerStyle[style])
        }
      }
      containerStyle.width = containerStyle.width * this.drawWidth
      this.containerStyle = containerStyle
    },
    clearArcFun (x, y, r, cxt) {
      let stepClear = 0.1
      clearArc(x, y, r)
      function clearArc (x, y, radius) {
        let calcWidth = radius - stepClear
        let calcHeight = Math.sqrt(radius * radius - calcWidth * calcWidth)
        let posX = x - calcWidth
        let posY = y - calcHeight
        let widthX = 2 * calcWidth
        let heightY = 2 * calcHeight
        if (stepClear <= radius) {
          cxt.clearRect(posX, posY, widthX, heightY)
          stepClear += 1
          clearArc(x, y, radius)
        }
      }
    },
    computedPointers () {
      // 计算画布中关键点坐标
      let side = this.containerStyle.width / 2
      this.pointers = [
        {
          x: (this.containerStyle.width / 2) + this.offsetLeft,
          y: (this.containerStyle.width) + this.offsetTop
        }, {
          x: (this.containerStyle.width / 2 - side * Math.sqrt(3) / 2) + this.offsetLeft,
          y: (this.containerStyle.width * 3 / 4) + this.offsetTop
        }, {
          x: (this.containerStyle.width / 2 - side * Math.sqrt(3) / 2) + this.offsetLeft,
          y: (this.containerStyle.width * 1 / 4) + this.offsetTop
        }, {
          x: (this.containerStyle.width / 2) + this.offsetLeft,
          y: this.offsetTop
        }, {
          x: (this.containerStyle.width / 2 + side * Math.sqrt(3) / 2) + this.offsetLeft,
          y: (this.containerStyle.width * 1 / 4) + this.offsetTop
        }, {
          x: (this.containerStyle.width / 2 + side * Math.sqrt(3) / 2) + this.offsetLeft,
          y: (this.containerStyle.width * 3 / 4) + this.offsetTop
        }, {
          x: (this.containerStyle.width / 2) + this.offsetLeft,
          y: (this.containerStyle.width) + this.offsetTop
        }
      ]
    },
    computedProgress () {
      // 计算进度
      let progress = 10
      let side = this.containerStyle.width / 2
      let endPointer = {}
      for (let index = 1; index < this.pointers.length; index++) {
        if (this.percent <= index / (this.pointers.length - 1)) {
          progress = index - 1
          break
        }
      }
      let remainderSide = side * 6 * (this.percent - progress / 6)
      console.log(remainderSide)
      switch (progress) {
        case 0:
          endPointer = {
            x: side - remainderSide / Math.sqrt(3) + this.offsetLeft,
            y: side * 2 - remainderSide / 2
          }
          break
        case 1:
          endPointer = {
            x: this.pointers[1].x + this.offsetLeft,
            y: side * 3 / 2 - remainderSide
          }
          break
        case 2:
          endPointer = {
            x: side - side / Math.sqrt(3) + remainderSide / Math.sqrt(3) + this.offsetLeft,
            y: side / 4 - remainderSide / 2
          }
          break
        case 3:
          endPointer = {
            x: side + remainderSide / Math.sqrt(3) + this.offsetLeft,
            y: remainderSide / 2
          }
          break
        case 4:
          endPointer = {
            x: side + side * Math.sqrt(3) / 2 + this.offsetLeft,
            y: side / 2 + remainderSide
          }
          break
        case 5:
          endPointer = {
            x: side + side / Math.sqrt(3) - remainderSide / Math.sqrt(3) + this.offsetLeft,
            y: side * 3 / 2 + remainderSide / 2
          }
      }
      return {
        endPointer,
        progress
      }
    }
  }
}
</script>
<style scoped>
.progress {
  width: 100%;
  height: 100%;
  border: 1px solid #eee;
}
.progress canvas {
  width: 100%;
  height: 100%;
}
</style>
