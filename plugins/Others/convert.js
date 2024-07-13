const handler = async (m, {
  conn,
  isOwner,
  usedPrefix,
  command,
  args
}) => {
  let text;
  const query = `${usedPrefix}${command} cf|40`;
  if (args.length >= 1) {
    text = args.join(" ");
  } else {
    if (!m.quoted || !m.quoted.text) throw query;
    text = m.quoted.text;
  }
  const [type, val] = text.split("|").map(item => item.trim());
  return await Calculate(type, parseFloat(val));
};
handler.tags = ["tools"];
handler.command = handler.help = ["convert"];
export default handler;

function Calculate(type, val) {
  const conversions = {
    cf: {
      First: "C° - Celsius",
      Second: "F° - Fahrenheit",
      Result: (val / 5 * 9 + 32).toFixed(3),
      Form: "(C / 5 * 9) + 32"
    },
    fc: {
      First: "F° - Fahrenheit",
      Second: "C° - Celsius",
      Result: (5 * (val - 32) / 9).toFixed(3),
      Form: "5 * (F - 32) / 9"
    },
    ck: {
      First: "C° - Celsius",
      Second: "K° - Kelvin",
      Result: (val + 273.15).toFixed(2),
      Form: "C + 273.15"
    },
    kc: {
      First: "K° - Kelvin",
      Second: "C° - Celsius",
      Result: (val - 273.15).toFixed(2),
      Form: "K - 273.15"
    },
    rc: {
      First: "R° - Rankine",
      Second: "C° - Celsius",
      Result: (5 * (val - 491.67) / 9).toFixed(3),
      Form: "(R − 491.67) * 5 / 9"
    },
    cr: {
      First: "C° - Celsius",
      Second: "R° - Rankine",
      Result: (9 * val / 5 + 491.67).toFixed(2),
      Form: "C * 9 / 5 + 491.67"
    },
    rf: {
      First: "R° - Rankine",
      Second: "F° - Fahrenheit",
      Result: (val - 459.67).toFixed(2),
      Form: "R - 459.67"
    },
    fr: {
      First: "F° - Fahrenheit",
      Second: "R° - Rankine",
      Result: (val + 459.67).toFixed(2),
      Form: "F + 459.67"
    },
    fk: {
      First: "F° - Fahrenheit",
      Second: "K° - Kelvin",
      Result: (5 * (val - 32) / 9 + 273.15).toFixed(3),
      Form: "(F − 32) * 5/9 + 273.15"
    },
    kf: {
      First: "K° - Kelvin",
      Second: "F° - Fahrenheit",
      Result: (9 * (val - 273.15) / 5 + 32).toFixed(3),
      Form: "(K - 273.15) * 9 / 5 + 32"
    },
    km: {
      First: "KM - Kilometer",
      Second: "MI - Miles",
      Result: (.621379 * val).toFixed(3),
      Form: "KM * 0.621379"
    },
    mk: {
      First: "MI - Miles",
      Second: "KM - Kilometer",
      Result: (val / .62137).toFixed(3),
      Form: "MI / 0.62137"
    },
    tg: {
      First: "T - Ton",
      Second: "G - Gram",
      Result: (1e6 * val).toFixed(0),
      Form: "T * 1000000"
    },
    gk: {
      First: "G - Gram",
      Second: "KG - Kilogram",
      Result: (val / 1e3).toFixed(3),
      Form: "G / 1000"
    },
    kg: {
      First: "KG - Kilogram",
      Second: "G - Gram",
      Result: (1e3 * val).toFixed(0),
      Form: "KG * 1000"
    },
    gt: {
      First: "G - Gram",
      Second: "T - Tons",
      Result: (val / 1e6).toFixed(6),
      Form: "G / 1000000"
    },
    kgt: {
      First: "KG - Kilogram",
      Second: "T - Tons",
      Result: (val / 1e3).toFixed(3),
      Form: "KG / 1000"
    },
    gmg: {
      First: "G - Gram",
      Second: "MG - Miligram",
      Result: (1e3 * val).toFixed(0),
      Form: "G * 1000"
    },
    tmg: {
      First: "T - Ton",
      Second: "MG - Miligram",
      Result: (1e9 * val).toFixed(0),
      Form: "T * 1000000000"
    },
    tkg: {
      First: "T - Ton",
      Second: "KG - Kilogram",
      Result: (1e3 * val).toFixed(0),
      Form: "T * 1000"
    },
    mgt: {
      First: "MG - Miligram",
      Second: "T - Ton",
      Result: (val / 1e9).toFixed(9),
      Form: "MG / 1000000000"
    },
    kgmg: {
      First: "KG - Kilogram",
      Second: "MG - Miligram",
      Result: (1e6 * val).toFixed(0),
      Form: "KG * 1000000"
    },
    mgg: {
      First: "MG - Miligram",
      Second: "G - Gram",
      Result: (val / 1e3).toFixed(3),
      Form: "MG / 1000"
    },
    mgkg: {
      First: "MG - Miligram",
      Second: "KG - Kilogram",
      Result: (val / 1e6).toFixed(6),
      Form: "MG / 1000000"
    }
  };
  return conversions[type] || {};
}
