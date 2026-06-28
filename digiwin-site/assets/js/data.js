/**
 * 云孪信息科技 - 统一数据层
 * 前后台共享，数据持久化到 localStorage
 */
const DataLayer = (function () {
  'use strict';

  const STORAGE_KEY = 'digiwin_site_data';
  const VERSION_KEY = 'digiwin_site_version';
  const DATA_VERSION = 5;

  const builtinDefaultData = {
    siteConfig: {
      name: '云孪信息科技',
      subtitle: 'Digital Twin Solutions',
      logo: 'DW',
      footer: {
        copyright: '© 2026 临沂云孪信息科技有限公司 版权所有',
        icp: '京ICP备2026XXXXXX号',
        links: [
          { label: '隐私政策', href: '#' },
          { label: '服务条款', href: '#' },
          { label: '网站地图', href: '#' }
        ]
      }
    },

    navigation: [
      { id: 'nav-home',      label: '首页',        href: 'index.html',      order: 1, visible: true },
      { id: 'nav-cases',     label: '案例',        href: 'cases.html',      order: 2, visible: true },
      { id: 'nav-solutions', label: '解决方案',    href: 'solutions.html',  order: 3, visible: true },
      { id: 'nav-about',     label: '关于我们',    href: 'about.html',      order: 4, visible: true },
      { id: 'nav-contact',   label: '联系我们',    href: 'contact.html',    order: 5, visible: true },
      { id: 'nav-admin',     label: '后台管理',    href: 'admin/login.html', order: 6, visible: false }
    ],

    heroSlides: [
      {
        id: 'hero-1',
        title: '数字孪生 驱动产业未来',
        subtitle: '以高精度三维可视化与实时数据融合，为城市、工厂、农业和国防提供全域数字底座',
        description: '融合 BIM + GIS + IoT，构建从宏观到微观的全要素数字镜像，赋能智慧决策与降本增效。',
        bgImage: '',
        ctaText: '探索解决方案',
        ctaLink: 'solutions.html',
        order: 1,
        status: 'published'
      },
      {
        id: 'hero-2',
        title: '智慧城市 全局可视',
        subtitle: '城市运行体征一屏统览，数据驱动精细化治理',
        description: '覆盖交通、安防、应急、环保等城市核心场景，实现跨部门协同指挥与态势感知。',
        bgImage: '',
        ctaText: '查看案例',
        ctaLink: 'cases.html',
        order: 2,
        status: 'published'
      },
      {
        id: 'hero-3',
        title: '工业孪生 降本增效',
        subtitle: '生产线全生命周期数字化映射，实时监控与预测性维护',
        description: '从工厂规划到生产运营全流程数字孪生，打通设备数据孤岛，提升 OEE 指标 15% 以上。',
        bgImage: '',
        ctaText: '了解详情',
        ctaLink: 'solutions.html',
        order: 3,
        status: 'published'
      }
    ],

    solutions: [
      {
        id: 'sol-smart-city',
        title: '智慧城市数字孪生',
        icon: 'city',
        summary: '构建城市级三维数字底座，融合交通、安防、应急、环保等多源数据，实现城市运行态势实时感知与智能决策。',
        coverImage: '',
        order: 1,
        status: 'published',
        detailContent: `<h2>智慧城市数字孪生解决方案</h2>
<p>随着城市化进程的加速，城市治理面临着交通拥堵、环境污染、公共安全、应急响应等多重挑战。云孪信息科技的智慧城市数字孪生解决方案，以高精度三维地理信息模型为基础，融合 BIM（建筑信息模型）、GIS（地理信息系统）、IoT（物联网）和 AI 技术，构建城市级全要素数字化镜像，为城市管理者提供从宏观到微观的全方位态势感知和决策支持。</p>

<h3>核心能力</h3>
<ul>
  <li><strong>城市三维可视化底座：</strong>基于倾斜摄影与激光点云技术，构建 L1-L4 级城市三维模型，覆盖建筑、道路、桥梁、地下管网等全要素，精度可达厘米级。</li>
  <li><strong>实时数据融合引擎：</strong>接入交通摄像头、环境传感器、应急指挥系统、公共设施监控等超过 50 类数据源，实现秒级数据更新与可视化呈现。</li>
  <li><strong>智能分析决策平台：</strong>集成交通流量预测、空气质量推演、人群热力分析、应急疏散路径规划等 AI 算法模型，支撑科学决策。</li>
  <li><strong>跨部门协同指挥：</strong>打通交通委、公安局、住建局、生态环境局等多部门数据壁垒，实现应急事件的统一调度和联动处置。</li>
</ul>

<h3>典型应用场景</h3>
<p><strong>城市交通优化：</strong>实时监测全市路网运行状态，通过数字孪生模拟信号灯配时优化方案，平均降低主干道拥堵率 18%。</p>
<p><strong>防汛应急指挥：</strong>结合气象预报和排水管网模型，提前模拟内涝风险区域，自动生成最优人员疏散路线和应急资源调度方案。</p>
<p><strong>城市规划仿真：</strong>新建项目在数字孪生场景中进行日照、风环境、噪音、交通影响等多维度模拟评估，辅助规划审批决策。</p>

<h3>实施路径</h3>
<p>我们采用「数据采集→模型构建→平台部署→持续运营」四阶段实施方法论，根据城市规模和需求灵活配置。中小城市可在 6 个月内完成基础平台上线，大型城市采用分期建设策略，确保稳步推进。目前已成功服务于华东某省会城市、华南某特大型城市等多个标杆项目，累计覆盖城区面积超过 3000 平方公里。</p>`
      },
      {
        id: 'sol-factory',
        title: '智慧工厂数字孪生',
        icon: 'factory',
        summary: '面向制造业的生产线全生命周期数字孪生，实现设备实时监控、生产流程优化与预测性维护。',
        coverImage: '',
        order: 2,
        status: 'published',
        detailContent: `<h2>智慧工厂数字孪生解决方案</h2>
<p>在工业 4.0 和智能制造的大背景下，传统制造企业急需通过数字化手段提升生产效率、降低运维成本、保障产品质量。云孪信息科技的智慧工厂数字孪生解决方案，以高保真三维工厂模型为核心，深度融合 MES（制造执行系统）、ERP（企业资源计划）、SCADA（数据采集与监视控制）等业务系统，构建覆盖人、机、料、法、环全要素的数字孪生工厂。</p>

<h3>核心能力</h3>
<ul>
  <li><strong>生产线三维可视化：</strong>基于设备 BIM 模型和点云扫描数据，1:1 还原车间产线布局，支持从厂房级到零件级的自由钻取查看，所见即所得。</li>
  <li><strong>设备实时监控与告警：</strong>接入 PLC、传感器等设备数据，实时展示设备运行状态、工艺参数、产能数据，异常情况秒级告警推送。</li>
  <li><strong>预测性维护：</strong>利用机器学习算法分析设备振动、温度、电流等历史运行数据，建立设备健康度模型，提前 7-15 天预警潜在故障，减少非计划停机 60% 以上。</li>
  <li><strong>生产调度优化：</strong>基于数字孪生的模拟仿真能力，对排产方案进行虚拟运行验证，优化产线平衡率和设备利用率。</li>
</ul>

<h3>技术架构</h3>
<p>方案采用「边缘采集 + 云端处理 + 终端呈现」三层架构。边缘端部署 IoT 网关，支持 OPC UA、Modbus、MQTT 等主流工业协议，实现毫秒级数据采集与清洗；云端基于微服务架构构建数据处理与分析引擎，支持百万级点位并发接入；终端支持大屏、PC、平板、AR眼镜等多种呈现方式，满足不同岗位需求。</p>

<h3>应用成效</h3>
<p>在某汽车零部件龙头企业项目中，我们完成了超过 200 台设备的数字孪生建模，覆盖冲压、焊接、涂装、总装四大车间。系统上线后，设备综合效率（OEE）提升了 12.4%，质量不良率降低了 8.7%，维修响应时间缩短了 45%。该案例已成为工信部智能制造示范项目，并在同行业推广复制。</p>`
      },
      {
        id: 'sol-agriculture',
        title: '智慧农业数字孪生',
        icon: 'agriculture',
        summary: '基于卫星遥感+无人机+地面传感器的立体监测体系，构建农田数字孪生，实现精准种植与智能农事管理。',
        coverImage: '',
        order: 3,
        status: 'published',
        detailContent: `<h2>智慧农业数字孪生解决方案</h2>
<p>云孪信息科技面向现代农业园区和大田种植场景，推出智慧农业数字孪生解决方案。方案综合运用卫星遥感、无人机多光谱数据采集、地面物联网传感器网络和气象数据，构建高精度的农田数字孪生体，实现从播种到收获全过程的数字化管理和智能决策辅助。</p>

<h3>核心能力</h3>
<ul>
  <li><strong>农田三维建模：</strong>利用无人机倾斜摄影和激光雷达技术，构建厘米级精度的农田三维模型，直观展示地块边界、坡度、水系等地理信息。</li>
  <li><strong>作物生长监测：</strong>通过多光谱无人机定期巡检和卫星遥感影像分析，实时监测作物长势、NDVI 植被指数、叶面积指数等关键指标，精准识别缺肥、病虫害区域。</li>
  <li><strong>精准水肥管理：</strong>结合土壤传感器实时数据和气象预报，智能生成灌溉和施肥方案，实现变量施肥、分区灌溉，节肥节水 30% 以上。</li>
  <li><strong>灾害预警与评估：</strong>接入气象数据链，对冰雹、霜冻、干旱等极端天气进行提前预警；灾害发生后利用遥感影像快速评估受灾面积和损失程度。</li>
</ul>

<h3>智能农机调度</h3>
<p>系统与自动驾驶拖拉机、植保无人机、智能灌溉设备等智能农机对接，根据数字孪生模型自动规划最优作业路径。农机手可通过平板电脑实时查看作业进度和农田状态，管理者在大屏端全局掌控所有设备的运行状态。目前已在华北某 10 万亩现代农业示范区成功落地，通过精准化管理和智能调度，亩均增产 8%，综合成本降低 15%。</p>`
      },
      {
        id: 'sol-military',
        title: '军事仿真数字孪生',
        icon: 'military',
        summary: '面向军事训练的战场环境数字孪生，支持多兵种协同推演、武器装备数字样机与作战方案仿真评估。',
        coverImage: '',
        order: 4,
        status: 'published',
        detailContent: `<h2>军事仿真数字孪生解决方案</h2>
<p>云孪信息科技基于自主可控的三维引擎技术，面向国防领域提供军事仿真数字孪生解决方案。方案覆盖战场环境构建、装备数字样机、作战推演仿真、训练评估分析等全链路需求，支持陆军、海军、空军、火箭军等多兵种协同训练场景。</p>

<h3>核心能力</h3>
<ul>
  <li><strong>战场环境孪生构建：</strong>基于高精度地形数据、气象模型和电磁环境参数，快速生成可交互的三维战场数字孪生场景。支持从全球尺度到局部战术级的多层级可视化，涵盖地形、建筑、植被、水系、道路等全要素。</li>
  <li><strong>装备数字样机：</strong>对主战装备进行高保真三维建模与物理仿真，支持装备结构展示、性能参数查询、损伤效果模拟、维修流程推演等应用。</li>
  <li><strong>多兵种协同推演：</strong>基于 HLA（高层体系架构）标准，支持不同仿真系统的互联互通。红蓝双方可在同一数字孪生战场中进行对抗推演，系统实时计算兵力损耗、弹药消耗、战场态势变化。</li>
  <li><strong>方案评估与复盘：</strong>作战方案推演完成后，自动生成多维评估报告，包括任务完成度、兵力损耗比、关键节点影响等量化指标。支持全过程回放和关键事件标注分析。</li>
</ul>

<h3>技术特点</h3>
<p>方案采用国产自主可控三维引擎，支持麒麟操作系统和国产 CPU/GPU 适配，符合信创安全要求。数据采用分布式存储和加密传输，确保军事信息安全。系统已在某战区训练基地部署运行，累计支撑大型联合演练 20 余次，获得一线指战员的高度评价。</p>`
      },
      {
        id: 'sol-visual',
        title: '可视化大屏数字孪生',
        icon: 'visual',
        summary: '为指挥中心、展会、展厅等场景量身定制沉浸式可视化大屏，实现多源数据融合呈现与交互分析。',
        coverImage: '',
        order: 5,
        status: 'published',
        detailContent: `<h2>可视化大屏数字孪生解决方案</h2>
<p>云孪信息科技的可视化大屏解决方案，专为指挥调度中心、企业展厅、行业展会和监控中心等场景设计。方案通过高性能三维渲染引擎和大屏适配技术，将复杂的数据模型转化为直观、震撼的视觉呈现，帮助用户快速洞察数据价值，提升决策效率和展示效果。</p>

<h3>核心能力</h3>
<ul>
  <li><strong>超高分辨率适配：</strong>支持 4K/8K 超高清分辨率输出，兼容 LED、LCD、DLP 拼接屏等主流大屏硬件，支持单屏、双屏、多屏拼接显示模式，分辨率最高可达 16K×4K。</li>
  <li><strong>多源数据接入：</strong>支持 REST API、WebSocket、MQTT、数据库直连等超过 20 种数据接入方式，可同时对接 ERP、MES、GIS、视频监控等系统，实现真正的「一屏统览」。</li>
  <li><strong>三维场景编辑器：</strong>提供低代码三维场景编辑工具，用户可通过拖拽方式快速搭建业务场景，支持模型导入、材质编辑、灯光调节、动效配置，无需编写代码即可完成场景搭建。</li>
  <li><strong>交互式数据分析：</strong>支持触控、体感、语音等多种交互方式，用户可在大屏上自由旋转、缩放三维场景，点击钻取数据详情，实现沉浸式数据探索。</li>
</ul>

<h3>行业解决方案</h3>
<p><strong>企业展厅大屏：</strong>为企业总部展厅、行业展会提供震撼的品牌展示和产品三维演示，结合粒子动效、流光特效等视觉元素，打造科技感十足的沉浸体验。已服务于多家世界 500 强企业总部展厅。</p>
<p><strong>指挥中心大屏：</strong>为智慧城市、应急管理、安全生产等指挥中心提供高可靠性可视化大屏。支持 7×24 小时不间断运行，具备双机热备和自动故障切换能力，确保关键业务零中断。</p>
<p><strong>监控中心大屏：</strong>整合视频监控、门禁、消防、环境监测等子系统，在一张三维图上综合呈现，异常事件自动定位并联动周边摄像头画面，大幅提升安全管理的响应效率。</p>`
      }
    ],

    cases: [
      {
        id: 'case-1',
        title: '某省会城市智慧交通数字孪生平台',
        category: '智慧城市',
        coverImage: '',
        summary: '构建覆盖城区 800 平方公里的交通数字孪生系统，实时接入 3000+ 路摄像头和 500+ 路口信号机数据，实现全路网态势感知与智能信号优化。',
        clientName: '某省会城市交通运输局',
        techStack: 'Cesium + Three.js + WebSocket + Kafka + Spark Streaming',
        results: '主干道拥堵率下降 18%，平均通行时间缩短 12%，交通事件响应速度提升 40%',
        order: 1,
        status: 'published',
        detailContent: `<h2>某省会城市智慧交通数字孪生平台</h2>
<h3>项目背景</h3>
<p>该省会城市常住人口超过 800 万，机动车保有量突破 300 万辆，早晚高峰交通拥堵严重。传统信号控制系统缺乏实时数据支撑，交通事件响应依赖人工巡检，效率低下。市政府提出"智慧交通"三年行动计划，投入 1.2 亿元建设城市交通大脑，云孪信息科技作为核心技术供应商，承担了交通数字孪生平台的建设任务。</p>

<h3>技术方案</h3>
<p>项目基于 Cesium 三维地球引擎构建城市交通数字孪生底座，覆盖城区 800 平方公里范围。系统接入全市 3000 余路交通监控摄像头、500 余个路口信号控制机、2000 余个地磁线圈检测器、以及公交 GPS、出租车浮动车等多元数据源。采用 Kafka 消息队列实现每秒 50 万条数据的高并发实时处理，通过 Spark Streaming 流式计算引擎进行实时数据清洗、融合和分析。</p>
<p>系统核心功能包括：全路网实时态势展示（路况指数、拥堵排名、流量统计）、AI 驱动的信号灯自适应优化（基于强化学习算法动态调整绿信比和相位差）、交通事故智能检测（利用计算机视觉自动识别异常停车、行人闯入等事件）、应急车辆绿波通行（自动规划最优路线并联动信号机放行）。</p>

<h3>项目成果</h3>
<ul>
  <li>主干道高峰期平均拥堵指数从 2.8 降至 2.3，拥堵时长每天减少 35 分钟</li>
  <li>AI 信号优化覆盖的 120 个路口，平均通行效率提升 18%</li>
  <li>交通事故自动检测准确率达 92%，事件响应时间从平均 8 分钟缩短至 3 分钟</li>
  <li>系统日均处理数据量超过 5TB，支撑 100+ 并发用户的实时操作</li>
</ul>
<p>该项目被评为全国智慧交通优秀案例，并在全国交通运输工作会议上进行推广介绍。</p>`
      },
      {
        id: 'case-2',
        title: '某大型汽车零部件工厂数字孪生',
        category: '智慧工厂',
        coverImage: '',
        summary: '实现 4 大车间 200+ 台设备的三维数字化建模与实时监控，通过预测性维护和排产优化，OEE 提升 12.4%。',
        clientName: '某汽车零部件集团（上市公司）',
        techStack: 'Unity3D + OPC UA + MQTT + MySQL + Redis + Flink',
        results: 'OEE 提升 12.4%，质量不良率降低 8.7%，非计划停机减少 60%，年节省运维成本 800 万元',
        order: 2,
        status: 'published',
        detailContent: `<h2>某大型汽车零部件工厂数字孪生</h2>
<h3>项目背景</h3>
<p>该客户是国内领先的汽车零部件制造商，主要生产底盘系统、传动系统和精密铸件，年产值超过 50 亿元。随着产能扩张，工厂面临着设备老化、排产效率低、质量波动大等挑战。管理层希望通过数字孪生技术实现工厂的精细化管理和智能化运维。</p>

<h3>技术方案</h3>
<p>项目覆盖冲压、焊接、涂装、总装四大生产车间，对 200 余台关键设备进行高精度三维建模。采用 Unity3D 作为前端渲染引擎，实现高度逼真的生产线三维可视化——操作人员可以在三维场景中自由导航，点击任意设备查看实时运行参数和工艺指标。</p>
<p>数据采集层部署了 50 余台边缘 IoT 网关，支持 OPC UA、Modbus TCP、Profinet 等多种工业协议，实现毫秒级数据采集。数据通过 MQTT 协议上传至云端 Flink 流处理平台，进行实时数据清洗、聚合和异常检测。基于历史运行数据训练的设备健康度模型，能够提前 7-15 天预测设备潜在故障，并通过微信、短信、声光报警等方式推送给维修班组。</p>

<h3>项目成果</h3>
<ul>
  <li>设备综合效率（OEE）从 72.3% 提升至 81.3%，提升幅度 12.4%，年新增产值约 4000 万元</li>
  <li>预测性维护模型覆盖 50 台关键设备，累计预警潜在故障 87 次，避免非计划停机损失超 2000 万元</li>
  <li>质量不良率从 1.15% 降至 1.05%，每年减少废品损失约 500 万元</li>
  <li>综合运维成本降低 800 万元/年，ROI 在 14 个月内收回</li>
</ul>
<p>该项目荣获工信部智能制造示范项目称号，并在集团内部全面推广。</p>`
      },
      {
        id: 'case-3',
        title: '10 万亩现代农业示范区数字孪生',
        category: '智慧农业',
        coverImage: '',
        summary: '覆盖 10 万亩农田，融合卫星遥感+无人机+地面传感器，实现精准种植和智能农事管理，亩均增产 8%。',
        clientName: '某省级现代农业示范区管委会',
        techStack: 'UE5 + Python + TensorFlow + PostgreSQL + GeoServer',
        results: '亩均增产 8%，节水 35%，节肥 28%，综合成本降低 15%，年增收 3000 万元',
        order: 3,
        status: 'published',
        detailContent: `<h2>10 万亩现代农业示范区数字孪生</h2>
<h3>项目背景</h3>
<p>该示范区是国家级现代农业产业园，总面积 10 万亩，主要种植小麦、玉米、大豆等粮食作物以及设施蔬菜。传统的粗放式管理导致水肥浪费严重，病虫害防治滞后，农产品品质参差不齐。示范区管委会希望通过数字化手段实现精准农业管理，提高产量和品质。</p>

<h3>技术方案</h3>
<p>项目采用「星-空-地」立体化监测体系：卫星遥感（Sentinel-2、高分系列卫星）提供每周一次的大范围 NDVI 植被指数监测；无人机搭载多光谱相机进行每日精细化巡检，分辨率可达 5cm/像素；地面部署了 2000 余个土壤传感器（温度、湿度、pH 值、氮磷钾含量）和 50 个小型气象站，实时采集田间环境数据。</p>
<p>基于 UE5 引擎构建的农田数字孪生平台，将上述多源数据在三维场景中统一呈现。系统搭载 TensorFlow 作物生长模型，结合土壤数据、气象预报和历史产量数据，生成精准的水肥处方图，指导变量施肥机和智能灌溉系统进行分区作业。病虫害预警模块利用计算机视觉识别无人机影像中的异常区域，精准定位并评估危害程度。</p>

<h3>项目成果</h3>
<ul>
  <li>核心示范区小麦亩产从 450kg 提升至 486kg，亩均增产 8%</li>
  <li>变量施肥和智能灌溉系统覆盖 5 万亩，节水 35%、节肥 28%，总成本降低 15%</li>
  <li>病虫害预警系统累计识别病虫害风险区域 320 处，做到"早发现、早防治"，农药使用量减少 20%</li>
  <li>10 万亩示范区综合增收约 3000 万元/年</li>
</ul>
<p>该项目被农业农村部评为"数字农业优秀案例"，成为全国智慧农业示范基地。</p>`
      },
      {
        id: 'case-4',
        title: '某战区多兵种协同推演仿真平台',
        category: '军事仿真',
        coverImage: '',
        summary: '为某战区训练基地建设多兵种协同作战推演仿真系统，支持红蓝对抗、方案评估和全过程复盘分析。',
        clientName: '某战区训练基地',
        techStack: '自主研发三维引擎 + HLA/RTI + GIS + 国产操作系统适配',
        results: '支撑大型联合演练 20+ 次，推演准确率 95%，方案评估时间缩短 70%',
        order: 4,
        status: 'published',
        detailContent: `<h2>某战区多兵种协同推演仿真平台</h2>
<h3>项目背景</h3>
<p>随着现代战争形态的演变，多兵种联合作战已成为基本作战样式。传统沙盘推演难以真实反映复杂战场环境和装备性能，实兵演练成本高昂且组织困难。某战区训练基地提出建设数字化推演仿真平台的需求，要求能够真实模拟战场环境、装备性能和作战过程，支撑指挥员决策训练和作战方案评估。</p>

<h3>技术方案</h3>
<p>项目基于团队自主研发的三维引擎，构建了覆盖 500km×500km 的战场环境数字孪生体。系统集成了高精度地形高程数据（ASTER GDEM 30m分辨率）、地表覆盖和建筑数据，支持动态天气（雨、雪、雾、沙尘暴）、昼夜变化和电磁环境模拟。所有模型和算法均在国产操作系统上运行，适配国产 CPU 和 GPU，满足安全可控要求。</p>
<p>系统采用 HLA（高层体系架构）标准，通过 RTI（运行支撑环境）实现不同仿真联邦的互联互通。支持同时接入 50+ 个仿真节点，包括坦克、步战车、火炮、直升机、无人机等多种装备的数字样机。红蓝双方可在数字孪生战场中进行自由对抗，系统基于兰彻斯特方程和蒙特卡洛方法实时计算战损和态势变化。</p>

<h3>项目成果</h3>
<ul>
  <li>累计支撑大型联合演练 20 余次，参演指挥员 500+ 人次</li>
  <li>推演结果与实际演练结果对比，准确率达 95% 以上</li>
  <li>作战方案评估效率大幅提升，从传统人工评估的 2-3 天缩短至 4-6 小时</li>
  <li>系统获军队科技进步奖二等奖</li>
</ul>`
      },
      {
        id: 'case-5',
        title: '某世界500强企业总部展厅大屏',
        category: '可视化大屏',
        coverImage: '',
        summary: '为企业总部展厅打造沉浸式 16K 可视化大屏，整合全球业务数据、实时监控和品牌展示，获得来访领导高度评价。',
        clientName: '某世界500强能源集团',
        techStack: 'Three.js + WebGL + ECharts + WebSocket + Node.js + Nginx',
        results: '展厅月均接待参观 200+ 批次，系统连续稳定运行 2 年无故障，成为集团数字化转型窗口',
        order: 5,
        status: 'published',
        detailContent: `<h2>某世界500强企业总部展厅大屏</h2>
<h3>项目背景</h3>
<p>该能源集团是全球最大的石油化工企业之一，业务遍布 60 多个国家和地区。集团新建总部大楼设有 500 平米的数字化展厅，需要一套震撼的可视化大屏系统，向国内外来访领导和客户展示集团的全球业务版图、核心技术实力和数字化转型成果。</p>

<h3>技术方案</h3>
<p>项目采用 48 块 4K LED 拼接屏组成弧形巨幕，总分辨率达到 16K×4K。前端渲染基于 Three.js 和 WebGL 技术，构建了全球业务三维可视化场景，包括全球炼化基地分布、油气管道网络、海上平台实时监控等模块。系统接入集团 ERP、SCADA 和视频监控等 15 个业务系统数据，通过 WebSocket 实现秒级实时更新。</p>
<p>为保障展示效果，团队还开发了多种视觉特效：基于粒子系统的能源流动特效、基于 GLSL 着色器的光影渲染、以及基于语音识别的交互式场景切换。展厅中控系统可一键切换 8 个预设主题场景（全球布局、清洁能源、科技创新、安全生产、社会责任等），满足不同参观需求。</p>

<h3>项目成果</h3>
<ul>
  <li>展厅月均接待政府领导、合作伙伴、媒体等参观 200+ 批次</li>
  <li>系统连续稳定运行超过 2 年，累计无故障时间超过 99.99%</li>
  <li>多次作为集团对外宣传的"第一展示窗口"，获得来访领导和客户的高度评价</li>
  <li>项目成果被集团内刊和行业媒体报道，成为能源行业数字化转型的标杆案例</li>
</ul>`
      },
      {
        id: 'case-6',
        title: '某智能制造产线孪生监控系统',
        category: '智慧工厂',
        coverImage: '',
        summary: '为某精密制造企业构建产线级数字孪生监控系统，覆盖 80 台 CNC 设备，实现加工过程实时可视化和质量追溯。',
        clientName: '某精密制造股份有限公司',
        techStack: 'Three.js + OPC UA + InfluxDB + Grafana + Docker + Kubernetes',
        results: '设备利用率提升 15%，质量追溯效率提升 80%，每月减少不良品损失 120 万元',
        order: 6,
        status: 'published',
        detailContent: `<h2>某智能制造产线孪生监控系统</h2>
<h3>项目背景</h3>
<p>该客户是航空航天精密零部件制造商，拥有 80 余台高精度 CNC 加工中心。由于产品精度要求极高（微米级），任何设备异常都可能导致批量报废。过去依赖人工巡检和纸质记录，无法实时掌握设备状态，质量问题追溯困难。客户希望通过数字孪生技术实现产线的全透明管理。</p>

<h3>技术方案</h3>
<p>项目使用三维激光扫描仪对车间进行高精度建模，构建了 1:1 的产线数字孪生体。80 台 CNC 设备通过 OPC UA 协议实现全量数据采集，包括主轴转速、进给速度、刀具状态、加工参数、振动数据等 200+ 个数据点位。数据存储采用 InfluxDB 时序数据库，支持每秒 10 万点的高频写入。</p>
<p>前端基于 Three.js 构建三维可视化场景，支持从车间全景到单台设备内部结构的自由钻取。点击任意 CNC 设备可查看实时加工参数、刀具寿命预估、当前加工工件信息等。质量追溯模块记录每个工件的完整加工过程数据，当出现质量问题时，可在 5 分钟内追溯到问题发生的精确时间和设备状态，相比之前的人工排查（平均 40 分钟）效率提升 80%。</p>

<h3>项目成果</h3>
<ul>
  <li>设备综合利用率从 65% 提升至 75%，新增有效加工时间约 1200 小时/月</li>
  <li>质量追溯效率提升 80%，月度不良品损失减少 120 万元</li>
  <li>刀具寿命管理优化后，刀具消耗降低 15%，年节省刀具费用 80 万元</li>
  <li>系统部署在 Kubernetes 集群上，支持弹性伸缩和高可用</li>
</ul>`
      }
    ],

    about: {
      companyIntro: `<h2>让数字世界与物理世界深度融合</h2>
<p>临沂云孪信息科技有限公司成立于 2018 年，是一家专注于数字孪生技术研发与产业化应用的高新技术企业。公司核心团队来自清华大学、北京航空航天大学、中科院等知名高校和科研机构，在三维可视化、地理信息系统、工业物联网、人工智能等领域拥有平均 10 年以上的技术积累。</p>
<p>公司以"数字孪生驱动产业未来"为使命，致力于为企业、政府和国防客户提供从数据采集、模型构建、平台部署到持续运营的全栈式数字孪生解决方案。自主研发的三维引擎和数字孪生平台，已在智慧城市、智能制造、智慧农业、军事仿真和可视化大屏等多个领域实现规模化应用，累计服务客户超过 100 家。</p>
<p>云孪信息科技是国家高新技术企业、山东省"专精特新"中小企业，拥有 30 余项软件著作权和 5 项发明专利。公司总部位于山东临沂，在深圳、成都、武汉设有研发中心和分支机构，团队规模超过 150 人。</p>
<p>我们始终坚持技术自主可控的发展道路，核心三维引擎已完成国产操作系统和国产芯片适配，满足关键领域的信创安全要求。未来，我们将持续加大研发投入，深化数字孪生与人工智能、边缘计算、5G 等技术的融合创新，为客户创造更大的数字化价值。</p>`,
      milestones: [
        { year: '2018', title: '公司成立', desc: '在山东临沂正式注册成立，核心团队组建完成，获得天使轮融资 500 万元' },
        { year: '2019', title: '首款产品发布', desc: '发布自研三维数字孪生引擎 v1.0，签约首个智慧城市项目，团队扩充至 30 人' },
        { year: '2020', title: '行业深耕', desc: '获得国家高新技术企业认定，完成 A 轮融资 3000 万元，业务拓展至智慧工厂和军事仿真领域' },
        { year: '2021', title: '快速扩张', desc: '深圳、成都研发中心成立，团队突破 100 人，全年营收突破 8000 万元，获评山东省"专精特新"企业' },
        { year: '2022', title: '标杆突破', desc: '智慧交通项目获评全国优秀案例，与 3 家世界 500 强企业达成合作，全年营收突破 1.5 亿元' },
        { year: '2023', title: '信创认证', desc: '完成国产操作系统和 CPU 适配，通过信创安全认证，获 B 轮融资 1 亿元，发布数字孪生平台 v3.0' },
        { year: '2024', title: '生态布局', desc: '武汉研发中心成立，与 5 所高校建立联合实验室，团队超过 150 人，累计服务客户 100+ 家' },
        { year: '2025', title: '扬帆远航', desc: '启动海外市场拓展，发布 AI+数字孪生融合平台，积极准备科创板上市' }
      ],
      team: [
        { name: '张维远', role: '创始人 & CEO', avatar: '' },
        { name: '李思源', role: 'CTO', avatar: '' },
        { name: '王卓然', role: '技术副总裁', avatar: '' },
        { name: '陈明慧', role: '产品副总裁', avatar: '' },
        { name: '赵志远', role: '首席架构师', avatar: '' },
        { name: '刘雨桐', role: '设计总监', avatar: '' }
      ],
      certifications: [
        { name: '国家高新技术企业', image: '' },
        { name: '山东省专精特新中小企业', image: '' },
        { name: 'ISO 9001 质量管理体系认证', image: '' },
        { name: 'ISO 27001 信息安全管理体系认证', image: '' },
        { name: 'CMMI 3级认证', image: '' },
        { name: '信创安全认证', image: '' }
      ],
    },

    contact: {
      address: '山东省临沂市兰山区北城新区科技馆 A 座 18 层',
      phone: '010-8888-6666',
      email: 'contact@digiwin-tech.com',
      wechat: 'digiwin_official',
      mapEmbed: ''
    },

    news: [
      {
        id: 'news-1',
        title: '云孪信息科技荣获2025年度数字孪生行业领军企业奖',
        summary: '在刚刚结束的中国数字孪生大会上，云孪信息科技凭借在智慧城市和智能制造领域的创新应用，荣获年度行业领军企业奖。',
        content: `<p>2025年6月，由中国信息通信研究院主办的中国数字孪生大会在山东临沂隆重举行。本次大会以"数字孪生驱动新质生产力"为主题，汇聚了来自政府、学术界、产业界的 2000 余名代表。经过专家评审团的多轮评选，云孪信息科技凭借自主研发的三维数字孪生引擎和在智慧城市、智能制造领域的标杆项目，荣获"2025年度数字孪生行业领军企业奖"。公司CTO李思源在大会上发表了题为《数字孪生赋能产业智能化升级》的主题演讲，分享了公司在多个行业的落地实践经验，获得与会嘉宾的高度关注。</p>`,
        date: '2025-06-15',
        status: 'published',
        order: 1
      },
      {
        id: 'news-2',
        title: '云孪信息科技与清华大学成立数字孪生联合实验室',
        summary: '校企合作再升级，双方将在三维渲染、AI 仿真和数字孪生标准制定方面开展深度合作。',
        content: `<p>2025年4月，云孪信息科技与清华大学软件学院正式签署合作协议，共同成立"数字孪生技术联合实验室"。实验室将围绕高保真三维渲染引擎、AI 驱动的物理仿真、数字孪生数据标准等前沿方向开展联合研究，同时将为清华学生提供实习实践基地。云孪信息科技承诺未来三年内向实验室投入不低于 1000 万元的研发经费和计算资源。清华大学软件学院院长表示，此次合作将充分发挥企业实践优势和高校学术优势，推动数字孪生产学研用一体化发展。</p>`,
        date: '2025-04-20',
        status: 'published',
        order: 2
      },
      {
        id: 'news-3',
        title: '云孪信息科技 B 轮融资 1 亿元，加速 AI 与数字孪生融合',
        summary: '本轮融资由知名投资机构领投，资金将用于 AI+数字孪生产品研发和全国市场拓展。',
        content: `<p>2024年12月，云孪信息科技宣布完成 1 亿元人民币 B 轮融资，本轮由红杉资本中国基金领投，老股东经纬中国和源码资本跟投。公司创始人兼CEO张维远表示，本轮融资资金将主要用于三个方面：一是加大 AI 与数字孪生融合技术的研发投入，推出新一代智能数字孪生平台；二是加速全国市场拓展，计划在华东、华南、西南新增 5 个区域服务中心；三是引进高端技术人才，预计 2025 年底团队规模将突破 200 人。</p>`,
        date: '2024-12-01',
        status: 'published',
        order: 3
      }
    ],

    users: [
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'editor', password: 'editor123', role: 'editor' }
    ]
  };

  const defaultData = (function () {
    if (window.DIGIWIN_SITE_DATA && typeof window.DIGIWIN_SITE_DATA === 'object') {
      return window.DIGIWIN_SITE_DATA;
    }
    return builtinDefaultData;
  })();

  let _data = null;
  let _lastSaveError = null;

  function isValidData(data) {
    if (!data || typeof data !== 'object') return false;
    // 核心数组必须存在且为非空数组
    var keys = ['solutions', 'cases', 'heroSlides', 'navigation', 'users'];
    for (var i = 0; i < keys.length; i++) {
      var arr = data[keys[i]];
      if (!Array.isArray(arr) || arr.length === 0) return false;
    }
    // solutions 和 cases 必须包含 id/title/status
    if (!data.solutions[0].id || !data.solutions[0].title || !data.solutions[0].status) return false;
    if (!data.cases[0].id || !data.cases[0].title || !data.cases[0].status) return false;
    if (!data.users[0].username || !data.users[0].password || !data.users[0].role) return false;
    return true;
  }

  function init() {
    try {
      const storedVer = localStorage.getItem(VERSION_KEY);
      const stored = localStorage.getItem(STORAGE_KEY);
      var parsed = null;
      if (stored && storedVer === String(DATA_VERSION)) {
        parsed = JSON.parse(stored);
      }
      if (parsed && isValidData(parsed)) {
        _data = parsed;
      } else {
        _data = JSON.parse(JSON.stringify(defaultData));
        save();
      }
    } catch (e) {
      _data = JSON.parse(JSON.stringify(defaultData));
      save();
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_data));
      localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
      _lastSaveError = null;
      return true;
    } catch (e) {
      _lastSaveError = e;
      console.error('数据保存失败:', e);
      return false;
    }
  }

  function getData(key) {
    if (!_data) init();
    if (!key) return _data;
    const keys = key.split('.');
    let result = _data;
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return undefined;
      }
    }
    return result;
  }

  function setData(key, value) {
    if (!_data) init();
    if (!key) {
      const oldData = _data;
      _data = value;
      if (!save()) {
        _data = oldData;
        return false;
      }
      return true;
    }
    const keys = key.split('.');
    let target = _data;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in target) || typeof target[keys[i]] !== 'object') {
        target[keys[i]] = {};
      }
      target = target[keys[i]];
    }
    const lastKey = keys[keys.length - 1];
    const oldValue = target[lastKey];
    target[lastKey] = value;
    if (!save()) {
      target[lastKey] = oldValue;
      return false;
    }
    return true;
  }

  // 数组增删改辅助
  function getItems(key) {
    return getData(key) || [];
  }

  function getItemById(key, id) {
    const items = getItems(key);
    return items.find(item => item.id === id);
  }

  function addItem(key, item) {
    const items = getItems(key).slice();
    items.push(item);
    return setData(key, items) ? item : null;
  }

  function updateItem(key, id, updates) {
    const items = getItems(key).slice();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates };
    return setData(key, items) ? items[index] : null;
  }

  function deleteItem(key, id) {
    let items = getItems(key);
    items = items.filter(item => item.id !== id);
    return setData(key, items);
  }

  function resetData() {
    _data = JSON.parse(JSON.stringify(defaultData));
    return save();
  }

  function getLastSaveError() {
    return _lastSaveError;
  }

  // 初始化
  init();

  return {
    getData,
    setData,
    getItems,
    getItemById,
    addItem,
    updateItem,
    deleteItem,
    resetData,
    getLastSaveError
  };
})();

window.DataLayer = DataLayer;

