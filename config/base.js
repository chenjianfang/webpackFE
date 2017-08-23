const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

var ManifestPlugin = require('webpack-manifest-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const glob = require('glob');


let entryFile = {};
function getEntry (){
    var jsFile = glob.sync("./src/**/*.js");
    jsFile.forEach(function(value){
        entryFile[value.slice(value.indexOf("src/js")+7).replace(/.js/,"")] = value;
    });
    entryFile['vendor'] = ['lodash','vue'];
    console.log(entryFile);
}
let entryHTMLFile = {};
function getHTMLEntry(){
    var htmlFile = glob.sync("./src/html/**/*.jade");
    htmlFile.forEach(function(value){
        entryHTMLFile[value.slice(value.indexOf("src/html")+9)] = value;
    });
    console.log(entryHTMLFile);
    var newHTML = [];
    for(var i in entryHTMLFile){
        var currentFile = i.replace(/.jade/,"");
        newHTML.push(
            new HtmlWebpackPlugin({
                filename:"./html/"+(i.replace(/jade/,"html")),
                template:"./src/html/"+i,
                inject:false,
                chunks:[currentFile,'vendor'],
            })
        )
        
    }
    base.plugins = base.plugins.concat(newHTML);
}



var base = {
    entry:entryFile,
    output:{
        path: path.join(__dirname, '/../dist/'),
        publicPath: '/dist/',
        filename: 'js/[name].js?v=[chunkhash:8]'
    },
    resolve:{
        extensions: ['.js'],
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['es2015']
                    }
                }
            },{
                test: /\.(css|scss|less)$/,
                loader:ExtractTextPlugin.extract({
                    fallback:'style-loader',
                    use:['css-loader','sass-loader','less-loader']
                })
            },{
                test: /\.vue$/,
                loader:'vue-loader'
            },{
                test: /\.jade$/,
                exclude:/(node_modules)/,
                loader:'jade-loader'
            },{
                test: /\.html$/,
                exclude:[/node_modules/],
                use:{
                    loader:'file-loader',
                    query:{
                        name:'[name].[ext]'
                    }
                }
            }
        ]
    },
    plugins:[
        //抽离js的css生成单独的css
        new ExtractTextPlugin('css/[name].css'),
        //提取公共模块 manifest静态缓存
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor','manifest'],
            minChunks: Infinity
        }),

        new ManifestPlugin(),

        //删除dist文件
        new CleanWebpackPlugin(
            ['js','css'],
            {
                root: path.join(__dirname, '/../dist/'),
                verbose: true,
                dry: false,
                exclude:['manifest.json']
            }
        )

    ]
};

getEntry();
getHTMLEntry();


var baseConfig = function () {
    return base;
}

module.exports = baseConfig;