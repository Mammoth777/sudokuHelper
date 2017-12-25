// 原始数据
/* const ORIGIN = [
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
// 横向纵向都是 3组 3*3
const GROUP = 3;

// 1. 坐标索引互换[工具]
// 1.1 索引转坐标
function calcXY(index) {
  let ypos = Math.floor(index / (GROUP * 3));
  let xpos = index - ypos * GROUP * 3;
  return {
    xp: xpos,
    yp: ypos
  }
}
// 1.2 坐标转索引对应的数组的的--值--
function calcValue(xp = 0, yp = 0 , arr = ORIGIN) {
  let index = xp + yp * GROUP * 3;
  return arr[index];
}
// 2. 计算某坐标可能出现的值 [工具]
// 2.1 同行: 根据同行判断, 返回索引为 index 的位置所有可能的数字
function row(index, originArr) {
  let yp = calcXY(index).yp;
  let arr = [], res = [];
  for (let i = 0; i < GROUP * 3; i++) {
    let num = calcValue(i, yp, originArr);
    num != 0 ?
      arr.push(num) :
      null
  }
  let maybe = {};
  arr.forEach(function (ele) {
    maybe[ele] = true;
  });
  for (let i = 1; i <= GROUP * 3; i++) {
    maybe[i] || res.push(i);
  }
  // 返回根据 同行判断此位置所有可能的数字
  return res;
}
// 2.2 同列: 根据同列判断, 返回索引为 index 的位置所有可能的数字
function col(index, originArr) {
  let xp = calcXY(index).xp;
  let arr = [], res = [];
  for (let i = 0; i < GROUP * 3; i++) {
    let num = calcValue(xp, i, originArr);
    num != 0 ?
      arr.push(num) :
      null
  }
  let maybe = {};
  arr.forEach(function (ele) {
    maybe[ele] = true;
  })
  for (let i = 1; i <= GROUP * 3; i++) {
    maybe[i] || res.push(i);
  }
  return res;
}
// 2.3 同九宫格: 根据9宫格判断, 返回索引为 index 的位置 的 所有可能的数字
function ninebox(index, originArr) {
  // a. 先找到左上角坐标
  let { xp, yp } = calcXY(index);
  while (xp % 3 != 0 || yp % 3 != 0) {
    xp % 3 != 0 ? xp-- : xp;
    yp % 3 != 0 ? yp-- : yp;
  }
  // b. 判断九宫格每个位置的值
  let maybe = {}, res = [];
  [
    calcValue(xp, yp, originArr), calcValue(xp, yp + 1, originArr), calcValue(xp, yp + 2, originArr),
    calcValue(xp + 1, yp, originArr), calcValue(xp + 1, yp + 1, originArr), calcValue(xp + 1, yp + 2, originArr),
    calcValue(xp + 2, yp, originArr), calcValue(xp + 2, yp + 1, originArr), calcValue(xp + 2, yp + 2, originArr)
  ]
    .forEach(function (ele) {
      ele != 0 ? maybe[ele] = true : null;
    });
  for (let i = 1; i <= GROUP * 3; i++) {
    maybe[i] || res.push(i);
  }
  return res;
}
// 2.4 综合交集: 根据 [同行], [同列] , [同九宫格] 不存在的数字综合判断, 选出三者**交集**
function mix(index, arr) {
  let temp = {};
  let r = row(index, arr),
    c = col(index, arr),
    n = ninebox(index, arr);
  r.forEach(function (ele) {
    temp[ele] ? temp[ele]++ : temp[ele] = 1;
  });
  c.forEach(function (ele) {
    temp[ele] ? temp[ele]++ : temp[ele] = 1;
  });
  n.forEach(function (ele) {
    temp[ele] ? temp[ele]++ : temp[ele] = 1;
  });
  let res = [];
  for (var k in temp) {
    temp[k] === 3 ? res.push(k - 0) : null;
  }
  return res;
}

// 3. 计算每个位置的值, 根据每个位置可能的值
// 3.1 遍历原始数组, 得到每个位置的 (当前数字 或 当前数组)
// 3.1.1 如果此处已经是非零数字, 则返回当前值
// 3.1.2 如果此处是单元素数组, 则返回该元素
// 3.1.3 否则返回计算后可能的值
function eachPosMaybe( arr ) {
  if(arr===undefined){
    debugger;
  }
  let res = []; // 返回的结果数组
  // 3.1 遍历原始数组, 得到每个位置的 (当前数字 或 当前数组)
  for (let i = 0; i < GROUP * 3 * GROUP * 3; i++) {
    let computedVal = undefined; // 计算结果值, 数字|数组
    let {xp, yp}= calcXY(i);
    let val = calcValue(xp, yp, arr);
    if (typeof val === 'number' && val !== 0) {
      // 3.1.1 如果此处已经是非零数字, 则返回当前值
      computedVal = val;
    }else if( val instanceof Array && val.length === 1 ){
      // 3.1.2 如果此处是单元素数组, 则返回该元素
      computedVal = val[0];
    }else {
      // 3.1.3 否则返回计算后可能的值
      computedVal = mix(i, arr);
    }
    res.push(computedVal); // 计算后的值放入结果数组
  }
  return res;
}
// 3.2 转换唯一值数组并重新计算, --> 所有只有一个元素的数组, 都是经过计算证明, 此处只有唯一可能的数字.
function assignNum(arr){
  let count = 0;
  arr.forEach(function(ele, index) {
    // 如果是数组, 且只有唯一值, 则确定该数字
    if ( ele instanceof Array && ele.length === 1 ){
      arr[index] = ele[0];
      count++;
    }
  });
  return {
    arr, // 经确定后的数组 
    count // 共确定了 count 个 单元素数组
  }
}

// 4. 递归确定: 递归到不再能确定
// 4.1 计算每个位置的值, 并赋值唯一值数组
// 4.2 如果有确定的格子, 则继续下一次计算, 
// 4.3 如果再没有确定数字的格子, 则返回
let calcCount = 0;
// *************************************************
// 一个神奇的发现, 如果原数组正确, 最多只会计算4次  !!!
// 如果原数组错误, 则会计算6次 !!!
// *************************************************
function recursion(origin){
  // 4.1 计算每个位置的值, 并赋值唯一值数组
  var {arr, count} = assignNum(eachPosMaybe(origin));
  // 4.2 如果此次有确定的格子, 则继续下一次计算, 
  if( count != 0 ){
    console.log(`第${++calcCount}次计算 : 确定了${count}个格子`);
    return recursion(arr); // 如果此处不return, 递归后, 函数返回的会是undefined
  }else if(calcCount > 4){
    console.log(`计算量为${calcCount}次, 原数据可能有错`);
    return arr;
  }else{
    // 4.3 如果再没有确定数字的格子, 则返回
    console.log(`最后一次计算的count为${count}, 没有更多可以确定的格子了`);
    return arr;
  }
}

// 5. 渲染页面
function render(resarr){
  let tds = document.querySelectorAll('td');
  tds.forEach(function(ele,index) {
    ele.querySelector('span:first-child').innerHTML = ORIGIN[index] || '';//如果是0则不渲染
    !ORIGIN[index] ? 
    ele.querySelector('span:last-child').innerHTML = resarr[index] : null;
  });
}

// 6. 如果最终依然不能确定为每个格子一个数组, 则可以 [假定] (每行|每列|每9格)重复率最低的一个
// 似乎不靠谱, 下次写的方向

// 主程序
// console.time('calc');
// let arr = recursion(ORIGIN);
// render(arr);
// console.timeEnd('calc');

export default recursion;





