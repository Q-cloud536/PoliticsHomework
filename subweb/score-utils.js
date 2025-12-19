// 分数字段工具：既支持浏览器，也支持 Node.js CommonJS
(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.ScoreUtils = factory();
  }
})(typeof window !== 'undefined' ? window : this, function() {
  /**
   * 计算最终分数：问卷得分 + 播种得分 + 耕耘得分 + 节奏大师得分 + 数字华容道得分 - 打地鼠、点击游戏的分数
   * 保持对旧参数的兼容：如果传入了 take 则仅取前 take 项。
   * @param {number} quizScore
   * @param {number} seedScore
   * @param {Array<number|object>} rounds - 如果是对象数组，支持 {game, score}
   * @param {number} [take] - 可选：取 rounds 的前 N 项（保持向后兼容）
   */
  function computeFinalTotal(quizScore, seedScore, rounds, take) {
    const arr = Array.isArray(rounds) ? rounds : [];
    const slice = (typeof take === 'number' && take > 0) ? arr.slice(0, take) : arr;

    // 分离耕耘游戏和其他需要减去的游戏分数
    let cultivationScore = 0; // 耕耘分数（打字练习）
    let deductionGamesScore = 0;  // 需要减去的游戏分数（打地鼠、数字华容道、节奏大师）

    for (const r of slice) {
      let sc = 0;
      if (typeof r === 'number') sc = Number(r) || 0;
      else if (r && typeof r === 'object') sc = Number(r.score || 0) || 0;
      
      // 每个游戏分数上限 128
      const limitedScore = Math.min(128, sc);
      
      // 区分不同游戏类型
      if ((typeof r === 'object' && r.game === 'typing-practice') || 
          (typeof r === 'number' && slice.indexOf(r) === 0 && slice[0].game === 'typing-practice')) {
        cultivationScore += limitedScore;
      } else if (typeof r === 'object' && 
                (r.game === 'click')) {
        // 需要减去的游戏：点击游戏
        deductionGamesScore += limitedScore;
      } else if (typeof r === 'object' && 
                (r.game === 'rhythm' || r.game === 'puzzle' || r.game === 'whack-a-mole')) {
        // 节奏大师游戏、数字华容道游戏和打地鼠游戏作为加分项
        cultivationScore += limitedScore;
      }
      // 其他游戏不计入计算
    }

    const q = Math.min(128, Number(quizScore || 0));
    const s = Math.min(128, Number(seedScore || 0));

    // 问卷分数 + 播种分数 + 耕耘分数 + 节奏大师分数 + 数字华容道分数 - 打地鼠、点击游戏的分数
    // 确保最终分数不低于0
    return Math.max(0, q + s + cultivationScore - deductionGamesScore);
  }

  return {
    computeFinalTotal
  };
});
