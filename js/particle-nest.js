// 双主题粒子连线特效：白天蓝色，黑夜白色
// 通过监听 html[data-theme] 自动切换颜色
(function () {
  // 移动端禁用（与主题原配置 mobile: false 一致）
  if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) return

  // 如果主题自带的 canvas_nest 仍存在，移除，避免重复
  const oldScript = document.getElementById('canvas_nest')
  if (oldScript) oldScript.remove()

  // 创建画布
  const canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:fixed;top:0;left:0;z-index:-1;opacity:0.7'
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')

  let width, height
  let particles = []
  const mouse = { x: null, y: null }

  // 根据当前主题返回粒子颜色
  function getColor () {
    const theme = document.documentElement.getAttribute('data-theme')
    return theme === 'dark' ? '255,255,255' : '0,0,255'
  }

  function resize () {
    width = canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    height = canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  }

  function initParticles () {
    particles = []
    for (let i = 0; i < 99; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        xa: 2 * Math.random() - 1,
        ya: 2 * Math.random() - 1,
        max: 6000
      })
    }
  }

  function draw () {
    ctx.clearRect(0, 0, width, height)
    const color = getColor()
    const all = [mouse].concat(particles)

    particles.forEach((p, index) => {
      p.x += p.xa
      p.y += p.ya
      p.xa *= p.x > width || p.x < 0 ? -1 : 1
      p.ya *= p.y > height || p.y < 0 ? -1 : 1
      ctx.fillRect(p.x - 0.5, p.y - 0.5, 1, 1)

      all.forEach(q => {
        if (p !== q && q.x !== null && q.y !== null) {
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = dx * dx + dy * dy
          if (dist < q.max) {
            if (q === mouse && dist >= q.max / 2) {
              p.x -= 0.03 * dx
              p.y -= 0.03 * dy
            }
            const o = (q.max - dist) / q.max
            ctx.beginPath()
            ctx.lineWidth = o / 2
            ctx.strokeStyle = `rgba(${color},${o + 0.2})`
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }
      })
      particles.splice(particles.indexOf(p), 1)
    })
    requestAnimationFrame(draw)
  }

  resize()
  initParticles()
  window.onresize = resize
  window.onmousemove = e => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  }
  window.onmouseout = () => {
    mouse.x = null
    mouse.y = null
  }
  setTimeout(draw, 100)
})()
