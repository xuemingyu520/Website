/**
 * 云孪信息科技 - 粒子背景动画
 * Canvas 粒子系统，支持鼠标交互
 */
(function () {
  'use strict';

  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let mouse = { x: null, y: null, radius: 120 };

  const config = {
    particleCount: 80,
    particleColor: 'rgba(0, 229, 255, 0.6)',
    particleColorAlt: 'rgba(26, 95, 220, 0.4)',
    lineColor: 'rgba(0, 229, 255, 0.08)',
    particleSize: 2,
    particleSizeAlt: 1.2,
    speed: 0.4,
    connectDistance: 150
  };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * config.speed;
      this.vy = (Math.random() - 0.5) * config.speed;
      this.size = Math.random() > 0.5 ? config.particleSize : config.particleSizeAlt;
      this.color = Math.random() > 0.5 ? config.particleColor : config.particleColorAlt;
    }

    update() {
      // 鼠标交互
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.vx += Math.cos(angle) * force * 0.1;
          this.vy += Math.sin(angle) * force * 0.1;
        }
      }

      this.x += this.vx;
      this.y += this.vy;

      // 边界回弹
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      // 速度衰减
      this.vx *= 0.999;
      this.vy *= 0.999;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.floor(config.particleCount * (canvas.width * canvas.height) / (1920 * 1080));
    for (let i = 0; i < Math.max(count, 40); i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.connectDistance) {
          const opacity = 1 - dist / config.connectDistance;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${opacity * 0.08})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.update();
      p.draw();
    }

    connectParticles();
    animationId = requestAnimationFrame(animate);
  }

  // 鼠标事件
  document.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('mouseleave', function () {
    mouse.x = null;
    mouse.y = null;
  });

  // 触摸事件
  document.addEventListener('touchmove', function (e) {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', function () {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', function () {
    resize();
    initParticles();
  });

  resize();
  initParticles();
  animate();
})();
