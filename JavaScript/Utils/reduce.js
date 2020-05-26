// 数组求和
const arr = [
  { name: 'math', score: '147' },
  { name: 'english', score: '121' },
  { name: 'yuwen', score: '98' },
]
const total = arr.reduce((total, obj) => {
  // console.log(total, obj);
  return total + +obj.score
})

// console.log('total', total);

// 数组最大值
const a = [2, 54, 45, 48, 65, 545, 3]
const max_a = a.reduce((pre, cur) => {
  return pre > cur ? pre : cur
})
// console.log('max_a', max_a);

// 数组对象中的用法
const objArr = [{name: '篮球'}, {name: '足球'}, {name: '网球'}]
const res = objArr.reduce((pre, cur, index, arr) => {
  if (index === 0) {
    return cur.name
  } else if (index === (arr.length - 1)) {
    return pre + '和' + cur.name
  } else {
    return pre + '、' + cur.name
  }
}, '')
// console.log('res', res);

// 求字符串中字母出现的次数
const str = 'sfhjasfjgfasjuwqrqadqeiqsajsdaiwqdaklldflas-cmxzmnha'
const str_count = str.split('').reduce((acc, cur) => {
  acc[cur] ? acc[cur]++ : acc[cur] = 1
  return acc
}, {})
// console.log('str_count', str_count);

// 数组转数组，每个值平方
const arr1 = [2, 4, 6, 12, 64]
const square_arr1 = arr1.reduce((acc, cur) => {
  acc.push(cur * cur)
  return acc
}, [])

// 数组转对象
const streams = [{name: '技术', id: 1}, {name: '设计', id: 2}]
const arr_obj = streams.reduce((acc, cur) => {
  acc[cur.id] = cur; return acc;
}, {})
// console.log('arr_obj', arr_obj);

// 多维的叠加操作
let result = [
  { subject: 'math', score: 88 },
  { subject: 'chinese', score: 95 },
  { subject: 'english', score: 80 }
];
let dis = {
  math: 0.5,
  chinese: 0.3,
  english: 0.2
};
let score = result.reduce((acc, cur) => {
  acc += dis[cur.subject] * cur.score
  return acc
}, 0)
// console.log('score', score);

// 扁平化数组
let two_di_arr = [[1, 2, 8], [3, 4, 9], [5, 6, 10]];
let two_di_arr_res = two_di_arr.reduce((acc, cur) => {
  return acc.concat(cur)
}, [])
// console.log('two_di_arr_res', two_di_arr_res);

// 多维数组的扁平函数
const flatten = arr => {
  return arr.reduce((acc, cur) => {
    return acc.concat(Array.isArray(cur) ? flatten(cur) : cur)
  }, [])
}
// console.log('t3', flatten([1,[2,3],4,[['3',6],7]]));

// 数组对象去重
const uniqBy = (arr, key) => {
  let obj = {}
  return arr.reduce((acc, cur) => {
    obj[cur[key]] ? '' : obj[cur[key]] = true && acc.push(cur)
    return acc
  }, [])
}