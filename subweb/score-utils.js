// 分数字段工具：既支持浏览器，也支持 Node.js CommonJS
(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.ScoreUtils = factory();
  }
})(typeof window !== 'undefined' ? window : this, function() {
  /**
   * 计算最终分数：将问卷、播种与后续所有游戏分数相加（每项上限128），
   * 保持对旧参数的兼容：如果传入了 take 则仅取前 take 项。
   * @param {number} quizScore
   * @param {number} seedScore
   * @param {Array<number|object>} rounds - 如果是对象数组，支持 {game, score}
   * @param {number} [take] - 可选：取 rounds 的前 N 项（保持向后兼容）
   */
  function computeFinalTotal(quizScore, seedScore, rounds, take) {
    const arr = Array.isArray(rounds) ? rounds : [];
    const slice = (typeof take === 'number' && take > 0) ? arr.slice(0, take) : arr;

    let roundsSum = 0;
    for (const r of slice) {
      let sc = 0;
      if (typeof r === 'number') sc = Number(r) || 0;
      else if (r && typeof r === 'object') sc = Number(r.score || 0) || 0;
      // 每个游戏分数上限 128
      roundsSum += Math.min(128, sc);
    }

    const q = Math.min(128, Number(quizScore || 0));
    const s = Math.min(128, Number(seedScore || 0));

    return q + s + roundsSum;
  }

  return {
    computeFinalTotal
  };
});
