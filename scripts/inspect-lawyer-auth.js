fetch("https://law.elmoroj.com/lawyer/assets/index-PPlm_9tS.js")
  .then((r) => r.text())
  .then((t) => {
    const i = t.indexOf("doussary_auth_session");
    console.log(t.slice(i - 80, i + 3200));
    const loginIdx = t.indexOf("assignedRole");
    console.log("\n\n==== assignedRole ctx ====\n");
    console.log(t.slice(Math.max(0, loginIdx - 400), loginIdx + 800));
  });
