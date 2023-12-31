const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.5

/*let miaudio = new Audio ("../Dramatic Music.mp3")
miaudio.src="../Dramatic Music.mp3",
miaudio.currenttime=10,
miaudio.volume= 0.5,
miaudio.playbackrate=1.5,
miaudio.loop = true
miaudio.play();*/

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: '../imagenes/background.png',
  scale: 3.6
})

//si saco esto se rompe el programa :)
const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  imageSrc: '',
  scale: 2.75,
  framesMax: 6
})
//todo eso

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: '../imagenes/Medieveal/Idle.png',
  framesMax: 9,
  scale: 2.7,
  offset: {
    x: 0,
    y: 20
  },
  sprites: {
    idle: {
      imageSrc: '../imagenes/Medieveal/Idle.png',
      framesMax: 6
    },
    run: {
      imageSrc: '../imagenes/Medieveal/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: '../imagenes/Medieveal/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: '../imagenes/Medieveal/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: '../imagenes/Medieveal/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: '../imagenes/Medieveal/Hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: '../imagenes/Medieveal/Death.png',
      framesMax: 9
    }
  },
  attackBox: {
    offset: {
      x: 270,
      y: 50
    },
    width: 170,
    height: 100
  }
})

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: '../imagenes/Medieval Warrior Pack 2/Idle.png',
  framesMax: 8,
  scale: 4.8,
  offset: {
    x: 215,
    y: 137
  },
  sprites: {
    idle: {
      imageSrc: '../imagenes/Medieval Warrior Pack 2/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: '../imagenes/Medieval Warrior Pack 2/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: '../imagenes/Medieval Warrior Pack 2/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: '../imagenes/Medieval Warrior Pack 2/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: '../imagenes/Medieval Warrior Pack 2/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: '../imagenes/Medieval Warrior Pack 2/Take Hit.png',
      framesMax: 4
    },
    death: {
      imageSrc: '../imagenes/Medieval Warrior Pack 2/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: -10,
      y: 50
    },
    width: 170,
    height: 100
  }
})

console.log(player)

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit()
    player.isAttacking = false

    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }

  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  if (

    enemy.isAttacking &&
    enemy.framesCurrent === 4
  ) {
    player.takeHit()
    enemy.isAttacking = false

    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }


  if (enemy.isAttacking && enemy.framesCurrent === 4) {
    enemy.isAttacking = false
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        player.velocity.y = -15
        break
      case ' ':
        player.attack()
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        enemy.velocity.y = -15
        break
      case 'ArrowDown':
        enemy.attack()

        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})