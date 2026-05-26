🎯 UNO STACKING RULES — FINAL SPEC (EDGE-CASE SAFE)

1. Should stacking be optional or mandatory? ✅ Answer: OPTIONAL Rule:

A player who receives a +2 or +4:

MAY stack another +2 or +4 MAY choose NOT to stack If they do not stack → they
must accept the penalty Edge Case

If player has a valid stack card:

Still NOT forced to play it

If player has NO +2/+4:

Must accept draw 2. Can a player choose to draw instead of stacking? ❌ Answer:
NO (important correction) Rule:

During a stack phase:

Players cannot use "draw action" manually Only valid responses are: +2 +4 OR
accept stack Edge Case

If player tries:

draw_card action → ❌ INVALID during stack phase

Reason: 👉 drawing is not a choice during penalty resolution

3. During stacking, should color be completely ignored? ✅ YES — COLOR IS
   COMPLETELY IGNORED Rule:

Stacking is based ONLY on action type:

ONLY +2 and +4 matter color does NOT matter at all Example Blue +2 → Red +4 →
Green +2

✔ All valid stack chain

Edge Case Clarification

Even if:

card color mismatches current color is different

👉 stacking is still valid

4. Can a Red +2 be played on a Blue +4? ❌ COLOR DOES NOT MATTER, BUT ACTION
   TYPE DOES Correct Rule:

✔ YES, this is valid:

Blue +4 → Red +2

because:

+2 can stack on +4 color is ignored INVALID CASES Blue +4 → Red 5 ❌ not allowed
(not stack type) Blue +2 → Red Skip ❌ not allowed

Only +2 / +4 allowed in stack phase.

5. Can non-draw cards interrupt stacking? ❌ NO — NEVER ALLOWED Rule:

During an active stack:

Only these are allowed:

+2 +4 OR pass (accept stack) Examples Invalid interruptions: +2 → Skip ❌ +4 →
Reverse ❌ +2 → Number card ❌ Edge Case Rule (VERY IMPORTANT)

Stack phase is a LOCKED MODE

gameState = STACK_MODE

Only stack-valid cards are accepted.

6. When does the draw happen if stacking is not continued? ✅ Answer:
   IMMEDIATELY WHEN PLAYER FAILS OR STOPS STACK Rule:

The moment a player does NOT continue stack:

→ resolve draw immediately → apply total drawStack → reset stack → skip player
turn Flow Example +2 played → +4 stacked → +2 stacked → next player cannot stack
→ IMMEDIATE resolution: → draw 8 cards → turn ends Edge Case

There is NO “waiting window” after last stack move.

👉 resolution happens instantly on failure to stack.

⚠️ FINAL STACK SYSTEM MODEL (VERY IMPORTANT) Game has 2 modes:

1. NORMAL MODE normal UNO rules apply
2. STACK MODE (triggered by +2 or +4)

During STACK MODE:

ONLY +2 / +4 allowed no skips, no reverses, no number cards no manual draw
action color ignored turn does NOT advance normally
