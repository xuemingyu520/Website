/**
 * 云孪信息科技 - 后台核心逻辑
 */
(function () {
  'use strict';

  // ---- 登录检查 ----
  if (window.location.pathname.indexOf('login.html') === -1) {
    const session = sessionStorage.getItem('digiwin_admin_session');
    if (!session) {
      window.location.href = 'login.html';
      return;
    }
    var currentUser = JSON.parse(session);
  }

  // ---- 登录页逻辑 ----
  function initLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      const errorEl = document.getElementById('login-error');

      if (!username || !password) {
        errorEl.textContent = '请输入用户名和密码';
        errorEl.classList.add('show');
        return;
      }

      const users = DataLayer.getData('users');
      const user = users.find(function (u) {
        return u.username === username && u.password === password;
      });

      if (user) {
        sessionStorage.setItem('digiwin_admin_session', JSON.stringify({
          username: user.username,
          role: user.role
        }));
        window.location.href = 'index.html';
      } else {
        errorEl.textContent = '用户名或密码错误';
        errorEl.classList.add('show');
      }
    });
  }

  initLogin();

  // ---- 后台主页逻辑 ----
  var currentPanel = 'dashboard';

  function initAdmin() {
    const panelContainer = document.getElementById('admin-panels');
    if (!panelContainer) return;

    // 设置用户信息
    var userEl = document.getElementById('sidebar-username');
    var roleEl = document.getElementById('sidebar-role');
    if (userEl) userEl.textContent = currentUser.username;
    if (roleEl) roleEl.textContent = currentUser.role === 'admin' ? '管理员' : '编辑者';

    // 权限控制
    if (currentUser.role !== 'admin') {
      var userMgmt = document.querySelector('[data-panel="users"]');
      if (userMgmt) userMgmt.style.display = 'none';
    }

    // 菜单切换
    document.querySelectorAll('.nav-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var panel = this.getAttribute('data-panel');
        switchPanel(panel);
        document.querySelectorAll('.nav-item').forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
      });
    });

    // 初始化仪表盘
    updateDashboard();
    switchPanel('dashboard');

    // 退出登录
    var logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        sessionStorage.removeItem('digiwin_admin_session');
        window.location.href = 'login.html';
      });
    }
  }

  function switchPanel(panel) {
    currentPanel = panel;
    document.querySelectorAll('.admin-panel').forEach(function (p) { p.classList.remove('active'); });
    var target = document.getElementById('panel-' + panel);
    if (target) target.classList.add('active');

    // 渲染对应面板
    if (panel === 'dashboard') updateDashboard();
    if (panel === 'hero') renderHeroPanel();
    if (panel === 'solutions') renderSolutionsPanel();
    if (panel === 'cases') renderCasesPanel();
    if (panel === 'about') renderAboutPanel();
    if (panel === 'news') renderNewsPanel();
    if (panel === 'contact') renderContactPanel();
    if (panel === 'navigation') renderNavPanel();
    if (panel === 'users') renderUsersPanel();
  }

  // ---- Toast ----
  function showToast(msg, type) {
    type = type || 'info';
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 2500);
  }

  function showSaveError() {
    var error = DataLayer.getLastSaveError && DataLayer.getLastSaveError();
    var isQuotaError = error && (error.name === 'QuotaExceededError' || error.code === 22);
    showToast(isQuotaError ? '保存失败：浏览器本地存储空间不足，请压缩图片或删除旧图片后再试' : '保存失败，请检查浏览器存储权限', 'error');
  }

  function readCompressedImage(file, callback) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var image = new Image();
      image.onload = function () {
        var maxSize = 1200;
        var width = image.width;
        var height = image.height;
        if (width > maxSize || height > maxSize) {
          var ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);
        var dataUrl = canvas.toDataURL('image/jpeg', 0.76);

        if (dataUrl.length > 900 * 1024) {
          showToast('图片压缩后仍然过大，请换一张更小的图片', 'error');
          callback(null);
          return;
        }
        callback(dataUrl);
      };
      image.onerror = function () {
        showToast('图片读取失败，请更换图片后重试', 'error');
        callback(null);
      };
      image.src = e.target.result;
    };
    reader.onerror = function () {
      showToast('图片读取失败，请更换图片后重试', 'error');
      callback(null);
    };
    reader.readAsDataURL(file);
  }

  // ---- 仪表盘 ----
  function updateDashboard() {
    var cases = DataLayer.getData('cases').filter(function (c) { return c.status === 'published'; });
    var solutions = DataLayer.getData('solutions').filter(function (s) { return s.status === 'published'; });
    var news = DataLayer.getData('news').filter(function (n) { return n.status === 'published'; });

    var casesEl = document.getElementById('stat-cases');
    var solEl = document.getElementById('stat-solutions');
    var newsEl = document.getElementById('stat-news');
    if (casesEl) casesEl.textContent = cases.length;
    if (solEl) solEl.textContent = solutions.length;
    if (newsEl) newsEl.textContent = news.length;
  }

  function serializeSiteData() {
    var data = DataLayer.getData();
    return [
      '/*',
      ' * 项目数据文件。',
      ' * 由后台管理系统导出。覆盖 site-content/site-data.js 后提交到 GitHub 即可发布。',
      ' * 导出时间: ' + new Date().toISOString(),
      ' */',
      'window.DIGIWIN_SITE_DATA = ' + JSON.stringify(data, null, 2) + ';',
      'window.DIGIWIN_SITE_DATA_UPDATED_AT = "' + new Date().toISOString() + '";',
      ''
    ].join('\n');
  }

  function downloadTextFile(filename, text) {
    var blob = new Blob([text], { type: 'application/javascript;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function parseImportedData(text) {
    var jsonText = text;
    var match = text.match(/window\.DIGIWIN_SITE_DATA\s*=\s*([\s\S]*?);\s*window\.DIGIWIN_SITE_DATA_UPDATED_AT/);
    if (match) {
      jsonText = match[1];
    }
    return JSON.parse(jsonText);
  }

  function initDataPublishTools() {
    var exportBtn = document.getElementById('btn-export-data');
    var importBtn = document.getElementById('btn-import-data');
    var importInput = document.getElementById('import-data-file');
    var resetBtn = document.getElementById('btn-reset-local-data');

    if (exportBtn) {
      exportBtn.addEventListener('click', function () {
        downloadTextFile('site-data.js', serializeSiteData());
        showToast('已导出 site-data.js，请覆盖 site-content/site-data.js 后推送 GitHub', 'success');
      });
    }

    if (importBtn && importInput) {
      importBtn.addEventListener('click', function () {
        importInput.click();
      });
      importInput.addEventListener('change', function () {
        var file = importInput.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (e) {
          try {
            var data = parseImportedData(e.target.result);
            if (!DataLayer.setData('', data)) {
              showSaveError();
              return;
            }
            showToast('数据已导入当前浏览器', 'success');
            setTimeout(function () { window.location.reload(); }, 600);
          } catch (err) {
            showToast('导入失败：文件格式不正确', 'error');
          }
        };
        reader.readAsText(file);
        importInput.value = '';
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (!confirm('确定清空当前浏览器中的后台编辑数据，并恢复项目文件中的默认数据吗？')) return;
        if (!DataLayer.resetData()) {
          showSaveError();
          return;
        }
        showToast('本地草稿已清空', 'success');
        setTimeout(function () { window.location.reload(); }, 600);
      });
    }
  }

  // ---- 通用表格渲染 ----
  function renderTable(containerId, items, columns, actions, key) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var html = '<table class="data-table"><thead><tr>';
    columns.forEach(function (col) {
      html += '<th>' + col.label + '</th>';
    });
    html += '<th style="width:160px;">操作</th></tr></thead><tbody>';

    if (items.length === 0) {
      html += '<tr><td colspan="' + (columns.length + 1) + '" style="text-align:center;color:var(--text-secondary);padding:40px;">暂无数据</td></tr>';
    } else {
      items.forEach(function (item) {
        html += '<tr>';
        columns.forEach(function (col) {
          var val = item[col.key] || '';
          if (col.key === 'status') {
            val = '<span class="badge-status badge-' + val + '">' + (val === 'published' ? '已发布' : '草稿') + '</span>';
          }
          if (col.key === 'visible') {
            val = '<span class="badge-status badge-' + (val ? 'published' : 'draft') + '">' + (val ? '可见' : '隐藏') + '</span>';
          }
          if (col.type === 'truncate' && typeof val === 'string') {
            val = val.length > 60 ? val.substring(0, 60) + '...' : val;
          }
          html += '<td>' + val + '</td>';
        });
        html += '<td class="actions">';
        actions.forEach(function (act) {
          if (act.role && currentUser.role !== 'admin' && act.role === 'admin') return;
          html += '<button class="btn-sm btn-' + act.type + '" data-action="' + act.action + '" data-id="' + item.id + '" data-key="' + key + '">' + act.label + '</button>';
        });
        html += '</td></tr>';
      });
    }
    html += '</tbody></table>';
    container.innerHTML = html;

    // 绑定操作事件
    container.querySelectorAll('[data-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = this.getAttribute('data-action');
        var id = this.getAttribute('data-id');
        var dataKey = this.getAttribute('data-key');
        handleAction(action, id, dataKey);
      });
    });
  }

  function handleAction(action, id, dataKey) {
    if (action === 'edit') {
      var item = DataLayer.getItemById(dataKey, id);
      openEditModal(dataKey, item);
    } else if (action === 'delete') {
      if (!confirm('确定要删除此项吗？此操作不可恢复。')) return;
      if (!DataLayer.deleteItem(dataKey, id)) {
        showSaveError();
        return;
      }
      showToast('删除成功', 'success');
      refreshCurrentPanel();
    } else if (action === 'toggle-status') {
      var item = DataLayer.getItemById(dataKey, id);
      var newStatus = item.status === 'published' ? 'draft' : 'published';
      if (!DataLayer.updateItem(dataKey, id, { status: newStatus })) {
        showSaveError();
        return;
      }
      showToast('状态已切换', 'success');
      refreshCurrentPanel();
    } else if (action === 'toggle-visible') {
      var navItem = DataLayer.getItemById(dataKey, id);
      if (!DataLayer.updateItem(dataKey, id, { visible: !navItem.visible })) {
        showSaveError();
        return;
      }
      showToast('可见性已切换', 'success');
      refreshCurrentPanel();
    } else if (action === 'preview') {
      var item = DataLayer.getItemById(dataKey, id);
      previewItem(dataKey, item);
    }
  }

  function refreshCurrentPanel() {
    switchPanel(currentPanel);
  }

  // ---- 预览 ----
  function previewItem(dataKey, item) {
    if (dataKey === 'cases') {
      window.open('../case-detail.html?id=' + item.id, '_blank');
    } else if (dataKey === 'solutions') {
      window.open('../solutions.html#' + item.id, '_blank');
    }
  }

  // ---- 模态弹窗 ----
  var modalCallback = null;

  function openModal(title, fields, data, callback) {
    modalCallback = callback;
    var overlay = document.getElementById('modal-overlay');
    var content = document.getElementById('modal-content');

    var html = '<h3>' + title + '</h3>';
    fields.forEach(function (field) {
      html += '<div class="form-group"><label>' + field.label + '</label>';
      var val = data ? (data[field.key] !== undefined ? data[field.key] : '') : '';

      if (field.type === 'textarea') {
        html += '<textarea id="field-' + field.key + '" rows="' + (field.rows || 6) + '">' + escapeHtml(val) + '</textarea>';
      } else if (field.type === 'select') {
        html += '<select id="field-' + field.key + '">';
        field.options.forEach(function (opt) {
          var selected = val === opt.value ? ' selected' : '';
          html += '<option value="' + opt.value + '"' + selected + '>' + opt.label + '</option>';
        });
        html += '</select>';
      } else if (field.type === 'number') {
        html += '<input type="number" id="field-' + field.key + '" value="' + val + '">';
      } else if (field.type === 'upload') {
        var previewDisplay = val ? 'block' : 'none';
        var placeholderDisplay = val ? 'none' : 'flex';
        html += '<div class="upload-group">';
        html += '<input type="file" id="file-' + field.key + '" accept="image/*" style="display:none;">';
        html += '<input type="hidden" id="field-' + field.key + '" value="' + escapeHtml(val) + '">';
        html += '<img src="' + escapeHtml(val) + '" class="upload-preview-img" id="preview-' + field.key + '" style="display:' + previewDisplay + ';">';
        html += '<div class="upload-preview-img upload-preview-placeholder" id="preview-placeholder-' + field.key + '" style="display:' + placeholderDisplay + ';">暂无图片</div>';
        html += '<button type="button" class="btn-sm btn-edit upload-btn" data-upload-key="' + field.key + '">选择图片</button>';
        html += '<button type="button" class="btn-sm btn-delete upload-remove-btn" data-upload-key="' + field.key + '">移除图片</button>';
        html += '<span class="upload-hint">支持 JPG/PNG，建议小于 1MB</span>';
        html += '</div>';
      } else {
        html += '<input type="text" id="field-' + field.key + '" value="' + escapeHtml(val) + '">';
      }
      html += '</div>';
    });

    html += '<div class="form-actions"><button class="btn-cancel" id="modal-cancel">取消</button><button class="btn-primary" id="modal-save">保存</button></div>';
    content.innerHTML = html;
    overlay.classList.add('open');

    // 绑定上传按钮
    content.querySelectorAll('.upload-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = this.getAttribute('data-upload-key');
        var fileInput = document.getElementById('file-' + key);
        fileInput.click();
        fileInput.onchange = function () {
          var file = fileInput.files[0];
          if (!file) return;
          if (file.size > 5 * 1024 * 1024) {
            showToast('图片大小不能超过 5MB', 'error');
            return;
          }
          readCompressedImage(file, function (dataUrl) {
            if (!dataUrl) return;
            document.getElementById('field-' + key).value = dataUrl;
            var preview = document.getElementById('preview-' + key);
            var placeholder = document.getElementById('preview-placeholder-' + key);
            if (preview) {
              preview.className = 'upload-preview-img';
              preview.src = dataUrl;
              preview.style.display = 'block';
            }
            if (placeholder) {
              placeholder.style.display = 'none';
            }
          });
        };
      });
    });

    content.querySelectorAll('.upload-remove-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = this.getAttribute('data-upload-key');
        var field = document.getElementById('field-' + key);
        var preview = document.getElementById('preview-' + key);
        var placeholder = document.getElementById('preview-placeholder-' + key);
        if (field) field.value = '';
        if (preview) {
          preview.removeAttribute('src');
          preview.style.display = 'none';
        }
        if (placeholder) {
          placeholder.style.display = 'flex';
        }
      });
    });

    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    document.getElementById('modal-save').addEventListener('click', function () {
      var result = {};
      fields.forEach(function (field) {
        var el = document.getElementById('field-' + field.key);
        if (el) {
          var val = el.value;
          if (field.type === 'number') val = parseInt(val) || 0;
          if (field.key === 'visible') val = val === 'true';
          result[field.key] = val;
        }
      });
      var shouldClose = true;
      if (callback) {
        shouldClose = callback(result) !== false;
      }
      if (shouldClose) closeModal();
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
  }

  function openEditModal(dataKey, item) {
    var fields = getFields(dataKey);
    var isNew = !item;
    openModal(
      isNew ? '新增' : '编辑',
      fields,
      item || {},
      function (values) {
        if (isNew) {
          values.id = dataKey.substring(0, 3) + '-new-' + Date.now();
          if (dataKey === 'heroSlides') {
            values.status = values.status || 'draft';
          }
          if (!DataLayer.addItem(dataKey, values)) {
            showSaveError();
            return false;
          }
          showToast('创建成功', 'success');
        } else {
          if (!DataLayer.updateItem(dataKey, item.id, values)) {
            showSaveError();
            return false;
          }
          showToast('更新成功', 'success');
        }
        refreshCurrentPanel();
        return true;
      }
    );
  }

  function closeModal() {
    var overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('open');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function getFields(dataKey) {
    var fieldsMap = {
      heroSlides: [
        { key: 'title', label: '标题' },
        { key: 'subtitle', label: '副标题' },
        { key: 'description', label: '描述', type: 'textarea', rows: 3 },
        { key: 'bgImage', label: '背景图', type: 'upload' },
        { key: 'ctaText', label: '按钮文字' },
        { key: 'ctaLink', label: '按钮链接' },
        { key: 'order', label: '排序', type: 'number' },
        { key: 'status', label: '状态', type: 'select', options: [{ value: 'published', label: '已发布' }, { value: 'draft', label: '草稿' }] }
      ],
      solutions: [
        { key: 'title', label: '标题' },
        { key: 'icon', label: '图标标识' },
        { key: 'summary', label: '摘要', type: 'textarea', rows: 3 },
        { key: 'detailContent', label: '详细内容(HTML)', type: 'textarea', rows: 12 },
        { key: 'coverImage', label: '封面图', type: 'upload' },
        { key: 'order', label: '排序', type: 'number' },
        { key: 'status', label: '状态', type: 'select', options: [{ value: 'published', label: '已发布' }, { value: 'draft', label: '草稿' }] }
      ],
      cases: [
        { key: 'title', label: '标题' },
        { key: 'category', label: '分类', type: 'select', options: [{ value: '智慧城市', label: '智慧城市' }, { value: '智慧工厂', label: '智慧工厂' }, { value: '智慧农业', label: '智慧农业' }, { value: '军事仿真', label: '军事仿真' }, { value: '可视化大屏', label: '可视化大屏' }] },
        { key: 'summary', label: '摘要', type: 'textarea', rows: 3 },
        { key: 'detailContent', label: '详细内容(HTML)', type: 'textarea', rows: 12 },
        { key: 'clientName', label: '客户名称' },
        { key: 'techStack', label: '技术栈' },
        { key: 'results', label: '项目成果' },
        { key: 'coverImage', label: '封面图', type: 'upload' },
        { key: 'order', label: '排序', type: 'number' },
        { key: 'status', label: '状态', type: 'select', options: [{ value: 'published', label: '已发布' }, { value: 'draft', label: '草稿' }] }
      ],
      news: [
        { key: 'title', label: '标题' },
        { key: 'summary', label: '摘要', type: 'textarea', rows: 3 },
        { key: 'content', label: '内容(HTML)', type: 'textarea', rows: 10 },
        { key: 'date', label: '日期' },
        { key: 'order', label: '排序', type: 'number' },
        { key: 'status', label: '状态', type: 'select', options: [{ value: 'published', label: '已发布' }, { value: 'draft', label: '草稿' }] }
      ]
    };
    return fieldsMap[dataKey] || [];
  }

  // ---- 各面板渲染 ----
  function renderHeroPanel() {
    var items = DataLayer.getItems('heroSlides');
    items.sort(function (a, b) { return a.order - b.order; });
    renderTable('hero-table', items, [
      { key: 'order', label: '#' },
      { key: 'title', label: '标题' },
      { key: 'subtitle', label: '副标题', type: 'truncate' },
      { key: 'status', label: '状态' }
    ], [
      { action: 'edit', type: 'edit', label: '编辑' },
      { action: 'toggle-status', type: 'edit', label: '切换状态' },
      { action: 'delete', type: 'delete', label: '删除', role: 'admin' }
    ], 'heroSlides');
  }

  function renderSolutionsPanel() {
    var items = DataLayer.getItems('solutions');
    items.sort(function (a, b) { return a.order - b.order; });
    renderTable('solutions-table', items, [
      { key: 'order', label: '#' },
      { key: 'title', label: '标题' },
      { key: 'summary', label: '摘要', type: 'truncate' },
      { key: 'status', label: '状态' }
    ], [
      { action: 'edit', type: 'edit', label: '编辑' },
      { action: 'toggle-status', type: 'edit', label: '切换状态' },
      { action: 'preview', type: 'preview', label: '预览' },
      { action: 'delete', type: 'delete', label: '删除', role: 'admin' }
    ], 'solutions');
  }

  function renderCasesPanel() {
    var items = DataLayer.getItems('cases');
    items.sort(function (a, b) { return a.order - b.order; });
    renderTable('cases-table', items, [
      { key: 'order', label: '#' },
      { key: 'title', label: '标题' },
      { key: 'category', label: '分类' },
      { key: 'clientName', label: '客户' },
      { key: 'status', label: '状态' }
    ], [
      { action: 'edit', type: 'edit', label: '编辑' },
      { action: 'toggle-status', type: 'edit', label: '切换状态' },
      { action: 'preview', type: 'preview', label: '预览' },
      { action: 'delete', type: 'delete', label: '删除', role: 'admin' }
    ], 'cases');
  }

  function renderNewsPanel() {
    var items = DataLayer.getItems('news');
    items.sort(function (a, b) { return a.order - b.order; });
    renderTable('news-table', items, [
      { key: 'order', label: '#' },
      { key: 'title', label: '标题' },
      { key: 'date', label: '日期' },
      { key: 'status', label: '状态' }
    ], [
      { action: 'edit', type: 'edit', label: '编辑' },
      { action: 'toggle-status', type: 'edit', label: '切换状态' },
      { action: 'delete', type: 'delete', label: '删除', role: 'admin' }
    ], 'news');
  }

  function renderContactPanel() {
    var contact = DataLayer.getData('contact');
    var panel = document.getElementById('contact-editor');
    if (!panel) return;

    panel.innerHTML = '\n      <div class="form-group"><label>公司地址</label><input type="text" id="ct-address" value="' + escapeHtml(contact.address) + '"></div>\n      <div class="form-group"><label>电话</label><input type="text" id="ct-phone" value="' + escapeHtml(contact.phone) + '"></div>\n      <div class="form-group"><label>邮箱</label><input type="text" id="ct-email" value="' + escapeHtml(contact.email) + '"></div>\n      <div class="form-group"><label>微信</label><input type="text" id="ct-wechat" value="' + escapeHtml(contact.wechat) + '"></div>\n      <button class="btn-primary" id="btn-save-contact">保存联系方式</button>\n    ';

    document.getElementById('btn-save-contact').addEventListener('click', function () {
      if (!DataLayer.setData('contact', {
        address: document.getElementById('ct-address').value,
        phone: document.getElementById('ct-phone').value,
        email: document.getElementById('ct-email').value,
        wechat: document.getElementById('ct-wechat').value,
        mapEmbed: contact.mapEmbed
      })) {
        showSaveError();
        return;
      }
      showToast('联系方式已更新', 'success');
    });
  }

  function renderNavPanel() {
    var items = DataLayer.getItems('navigation');
    items.sort(function (a, b) { return a.order - b.order; });
    renderTable('nav-table', items, [
      { key: 'order', label: '#' },
      { key: 'label', label: '菜单名称' },
      { key: 'href', label: '链接' },
      { key: 'visible', label: '可见性' }
    ], [
      { action: 'edit', type: 'edit', label: '编辑' },
      { action: 'toggle-visible', type: 'edit', label: '切换可见' }
    ], 'navigation');

    // 导航编辑用简化字段
    var origOpenEditModal = openEditModal;
    openEditModal = function (dataKey, item) {
      if (dataKey === 'navigation') {
        var fields = [
          { key: 'label', label: '菜单名称' },
          { key: 'href', label: '链接地址' },
          { key: 'order', label: '排序', type: 'number' }
        ];
        var isNew = !item;
        openModal(isNew ? '编辑导航' : '编辑导航', fields, item || {}, function (values) {
          if (isNew) {
            values.id = 'nav-' + Date.now();
            values.visible = true;
            if (!DataLayer.addItem(dataKey, values)) {
              showSaveError();
              return false;
            }
          } else {
            if (!DataLayer.updateItem(dataKey, item.id, values)) {
              showSaveError();
              return false;
            }
          }
          showToast('导航已更新', 'success');
          refreshCurrentPanel();
          return true;
        });
      } else {
        origOpenEditModal(dataKey, item);
      }
    };
  }

  function renderUsersPanel() {
    if (currentUser.role !== 'admin') return;
    var items = DataLayer.getItems('users');
    renderTable('users-table', items, [
      { key: 'username', label: '用户名' },
      { key: 'role', label: '角色' }
    ], [
      { action: 'edit', type: 'edit', label: '编辑' },
      { action: 'delete', type: 'delete', label: '删除' }
    ], 'users');

    // 用户编辑
    var orig = openEditModal;
    openEditModal = function (dataKey, item) {
      if (dataKey === 'users') {
        var fields = [
          { key: 'username', label: '用户名' },
          { key: 'password', label: '密码' },
          { key: 'role', label: '角色', type: 'select', options: [{ value: 'admin', label: '管理员' }, { value: 'editor', label: '编辑者' }] }
        ];
        var isNew = !item;
        openModal(isNew ? '新增用户' : '编辑用户', fields, item || {}, function (values) {
          if (isNew) {
            if (!DataLayer.addItem(dataKey, values)) {
              showSaveError();
              return false;
            }
            showToast('用户创建成功', 'success');
          } else {
            if (!DataLayer.updateItem(dataKey, item.id, values)) {
              showSaveError();
              return false;
            }
            showToast('用户已更新', 'success');
          }
          refreshCurrentPanel();
          return true;
        });
      } else {
        orig(dataKey, item);
      }
    };
  }

  function renderAboutPanel() {
    var about = DataLayer.getData('about');
    var panel = document.getElementById('about-editor');
    if (!panel) return;

    panel.innerHTML = '\n      <div class="form-group">\n        <label>公司介绍 (HTML)</label>\n        <textarea id="ab-intro" rows="12" style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:var(--text-primary);padding:12px;font-size:0.9rem;">' + escapeHtml(about.companyIntro) + '</textarea>\n      </div>\n      <button class="btn-primary" id="btn-save-about" style="margin-top:20px;">保存关于我们</button>\n    ';

    document.getElementById('btn-save-about').addEventListener('click', function () {
      var updated = DataLayer.getData('about');
      updated.companyIntro = document.getElementById('ab-intro').value;
      if (!DataLayer.setData('about', updated)) {
        showSaveError();
        return;
      }
      showToast('关于我们已更新', 'success');
    });
  }

  // ---- 新增按钮 ----
  function initAddButtons() {
    var addBtns = document.querySelectorAll('[data-add]');
    addBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = this.getAttribute('data-add');
        openEditModal(key, null);
      });
    });
  }

  // ---- 初始化 ----
  if (document.getElementById('admin-panels')) {
    initAdmin();
    initAddButtons();
    initDataPublishTools();
  }

  // 键盘 ESC 关闭弹窗
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

})();
