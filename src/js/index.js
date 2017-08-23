import _ from 'lodash';
import Vue from 'vue';
import '../css/index.css';
import menu from '../../menu.vue';






let max = _.max([2,5,1,8,6,1144]);
class base{
    getNum(){
        console.log(11111);
    }
}
let bb = new base();
bb.getNum();
console.log(max);