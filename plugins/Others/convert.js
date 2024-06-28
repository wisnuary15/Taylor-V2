const handler = async (m, {
  conn,
  isOwner,
  usedPrefix,
  command,
  args
}) => {
  let text, query = usedPrefix + command + " cf|40";
  if (args.length >= 1) text = args.slice(0).join(" ");
  else {
    if (!m.quoted || !m.quoted?.text) throw query;
    text = m.quoted?.text;
  }
  let urut = text.split("|"),
    one = urut[0],
    two = urut[1];
  return await Calculate(one, two);
};
handler.tags = ["tools"], handler.command = handler.help = ["convert"];
export default handler;

function Calculate(type, val) {
  return "cf" === type ? {
    First: "C° - Celsius",
    Second: "F° - Fahrenheit",
    Result: (val / 5 * 9 + 32).toFixed(3),
    Form: "(C / 5 * 9) + 32"
  } : "fc" === type ? {
    First: "F° - Fahrenheit",
    Second: "C° - Celsius",
    Result: (5 * (val - 32) / 9).toFixed(3),
    Form: "5 * (F - 32) / 9"
  } : "ck" === type ? {
    First: "C° - Celsius",
    Second: "K° - Kelvin",
    Result: val + 273.15,
    Form: "C + 273,15"
  } : "kc" === type ? {
    First: "K° - Kelvin",
    Second: "C° - Celsius",
    Result: val - 273.15,
    Form: "K - 273,15"
  } : "rc" === type ? {
    First: "R° - Rankine",
    Second: "C° - Celsius",
    Result: (5 * (val - 491.67) / 9).toFixed(3),
    Form: "(R − 491,67) * 5 / 9"
  } : "cr" === type ? {
    First: "C° - Celsius",
    Second: "R° - Rankine",
    Result: (9 * val / 5 + 491.67).toFixed(2),
    Form: "C * 9 / 5 + 491,67"
  } : "rf" === type ? {
    First: "R° - Rankine",
    Second: "F° - Fahrenheit",
    Result: val - 459.67,
    Form: "R - 459,67"
  } : "fr" === type ? {
    First: "F° - Fahrenheit",
    Second: "R° - Rankine",
    Result: val + 459.67,
    Form: "F + 459,67"
  } : "fk" === type ? {
    First: "F° - Fahrenheit",
    Second: "K° - Kelvin",
    Result: (5 * (val - 32) / 9 + 273.15).toFixed(3),
    Form: "(F − 32) * 5/9 + 273,15"
  } : "kf" === type ? {
    First: "K° - Kelvin",
    Second: "F° - Fahrenheit",
    Result: (9 * (val - 273.15) / 5 + 32).toFixed(3),
    Form: "(K - 273,15) * 9 / 5 + 32"
  } : "km" === type ? {
    First: "KM - Kilometer",
    Second: "MI - Miles",
    Result: .621379 * val,
    Form: "KM * 0.621379"
  } : "mk" === type ? {
    First: "MI - Miles",
    Second: "KM - Kilometer",
    Result: val / .62137,
    Form: "MI / 0.62137"
  } : "tg" === type ? {
    First: "T - Ton",
    Second: "G - Gram",
    Result: 1e6 * val,
    Form: "T * 1000000"
  } : "gk" === type ? {
    First: "G - Gram",
    Second: "KG - Kilogram",
    Result: val / 1e3,
    Form: "G / 1000"
  } : "kg" === type ? {
    First: "KG - Kilogram",
    Second: "G - Gram",
    Result: 1e3 * val,
    Form: "KG * 1000"
  } : "gt" === type ? {
    First: "G - Gram",
    Second: "T - Tons",
    Result: val / 1e6,
    Form: "G / 1000000"
  } : "kgt" === type ? {
    First: "KG - Kilogram",
    Second: "T - Tons",
    Result: val / 1e3,
    Form: "KG / 1000"
  } : "gmg" === type ? {
    First: "G - Gram",
    Second: "MG - Miligram",
    Result: val / 1e3,
    Form: "G / 1000"
  } : "tmg" === type ? {
    First: "T - Ton",
    Second: "MG - Miligram",
    Result: 1e9 * val,
    Form: "T * 1000000000"
  } : "tkg" === type ? {
    First: "T - Ton",
    Second: "KG - Kilogram",
    Result: 1e3 * val,
    Form: "T * 1000"
  } : "mgt" === type ? {
    First: "MG - Miligram",
    Second: "T - Ton",
    Result: val / 1e9,
    Form: "MG / 1000000000"
  } : "kgmg" === type ? {
    First: "KG - Kilogram",
    Second: "MG - Miligram",
    Result: 1e6 * val,
    Form: "KG * 1000000"
  } : "mgg" === type ? {
    First: "MG - Miligram",
    Second: "G - Gram",
    Result: val / 1e3,
    Form: "MG / 1000"
  } : "mgkg" === type && {
    First: "MG - Miligram",
    Second: "KG - Kilogram",
    Result: val / 1e6,
    Form: "MG / 1000000"
  };
}