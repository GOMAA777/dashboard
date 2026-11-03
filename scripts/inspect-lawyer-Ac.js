fetch("https://law.elmoroj.com/lawyer/assets/index-PPlm_9tS.js")
  .then((r) => r.text())
  .then((t) => {
    // Find AuthProvider Mf with initialUser then Ac()
    const needle = "return Ac()}),[o,s]";
    let i = t.indexOf("function Mf({children");
    if (i < 0) i = t.indexOf("initialUser:r");
    console.log("Mf idx", i);
    console.log(t.slice(i, i + 900));

    // Find auth hydrate near rc/ic
    const j = t.indexOf("function Ac(){");
    console.log("\nAc() idx", j);
    if (j >= 0) console.log(t.slice(j, j + 200));

    // Search for hydrate aliases: lc() used as user getter - already have it
    // Boot path: return Ac() in useState - find ALL "return Ac()"
    let from = 0;
    for (let n = 0; n < 10; n++) {
      const k = t.indexOf("return Ac()", from);
      if (k < 0) break;
      console.log(`\nreturn Ac() #${n}`, k, t.slice(k - 120, k + 40));
      from = k + 10;
    }

    // Find function that calls lc from session - maybe named differently
    const k2 = t.indexOf("Qs||rc()");
    console.log("\noc context", t.slice(k2 - 100, k2 + 400));
  });
