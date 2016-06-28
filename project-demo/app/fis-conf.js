
// 保持发布使用相对路径
// fis.hook('relative'); 
// fis.match('**', { relative: true })

//域
// 测试环境
fis.set('domain_test', ''); //开发环境静态资源
// 预发布环境
fis.set('domain_pre', 'http://preuc.fdc.com.cn'); 
// 线上环境
fis.set('domain_build', ''); 
// // 定义版本号
// fis.set('version', '1.0.0'); 

//参考：https://github.com/kangax/html-minifier
fis.config.set('settings.optimizer.html-minifier', {
    removeComments: true, //删除注释
    ignoreCustomComments: [
        /<\!--\[if\s(gt|lt|gte|lte)?ie(\s\d+(\.\d)?)?\]>.*?<\!\[endif\]-->/i //忽略ie条件注释
    ]
});

//参考：https://github.com/fex-team/fis-spriter-csssprites
fis.config.set('settings.spriter.csssprites', {
    htmlUseSprite: true, //开启模板内联css处理,默认关闭
    styleReg: /(<style(?:(?=\s)[\s\S]*?["'\s\w\/\-]>|>))([\s\S]*?)(<\/style\s*>|$)/ig,
    margin: 5 //图之间的边距
    // //图之间的边距
    // margin: 10,
    // //使用矩阵排列方式，默认为线性`linear`
    // layout: 'matrix'
});

//参考：https://github.com/fex-team/fis-optimizer-uglify-js
fis.config.set('settings.optimizer.uglify-js', {
    mangle: {
      except: 'exports, module, require, define' //不需要混淆的关键字
    },
    compress: {
      drop_console: true //自动删除console
    }
});

// 排除指定目录和文件
fis.set('project.ignore', [
    '.git/**',
    '.svn/**',
    'node_modules/**',
    '*.bat',
    '*.cmd',
    '*.log',
    'fis-conf.js',
    "package.json",
    "**/___*.png" ,//过滤三下划线开头的预览图片
    '**/*.less'
]);

/**
 * 开发测试阶段
 */
 
fis.media('test')
    // 将less文件编译成css
    .match('/css/*.{less,css}', {
        parser: fis.plugin('less'),
        rExt: '.css'
    })
    // // css 自动补充兼容性
    // .match('*.css', {
    //   preprocessor: fis.plugin('cssprefixer', {
    //     "browsers": ["FireFox > 1", "Chrome > 1", "ie >= 8"],
    //     "cascade": true
    //   })
    // })
    .match('*', {
      deploy:fis.plugin('local-deliver', {
      })
    });



/**
 * 预发布阶段
 */
fis.media('pre')
    //定位到发布环境
    .match("**", {
        domain: "${domain_pre}"
    })
    .match('::package', {
      spriter: fis.plugin('csssprites')
    })
    // js进行压缩，并使用hash值
    .match("/js/*.js", {
        useHash: true,
        optimizer: fis.plugin('uglify-js')
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
    // css 自动补充兼容性
    .match('/css/*.{css,less}', {
      preprocessor: fis.plugin('cssprefixer', {
        "browsers": ["FireFox > 1", "Chrome > 1", "ie >= 8"],
        "cascade": true
      })
    })
    // 给图片添加hash值
    .match("*.{png,jpg,jpeg,gif,ico}", {
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
    })
    .match('**', {
      deploy: [
        fis.plugin('skip-packed', {
          // 配置项
          skipPackedToCssSprite:true
        }),
        fis.plugin('http-push', {
          // receiver: 'http://192.168.1.9:8999/receiver',
          // //远端目录
          // to: '/root/fis_test/other/'
        })
      ]
    })
/**
 * 发布阶段
 */
fis.media('build')
    //定位到发布环境
    .match("**", {
        domain: "${domain_build}"
    })
    .match('::package', {
      spriter: fis.plugin('csssprites')
    })
    // js进行压缩，并使用hash值
    .match("/js/*.js", {
        useHash: true,
        optimizer: fis.plugin('uglify-js')
    })
    // 将less文件编译成css
    .match('/css/*.{less,css}', {
        parser: fis.plugin('less'),
        rExt: '.css'
    })
    // 对css进行压缩，使用hash值，并合成雪碧图
    .match('/css/*.{less,css}', {
      useHash: true,
      useSprite: true,
      optimizer: fis.plugin('clean-css')
    })
    // css 自动补充兼容性
    .match('/css/*.{css,less}', {
      preprocessor: fis.plugin('cssprefixer', {
        "browsers": ["FireFox > 1", "Chrome > 1", "ie >= 8"],
        "cascade": true
      })
    })
    // 给图片添加hash值
    .match("*.{png,jpg,jpeg,gif,ico}", {
        useHash: true
    })
    // 压缩图片
    .match('/images/{,**/}*.png', {
        optimizer: fis.plugin('png-compressor', {
            type: 'pngquant' 
        })
    })
    // 将合成的雪碧图直接放在images/sprite文件中
    .match('/css/(*.{png,gif})', {
      //发布到/images/sprite/xxx目录下
      release: '/images/sprite/$1$2'
    })
    // // 将文件打包发送至远端服务器中
    // .match('*', {
    //   deploy: fis.plugin('http-push', {
    //     receiver: 'http://192.168.1.9:8999/receiver',
    //     //远端目录
    //     to: '/root/fis_test/test/'
    //   })
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
