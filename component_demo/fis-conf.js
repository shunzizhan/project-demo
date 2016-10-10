
//项目配置，将name、version独立配置，统管全局
fis.set('name', 'proj');
fis.set('version', '1.0.1');
// 测试环境
fis.set('domain_test', ''); //开发环境静态资源
// 预发布环境
fis.set('domain_pre', '');
// 线上环境
fis.set('domain_build', '');

// 过滤指定的文件类型
fis.set('project.files', [
  '*.css',
  '*.js',
  '*.html',
  '*.{png,jpg,gif}'
]);

fis
  // 静态资源，包含第三方库文件，通用的js/css/img
  .match(/^\/libs\/(.*)$/i, {
    release: '/public/libs/$1'
  })
  .match(/^\/public\/img\/(.*)$/i, {
    release: '/public/images/$1'
  })
  .match(/^\/public\/less\/(\w+)\.less$/i, {
    parser: fis.plugin('less'),
    rExt: '.css',
    release: '/public/css/$1'
  })
  .match(/^\/public\/js\/(.*)$/i, {
    release: '/public/js/$1'
  })
  // 业务逻辑
  // *********less******************
  .match(/^\/pages\/\w+\/(\w+)\.less$/i, {
    parser: fis.plugin('less'),
    rExt: '.css',
    release: '/${name}_${version}/css/$1'
  })
  // *********js******************
  .match(/^\/pages\/\w+\/(\w+)\.js$/i, {
    release: '/${name}_${version}/js/$1'
  })
  // *********html******************
  .match(/^\/pages\/\w+\/(\w+)\.html$/i, {
    release: '/${name}_${version}/$1'
  })
  // *********图片*********
  .match(/^\/pages\/(\w+)\/img\/(.*)$/i, {
    release: '/${name}_${version}/images/$1/$2'
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
    // .match('*', {
    //   domain: "${domain_build}"
    // })
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