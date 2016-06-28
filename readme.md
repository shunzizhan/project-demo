# fis技术分享

@(fis)[资源定位|内容嵌入|部署|]

**FIS3 **是面向前端的工程构建工具。解决前端工程中性能优化、资源加载（异步、同步、按需、预加载、依赖管理、合并、内嵌）、模块化开发、自动化工具、开发规范、代码部署等问题。

-------------------

[TOC]

## 实践：由grunt转变为fis

>为了更加方便快速的实现`打包部署`，我们决定尝试使用fis来实现项目的自动化。此外，前端后期计划采用`组件化开发模式`，实现项目前端的`高度解耦`，提供代码的`可复用性`。
>**说明：**我们短时间内保持文件目录与原来一致，以便大家对fis有一个感性的认知。
>
讲解示例[demo](https://github.com/shunzizhan/fis/tree/develop/project-demo/src) https://github.com/shunzizhan/fis/tree/develop/project-demo/src

### 安装fis及fis常用插件
``` cmake
  npm install -g fis3
  npm install -g fis-parser-less
  npm install -g fis3-hook-relative
  npm install -g fis-preprocessor-cssprefixer
```
**说明：**前提是已安装`node`、`npm` 

### 项目目录及简介

![fis0000](https://cloud.githubusercontent.com/assets/7811369/16400822/72a35bb2-3d11-11e6-80b3-ed6d7d878f70.png)![fis0001](https://cloud.githubusercontent.com/assets/7811369/16400823/7b3f3c0a-3d11-11e6-8547-27f91b396f32.png)


>**注意：** 
1. html文件中，引入的样式文件是`less`，其余的与目前保持一致；
2. 在less文件中，需要使用雪碧图的地方，请在图片路劲的背后添加`?__sprite`，例如：background-image: url('../images/ico/list-1.png?__sprite');
3. 开发期间我们只需双击`test.bat`文件，fis就会自动将我们当前项目映射到本地c盘的一个小服务中（通过`fis3 server 系列操作`可以查看文件、启动/停止服务），与此类似，预发布执行`pre.bat`,线上执行`build.bat`


### fis-config一览
``` javascript

// 保持发布使用相对路径
fis.hook('relative'); 

//域
// 测试环境
fis.set('domain_test', ''); //开发环境静态资源
// 预发布环境
fis.set('domain_pre', 'http://preuc.fdc.com.cn'); 
// 线上环境
fis.set('domain_build', 'http://img3.fdc.com.cn'); 
// 定义版本号
fis.set('version', '1.0.0'); 

// // 排除指定目录和文件
// fis.set('project.files', [
//     '.git/**',
//     '.svn/**',
//     'node_modules/**',
//     '*.bat',
//     '*.cmd',
//     '*.log',
//     'fis-conf.js',
//     "package.json",
//     "**/___*.png", //过滤三下划线开头的预览图片
//     '**/*.less'
// ]);
// 过滤指定的文件类型
fis.set('project.files', [
  '*.css',
  '*.js',
  'images/**',
  '*.html'
]);

fis.match("*", {
        // domain: "${domain_pre}",
        relative: true
    })
    .match('::package', {
      spriter: fis.plugin('csssprites', {
        htmlUseSprite: true, //开启模板内联css处理,默认关闭
        styleReg: /(<style(?:(?=\s)[\s\S]*?["'\s\w\/\-]>|>))([\s\S]*?)(<\/style\s*>|$)/ig,
        margin: 5 //图之间的边距
      })
    })
    // js进行压缩，并使用hash值
    .match("/js/*.js", {
        useHash: true,
        optimizer: fis.plugin('uglify-js', {
            mangle: {
              except: 'exports, module, require, define' //不需要混淆的关键字
            },
            compress: {
              drop_console: true //自动删除console
            }
        })
    })
    // 将less文件编译成css
    .match('/css/*.less', {
        parser: fis.plugin('less'),
        rExt: '.css'
    })
    // 对css进行压缩，使用hash值，并合成雪碧图
    .match('/css/*.{less,css}', {
        useHash: true,
        useSprite: true,
        optimizer: fis.plugin('clean-css')
    })
    // 给图片添加hash值
    .match("::image", {
        useHash: true
    })
    // 压缩图片
    .match('images/*.png', {
        optimizer: fis.plugin('png-compressor', {
            type: 'pngquant' 
        })
    })
    // 将合成的雪碧图直接放在images/sprite文件中
    .match('/css/(*.{png,gif})', {
      //发布到/images/sprite/xxx目录下
      release: '/images/sprite/$1$2'
    });

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

```
