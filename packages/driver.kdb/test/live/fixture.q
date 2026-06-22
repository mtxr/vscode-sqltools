\ Test fixture loaded by npm run test:live-kdb. It intentionally uses simple,
\ local in-memory data so the live test exercises a real q process without
\ needing production data or credentials.

\ Community kdb+/q builds can reject IPC logins unless an auth hook is present.
\ This local-only fixture accepts IPC handshakes for integration testing.
.z.pw:{[u;p] 1b}

trade:([]
  sym:`AAPL`MSFT`GOOG;
  size:100 250 75i;
  price:123.45 234.56 345.67;
  day:2024.01.01 2024.01.02 2024.01.03;
  ts:2024.01.01D09:30:00.000000000 2024.01.01D09:31:00.000000000 2024.01.01D09:32:00.000000000)

tradeView::select from trade where size>100

attrTrade:`sym xasc trade
attrTrade:update `s#sym from attrTrade

quote:([sym:`AAPL`MSFT]
  bid:123.40 234.50;
  ask:123.50 234.60)

empty:([] sym:`symbol$(); size:`int$())

edge:([]
  sym:enlist `AAPL;
  chars:enlist "alpha";
  nums:enlist 1 2 3;
  nested:enlist ("left";"right");
  dict:enlist `a`b!10 20;
  nullSym:enlist `;
  longid:enlist 9007199254740993j;
  day:enlist 2024.01.02;
  ts:enlist 2024.01.02D09:30:00.123456789;
  span:enlist 0D00:00:00.123456789)

calcSpread:{[bid;ask] ask-bid}

\d .analytics
nsTrade:([] sym:`IBM`ORCL; size:10 20i)
nsFunc:{[x] x+1}
\d .
