<template>
  <div class="container">
    <ul :style="{width: ulWidth}">
      <li v-for="(item, index) in list" :key="index" v-colorborder="{index, groupCount}">
        <input type="tel" v-model="list[index]" @input='edit($event, index)' @mouseover='hoverItem(list[index])' v-colored>
      </li>
    </ul>
    <p>current box :
      <span v-text="currentItem"></span>
    </p>
    <div class="controlBox">
      GROUP COUNT : <input type="number" v-model="groupCount">
      <input type="button" value="CALC" @click="generate">
    </div>
  </div>
</template>

<script>
import calc from '../calc'
export default {
  name: 'home',
  directives: {
    colored: {
      inserted(el) {
        let num = el.value - 0;
        if (num > 0) {
          el.style.color = "#000";
        }
      }
    },
    colorborder: {
      inserted(el, binding) {
        const GROUP = binding.value.groupCount;
        const INDEX = binding.value.index;
        let ypos = Math.floor(INDEX / (GROUP * 3));
        let xpos = INDEX - ypos * GROUP * 3;
        if( (xpos+1) % 3 === 0 ){
          el.style.borderRightColor = '#f44';
        }
        if( (ypos+1) % 3 === 0 ){
          el.style.borderBottomColor = '#f44';
        }
      }
    }
  },
  data() {
    return {
      groupCount: 3,
      list: [],
      currentItem: -1
    }
  },
  computed: {
    ulWidth() {
      return this.groupCount * 3 * 2.1 + 'em';
    }
  },
  watch: {
    groupCount() {
      let count = this.groupCount * 3 * this.groupCount * 3;
      this.list = new Array(count - 0).fill('');
    }
  },
  created() {
    this.list = new Array(81).fill('');
    /* this.list = [
      0, 0, 0, 0, 1, 0, 0, 0, 2,
      0, 8, 5, 0, 0, 4, 3, 9, 0,
      7, 0, 0, 0, 5, 0, 0, 0, 8,
      2, 0, 8, 7, 0, 5, 6, 1, 9,
      0, 0, 1, 0, 3, 2, 0, 0, 0,
      4, 7, 9, 6, 8, 0, 0, 0, 5,
      9, 1, 3, 5, 2, 7, 8, 6, 4,
      0, 5, 2, 4, 6, 3, 9, 7, 0,
      6, 4, 0, 1, 0, 0, 0, 0, 3
    ] */
  },
  methods: {
    edit(e, index) {
      let input = e.data - 0;
      this.list[index] = input > 0 && input <= 9 ? input : '';
      e.target.value = this.list[index];
      e.target.style.color = "#000";
      this.generate();
    },
    generate() {
      console.log(this.list);
      let res = calc(this.list);
      this.list = res;
    },
    hoverItem(curr) {
      this.currentItem = curr;
    },
    calcBorder(binding) {
      let index = binding.value;
      let ypos = Math.floor(index / (this.groupCount * 3));
      let xpos = index - ypos * this.groupCount * 3;
      
    },
  }
}
</script>

<style lang="less" scoped>
@mainBd: #333366;
@3nBd: #f40;
@mainBg: #FFFFFF;
@mainShadow: #99CCFF;
@mainFontCo: #f44;
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

input {
  width: 3em;
  text-align: center;
  border: 0;
  outline: none;
  -webkit-appearance: none;
  cursor: default;
}

.bdbottom {
  border-bottom: 1px solid @3nBd;
}

.bdright {
  border-right: 1px solid @3nBd;
}

ul {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 50px auto;
  border: 1px solid @mainBd;
  border-width: 1px 0 0 1px;
  padding: 0;
  font-size: 20px; // 决定格子大小
  li {
    width: 2em;
    height: 2em;
    line-height: 2em;
    text-align: center;
    position: relative;
    overflow: hidden;
    border: 1px solid @mainBd;
    border-width: 0 2px 2px 0;
    background-color: @mainBg;
    &:hover {
      transform: scale(1.02);
      transition: all .2s ease-out;
      background-color: @mainBg;
      border-color: transparent;
      box-shadow: 0 0 5px 1px @mainShadow;
      z-index: 1;
    }
    input {
      .center;
      border: 0;
      height: 100%;
      width: 100%;
      outline: none;
      background-color: transparent;
      font-size: 1em;
      font-family: Helvetica Arial;
      color: @mainFontCo;
    }
  }
}

p {
  text-align: center;
}

div.controlBox {
  margin: 0 auto;
  width: 70%;
  input[type="number"] {
    // 去除上下箭头
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    -moz-appearance: textfield;
    border: 1px solid transparent;
    border-bottom: 3px solid #f08080;
    margin-right: 2em;
    &:focus {
      border: 1px solid #f08080;
      border-bottom-width: 3px;
    }
  }
  input[type="button"] {
    width: 8em;
    height: 2em;
    border-radius: 5px;
    background-color: #f08080;
    color: #fff;
    box-shadow: 0px 0px 5px 0px inset #903030;
    transition: all 1s ease-in-out;
    &:hover {
      transition: all .3s ease-out;
      box-shadow: 2px 2px 10px 0px #903030;
    }
  }
}
</style>
