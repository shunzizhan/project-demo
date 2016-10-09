
//项目配置，将name、version独立配置，统管全局
fis.set('name', 'proj');
fis.set('version', '1.0.0');
// 测试环境
fis.set('domain_test', ''); //开发环境静态资源
// 预发布环境
fis.set('domain_pre', 'http://preuc.fdc.com.cn');
// 线上环境
// fis.set('domain_build', 'http://img3.fdc.com.cn/usercenter');
fis.set('domain_build', '');
// 过滤指定的文件类型
fis.set('project.files', [
  '*.css',
  '*.js',
  '*.html'
]);

fis
  .match(/^\/libs\/(.*)$/gi, {
    release: '/${name}_${version}/libs/$1'
  })
  .match(/^\/UI\/(common).less$/gi, {
    parser: fis.plugin('less'),
    rExt: '.css',
    release: '/${name}_${version}/css/$1'
  })
  .match(/^\/pages\/\w+\/(\w+)\.less$/gi, {
    parser: fis.plugin('less'),
    rExt: '.css',
    release: '/${name}_${version}/css/$1'
  })
  .match(/^\/pages\/\w+\/(\w+)\.js$/gi, {
    release: '/${name}_${version}/js/$1'
  })
  .match(/^\/pages\/\w+\/(\w+)\.html$/gi, {
    release: '/${name}_${version}/$1'
  })
  

// 测试开发
fis.media('test')
    .match("*", {
        domain: "${domain_test}",
    });

// 预发布
fis.media('pre')
    .match("*", {
      domain: "${domain_pre}",
      // deploy: [
      //   fis.plugin('skip-packed', {
      //     // 配置项
      //     skipPackedToCssSprite:true
      //   }),
      //   fis.plugin('http-push', {
      //     // receiver: 'http://192.168.1.9:8999/receiver',
      //     // //远端目录
      //     // to: '/root/fis_test/test/'
      //   })
      // ]
    });

// 线上
fis.media('build')
    .match('*', {
      domain: "${domain_build}"
    })
    // .match('*.html', {
    //   deploy: fis.plugin('http-push', {
    //     receiver: 'http://192.168.1.9:8999/receiver',
    //     //远端目录
    //     to: '/root/fis_test/html/'
    //   })
    // })
    // .match('/{js,css,images}/**', {
    //   deploy: [
    //     fis.plugin('skip-packed', {
    //       // 配置项
    //       skipPackedToCssSprite:true
    //     }),
    //     fis.plugin('http-push', {
    //       receiver: 'http://192.168.1.9:8999/receiver',
    //       //远端目录
    //       to: '/root/fis_test/other/'
    //     })
    //   ]
    // })