<template>
  <div class='progress' ref='container'></div>
</template>
<script>
export default {
  name: 'progressComponent',
  props: {
    percent: {
      type: Number,
      default: 0.5
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
      drawWidth: 0.9,
      progress: {}
    }
  },
  mounted () {
    this.getContentStyle()
    this.createCanvas()
    this.computedPointers()
    this.computedProgress()
    this.init()
  },
  methods: {
    async init () {
      // 初始化画布，描点画线
      let that = this
      let ctx = that.elCanvas.getContext('2d')
          ctx.lineWidth = 20
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.moveTo(this.pointers[0].x, this.pointers[0].y)
      let gnt = ctx.createLinearGradient(this.pointers[0].x, this.pointers[0].y, this.pointers[1].x, this.pointers[1].y)
          gnt.addColorStop(0, 'rgba(72, 107, 236, 0)')
          gnt.addColorStop(0.5, 'rgba(72, 107, 236, 0.5)')
          ctx.strokeStyle = gnt
          ctx.lineTo(that.pointers[1].x, that.pointers[1].y)
          ctx.stroke()
          // ctx.save()
      // let gnt1 = ctx.createLinearGradient(this.pointers[1].x, this.pointers[1].y, this.pointers[2].x, this.pointers[2].y)
      //     gnt1.addColorStop(0.5, 'rgba(72, 107, 236, 0.5)')
      //     gnt1.addColorStop(1, 'rgba(72, 107, 236, 1)')
      //     ctx.strokeStyle = gnt1
      //     ctx.lineTo(that.pointers[2].x, that.pointers[2].y)
      //     ctx.stroke()
      // for (let index = 0; index < this.pointers.length; index++) {
      //   debugger
      //   let pointer = this.pointers[index]
      //   if (index < that.pointers.length - 1) {
      //     let gnt = ctx.createLinearGradient(pointer.x, pointer.y, that.pointers[index + 1].x, that.pointers[index + 1].y)
      //     gnt.addColorStop(0, 'rgba(72, 107, 236, ' + index / (this.pointers.length - 1) + ')')
      //     gnt.addColorStop(1, 'rgba(72, 107, 236, ' + (index + 1) / (this.pointers.length - 1) + ')')
      //     ctx.strokeStyle = gnt
      //     ctx.lineTo(that.pointers[index + 1].x, that.pointers[index + 1].y)
      //     ctx.stroke()
      //   }
      // }
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
      let endPointer = {}
      for (let index = 1; index < this.pointers.length; index++) {
        if (this.percent <= index / (this.pointers.length - 1)) {
          progress = index - 1
          break
        }
      }
      console.log(progress)
      switch (progress) {
        case 0:
          endPointer = {
            x: 2 * Math.PI * this.percent
          }
          break
        case 1:
        case 2:
        case 3:
        case 4:
      }
    }
  }
}
</script>
<style scoped>
.progress {
  width: 100%;
  height: 100%;
}
.progress canvas {
  width: 100%;
  height: 100%;
}
</style>
