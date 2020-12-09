const gulp        = require('gulp');
const fs          = require('fs');
const path        = require('path');
const { mdToPdf } = require('md-to-pdf');
const sass        = require('gulp-sass');
const concat      = require('gulp-concat');
const liveServer  = require('live-server');
const mkdirp      = require('mkdirp');

sass.compiler     = require('node-sass');

const DIST_FOLDER = path.join(__dirname, 'generated')
const HTML_FOLDER = path.join(DIST_FOLDER, 'html')
const STYLE_GLOB  = './styles/custom/*.{css,sass,scss}'
const MD_FILE     = 'resume.md'
const HTML_FILE   = './generated/html/index.html'
const PDF_FILE    = './generated/resume.pdf'

const CONFIG = {
  basedir:      __dirname,
  stylesheet:   './generated/styles.css',
  body_class:   'markdown-body'
}

/**
 * Parses custom properties from the markdown
 *
 * @returns
 */
function properties() {
  const markdown = fs.readFileSync(MD_FILE).toString();
  const strings  = markdown.match(/<!-+[\s|\n]*@([a-z]+)\s+([a-z0-9-]+)[\s|\n]*-+>/ig) || [];

  return strings.reduce((all, s) => {
    const chunks = s.match(/<!-+[\s|\n]*@([a-z]+)\s+([a-z0-9-]+)[\s|\n]*-+>/i);
    if (chunks && chunks.length === 3) {
      all[chunks[1]] = chunks[2]
    }
    return all;
  }, {})
}

function parseTheme() {
  const props = properties();
  return props['theme'] || 'default';
}

gulp.task('inspect', () => {
  parseTheme();
});

gulp.task('style', () => {
  mkdirp.sync(DIST_FOLDER);

  const theme = parseTheme();

  console.info(`Using theme ${theme}`)

  return gulp.src([STYLE_GLOB, `styles/themes/${theme}.css`])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat(`styles.css`))
    .pipe(gulp.dest(DIST_FOLDER));
});

gulp.task('pdf', gulp.series('style', async () => {
  const pdf = await mdToPdf({ path: MD_FILE }, CONFIG);
  if (pdf) { fs.writeFileSync(PDF_FILE, pdf.content); }
}));

gulp.task('html', gulp.series('style', async () => {
  const html = await mdToPdf({ path: MD_FILE }, {
    ...CONFIG,
    as_html: true
  });

  mkdirp.sync(HTML_FOLDER)

  fs.writeFileSync(HTML_FILE, html.content);
}));

gulp.task('serve', async () => {
  await gulp.task('html')()

  liveServer.start({ root: HTML_FOLDER });

  gulp.watch([STYLE_GLOB, MD_FILE], gulp.series('html'));
});

gulp.task('build', gulp.series('pdf'))

gulp.task('default', gulp.series('build'))
