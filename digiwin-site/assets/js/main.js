/**
 * 云孪信息科技 - 前台公共逻辑
 */
(function () {
  'use strict';

  // ---- 预加载动画 ----
  function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(function () {
        preloader.classList.add('hidden');
      }, 400);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hidePreloader);
  } else {
    hidePreloader();
  }

  window.addEventListener('load', function () {
    hidePreloader();
  });

  // ---- 导航栏滚动效果 ----
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ---- 移动端菜单切换 ----
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.navbar-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // 点击链接关闭菜单
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // ---- 滚动渐入动画 ----
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .slide-up').forEach(function (el) {
    observer.observe(el);
  });

  // ---- 导航激活状态 ----
  function setActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.navbar-links a');
    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // 子页面匹配父级
    if (currentPath === 'case-detail.html') {
      links.forEach(function (link) {
        if (link.getAttribute('href') === 'cases.html') {
          link.classList.add('active');
        }
      });
    }
  }

  setActiveNav();

  // ---- 页脚动态渲染 ----
  function renderFooter() {
    const footerEl = document.getElementById('dynamic-footer');
    if (!footerEl) return;

    const config = DataLayer.getData('siteConfig');
    const footer = config.footer;
    const nav = DataLayer.getData('navigation').filter(function (n) { return n.visible; });

    footerEl.innerHTML = '\n      <div class="container">\n        <div class="footer-grid">\n          <div class="footer-brand">\n            <h3>' + config.name + '</h3>\n            <p>' + config.subtitle + '<br>' + footer.copyright + '</p>\n          </div>\n          <div class="footer-col">\n            <h4>快速导航</h4>\n            ' + nav.slice(0, 4).map(function (n) {
              return '<a href="' + n.href + '">' + n.label + '</a>';
            }).join('\n            ') + '\n            <a href="admin/login.html">后台管理</a>\n          </div>\n          <div class="footer-col">\n            <h4>服务支持</h4>\n            ' + footer.links.map(function (l) {
              return '<a href="' + l.href + '">' + l.label + '</a>';
            }).join('\n            ') + '\n          </div>\n          <div class="footer-col">\n            <h4>联系我们</h4>\n            <a href="contact.html">在线留言</a>\n            <a href="mailto:contact@digiwin-tech.com">邮件联系</a>\n          </div>\n        </div>\n        <div class="footer-bottom">\n          <p>' + footer.copyright + ' | ' + footer.icp + '</p>\n        </div>\n      </div>\n    ';
  }

  renderFooter();

  // ---- 点击滚动指示器 ----
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function () {
      const nextSection = document.querySelector('#capabilities') || document.querySelector('.section-header');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ---- 案例筛选（cases.html） ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const caseCards = document.querySelectorAll('.case-card');
  if (filterBtns.length && caseCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const category = btn.getAttribute('data-category');

        caseCards.forEach(function (card) {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ---- 案例详情页渲染 ----
  function renderCaseDetail() {
    const container = document.getElementById('case-detail-container');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const caseId = params.get('id');
    const caseData = DataLayer.getItemById('cases', caseId);

    if (!caseData) {
      container.innerHTML = '<div class="container" style="padding:200px 20px;text-align:center;"><h2>案例未找到</h2><p style="color:var(--text-secondary);margin-top:10px;">请确认案例 ID 是否正确</p><a href="cases.html" class="btn-primary" style="margin-top:20px;">返回案例列表</a></div>';
      return;
    }

    // 更新面包屑
    const breadcrumb = document.getElementById('case-breadcrumb');
    if (breadcrumb) {
      breadcrumb.innerHTML = '<a href="index.html">首页</a><span class="separator">/</span><a href="cases.html">案例</a><span class="separator">/</span><span class="current">' + caseData.title + '</span>';
    }

    // 更新标题
    document.title = caseData.title + ' - 云孪信息科技';

    function coverStyle(url) {
      if (!url) return '';
      return 'background-image:linear-gradient(rgba(10,14,39,0.55), rgba(10,14,39,0.8)), url(\'' + String(url).replace(/'/g, '%27') + '\');background-size:cover;background-position:center;';
    }
    var heroStyle = coverStyle(caseData.coverImage) || 'background:linear-gradient(135deg, #1a1a3e, #0a0e27);';

    container.innerHTML = '\n      <div class="container">\n        <div class="case-detail-hero" style="' + heroStyle + ' border-radius:16px; padding:60px; margin-bottom:40px; border:1px solid var(--card-border);">\n          <span class="tag tag-cyan" style="margin-bottom:16px;display:inline-block;">' + caseData.category + '</span>\n          <h1 style="font-size:2.4rem;font-weight:700;margin-bottom:16px;">' + caseData.title + '</h1>\n          <p style="font-size:1.1rem;color:var(--text-secondary);max-width:700px;">' + caseData.summary + '</p>\n        </div>\n\n        <div class="grid-2" style="margin-bottom:40px;">\n          <div class="card-glass">\n            <h3 style="font-size:1.1rem;margin-bottom:16px;color:var(--accent);">客户信息</h3>\n            <p style="color:var(--text-secondary);">' + caseData.clientName + '</p>\n          </div>\n          <div class="card-glass">\n            <h3 style="font-size:1.1rem;margin-bottom:16px;color:var(--accent);">技术栈</h3>\n            <p style="color:var(--text-secondary);">' + caseData.techStack + '</p>\n          </div>\n        </div>\n\n        <div class="card-glass" style="margin-bottom:40px;">\n          ' + caseData.detailContent + '\n        </div>\n\n        <div class="card-glass" style="margin-bottom:60px;">\n          <h3 style="font-size:1.1rem;margin-bottom:16px;color:var(--accent);">项目成果</h3>\n          <p style="color:var(--text-secondary);line-height:1.8;">' + caseData.results + '</p>\n        </div>\n\n        <div id="related-cases" style="margin-bottom:60px;">\n          <h2 style="font-size:1.8rem;margin-bottom:30px;">相关案例</h2>\n          <div class="grid-3" id="related-cases-grid"></div>\n        </div>\n      </div>\n    ';

    // 渲染相关案例
    const allCases = DataLayer.getData('cases').filter(function (c) { return c.status === 'published' && c.id !== caseId; });
    const relatedGrid = document.getElementById('related-cases-grid');
    if (relatedGrid) {
      const related = allCases.slice(0, 3);
      relatedGrid.innerHTML = related.map(function (c) {
        return '\n          <div class="card-glass" style="display:block;">\n            <span class="tag tag-cyan" style="margin-bottom:8px;">' + c.category + '</span>\n            <h4 style="font-size:1.05rem;margin-bottom:8px;">' + c.title + '</h4>\n            <p style="font-size:0.9rem;color:var(--text-secondary);">' + c.summary.substring(0, 80) + '...</p>\n          </div>\n        ';
      }).join('');
    }
  }

  renderCaseDetail();

})();
