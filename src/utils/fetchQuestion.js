import { csv2json } from 'csvjson-csv2json';

const ALL_TYPES = [
  '个人星球',
  '家庭星球',
  '理想国',
  '恋爱星球',
  '时间的爪印',
  '灵魂碰碰',
];

// 查询指定 级别、类型 的全部问题
export default function fetchQuestion(level = 1, types = ALL_TYPES) {
  return fetch(`/question/lv${level}.csv`)
    .then((res) => res.text())
    .then((csv) =>
      csv2json(csv).map((x) => ({
        type: x['分类'],
        content: x['问题'],
      }))
    )
    .then((lib) => lib.filter((x) => types.includes(x.type)));
}
