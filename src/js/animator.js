// heroAnimator.js
// dependency: anime.js

export class HeroAnimator {

  constructor(el, type = 'hex', options = {}) {
    this.container = typeof el === 'string' ? document.querySelector(el) : el
    this.type = type
    this.options = options

    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')

    this.container.appendChild(this.canvas)

    this.resize()
    window.addEventListener('resize', () => this.resize())

    if (type === 'hex') this.initHex()
    if (type === 'waves') this.initWaves()
  }

  resize() {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight

    this.canvas.width = this.width
    this.canvas.height = this.height
  }

  // =========================
  // HEX GRID
  // =========================

  initHex() {

    const size = this.options.size || 40
    const rows = Math.ceil(this.height / size) + 2
    const cols = Math.ceil(this.width / size) + 2

    this.hexPoints = []

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {

        const offset = y % 2 ? size / 2 : 0

        this.hexPoints.push({
          x: x * size + offset,
          y: y * size * 0.86,
          scale: 1
        })

      }
    }

    anime({
      targets: this.hexPoints,
      scale: [
        { value: 1.006 },
        { value: 0.994 },
        { value: 1 }
      ],
      easing: "easeInOutSine",
      duration: 12000,
      delay: anime.stagger(80),
      loop: true,
      update: () => this.drawHex()
    })

  }

  drawHex() {

    const ctx = this.ctx
    ctx.clearRect(0, 0, this.width, this.height)

    const r = this.options.size || 40

    this.hexPoints.forEach(p => {

      const radius = r * 0.5 * p.scale

      ctx.beginPath()

      for (let i = 0; i < 6; i++) {

        const angle = Math.PI / 3 * i

        const x = p.x + radius * Math.cos(angle)
        const y = p.y + radius * Math.sin(angle)

        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)

      }

      ctx.closePath()

      ctx.strokeStyle = this.options.stroke || "rgba(255,252,240,0.06)"
      ctx.stroke()

    })

  }

  // =========================
  // WAVE GRID
  // =========================

  initWaves() {

    this.t = 0

    const animate = () => {

      this.t += 0.02

      this.drawWaves()

      requestAnimationFrame(animate)
    }

    animate()

  }

  drawWaves() {

    const ctx = this.ctx
    ctx.clearRect(0,0,this.width,this.height)

    const base = this.height / 2
    const step = this.width / 120

    ctx.lineWidth = 1.5
    ctx.strokeStyle = "rgba(255,255,255,0.2)"

    const draw = (amp, freq, phase) => {

      ctx.beginPath()

      for (let x = 0; x <= this.width; x += step) {

        const y =
          base +
          Math.sin(x * freq + this.t + phase) * amp

        if (x === 0) ctx.moveTo(x,y)
        else ctx.lineTo(x,y)

      }

      ctx.stroke()
    }

    // 5 верхних волн
    for (let i = 0; i < 5; i++) {
      draw(20 + i * 6, 0.01 + i * 0.002, i)
    }

    // 3 нижних
    for (let i = 0; i < 3; i++) {
      draw(-30 - i * 8, 0.015 + i * 0.002, i)
    }

  }

}