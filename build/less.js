var fs = require('fs');
var glob = require('glob');
var less = require('less');
var path = require('path');
var {makeRelative, write} = require('./util');

var themes = {}, promises = [];

glob.sync('custom/*.less').forEach(file => {

    var theme = path.basename(file, '.less'),
        dist = `dist/css/uikit.${theme}.css`,
        data = fs.readFileSync(file, 'utf8');

    themes[theme] = {file: `../${dist}`};

    promises.push(less.render(data, {
        relativeUrls: true,
        rootpath: '../../',
        paths: ['custom/']
    }).then(
        output => write(dist, output.css),
        error => console.log(error)
    ));

});

Promise.all(promises).then(() => makeRelative('dist/css/!(*.min).css'));

if (Object.keys(themes).length) {
    write('themes.json', JSON.stringify(themes));
}
