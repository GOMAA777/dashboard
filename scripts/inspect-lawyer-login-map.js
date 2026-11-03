fetch("https://law.elmoroj.com/lawyer/assets/index-PPlm_9tS.js")
  .then((r) => r.text())
  .then((t) => {
    const markers = [
      "company_name",
      "impersonated",
      "preview_banner",
      "/lawyer/login",
      "roleId",
      "المستشار العام",
    ];
    for (const m of markers) {
      let from = 0;
      let n = 0;
      while (n < 3) {
        const i = t.indexOf(m, from);
        if (i < 0) break;
        console.log(`\n==== ${m} #${n} @${i} ====\n`);
        console.log(t.slice(Math.max(0, i - 250), i + 450));
        from = i + m.length;
        n += 1;
      }
    }
  });
