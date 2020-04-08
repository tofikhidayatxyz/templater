let mix = require('laravel-mix');


mix.disableNotifications();
mix.disableSuccessNotifications();

mix.js('resources/js/app.js', 'dist/assets/js/');

mix.sass('resources/sass/style.scss', 'dist/assets/css');

mix.options({
    processCssUrls: false, // enable this if need auto process css url
    postCss: [
      require('autoprefixer')({
      cascade: false,
      flexbox: 'no-2009'
    })
  ]
});
