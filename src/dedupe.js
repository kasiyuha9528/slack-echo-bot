// 同じイベントIDを、2回処理しないための簡単な記憶。
// 最近の max 個だけ覚えて、古いものから忘れる(メモリを使い続けないため)。
export function createDedupe(max = 1000) {
  const seen = new Set();
  return function alreadyHandled(id) {
    if (!id) return false;          // IDがなければ、判断できないので処理する
    if (seen.has(id)) return true;  // 見たことがある → 処理済み
    seen.add(id);
    if (seen.size > max) {
      seen.delete(seen.values().next().value); // 一番古いものを忘れる
    }
    return false;
  };
}