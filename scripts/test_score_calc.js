const assert = require('assert');
const path = require('path');
const ScoreUtils = require(path.resolve(__dirname, '../subweb/score-utils.js'));

// 测试用例
(function runTests() {
  // 1. 基本计算 (Puzzle游戏现在是加分项，注意seedScore被限制为最大128)
  assert.strictEqual(ScoreUtils.computeFinalTotal(50, 200, [{game:'click',score:30},{game:'puzzle',score:20}]), 50+128 - 30 + 20);

  // 2. rounds 为数字数组 (纯数字不计入计算)
  assert.strictEqual(ScoreUtils.computeFinalTotal(10, 0, [5,5,5,5,5,5,5]), 10 + 0);

  // 3. rounds 少于6个 (无game类型的对象不计入计算)
  assert.strictEqual(ScoreUtils.computeFinalTotal(0, 100, [{score:10},{score:20}]), 0 + 100);

  // 4. 非数字或缺失score字段
  assert.strictEqual(ScoreUtils.computeFinalTotal(0, 0, [{},{game:'x'}]), 0);

  // 5. 打字游戏和打地鼠游戏应作为加项
  assert.strictEqual(ScoreUtils.computeFinalTotal(0, 0, [{game:'typing-practice', score:100}, {game:'whack-a-mole', score:50}]), 0 + 0 + 50 + 100);

  console.log('所有分数计算测试通过');
})();
