const { localStorage } = window;

const Storage = {
  // 创建/全量更新
  set: (key, data) => {
    const now = getTimestamp();
    const record = { data, updateAt: now };
    let message;

    if (!localStorage.getItem(key)) {
      record.createAt = now;
      message = `数据项 \`${key}\` 创建成功`;
    } else {
      message = `数据项 \`${key}\` 更新成功`;
    }

    localStorage.setItem(key, tryStringify(record));
    return Promise.resolve({ ...record, success: true, message });
  },

  // 创建/局部更新
  put: (key, data) => {
    const now = getTimestamp();
    let record;
    let message;

    if (!localStorage.getItem(key)) {
      record = { data, updateAt: now, createAt: now };
      message = `数据项 \`${key}\` 创建成功`;
    } else {
      const oldRecord = tryParse(localStorage.getItem(key) || '') || {};
      record = {
        data: Object.assign({}, oldRecord.data, data),
        updateAt: now,
        createAt: oldRecord.createAt,
      };
      message = `数据项 \`${key}\` 更新成功`;
    }

    localStorage.setItem(key, tryStringify(record));
    return Promise.resolve({ ...record, success: true, message });
  },

  // 获取数据项
  get: (key) => {
    const record = tryParse(localStorage.getItem(key) || '') || null;
    return Promise.resolve(
      record
        ? { ...record, success: true, message: `数据项 \`${key}\` 查询成功` }
        : {
            success: false,
            data: null,
            message: `找不到名为 \`${key}\` 的数据项`,
          }
    );
  },

  // 删除数据项
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return Promise.resolve({
        success: true,
        message: `数据项 \`${key}\` 删除成功`,
      });
    } catch (e) {
      return Promise.resolve({
        success: false,
        message: `数据项 \`${key}\` 删除失败，请确认该数据项是否存在`,
      });
    }
  },
};

export default Storage;

function tryStringify(obj) {
  let result = obj;
  try {
    result = JSON.stringify(obj);
  } catch (e) {
    // who cares...
  }
  return result;
}

function tryParse(str) {
  let result = str;
  try {
    result = JSON.parse(str);
  } catch (e) {
    // who cares...
  }
  return result;
}

function getTimestamp() {
  return Date.now();
}
