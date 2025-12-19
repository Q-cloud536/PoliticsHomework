def compute_final_total(quiz, seed, rounds, take=6):
    arr = rounds[:take] if isinstance(rounds, list) else []
    typing = 0
    non_typing = 0
    for r in arr:
        if isinstance(r, (int, float)):
            non_typing += r
        elif isinstance(r, dict):
            sc = float(r.get('score', 0) or 0)
            if r.get('game') == 'typing-practice':
                typing += sc
            else:
                non_typing += sc
    return float(quiz or 0) + float(seed or 0) - non_typing + typing

# tests
assert compute_final_total(50,200,[{'game':'click','score':30},{'game':'puzzle','score':20}]) == 50+200-(30+20)
assert compute_final_total(10,0,[5,5,5,5,5,5,5]) == 10 - (5+5+5+5+5+5)
assert compute_final_total(0,100,[{'score':10},{'score':20}]) == 0+100-(10+20)
assert compute_final_total(0,0,[{}, {'game':'x'}]) == 0
assert compute_final_total(0,0,[{'game':'typing-practice','score':100},{'game':'whack','score':50}]) == 0+0 -50 +100
print('Python 验证：所有测试通过')
