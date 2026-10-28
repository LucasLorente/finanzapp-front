// Importa gastos, ingresos e inversiones desde el Excel "Balance" (una hoja por mes) a la API.
//
// Uso (PowerShell):
//   $env:IMPORT_EMAIL="..."; $env:IMPORT_PASSWORD="..."; npm run import:excel -- "data/Balance 2026 - Lucas.xlsx"
//   Agregar --commit para escribir de verdad (por defecto es dry-run) y --sheet "Octubre 2026" para una sola hoja.
//   En vez de email/password se puede pasar AUTH_TOKEN. API_URL o NEXT_PUBLIC_API_URL (default http://localhost:8000).
//
// Es idempotente: antes de crear, consulta lo que ya existe en el mes y saltea filas con misma fecha, monto y descripción.

import ExcelJS from "exceljs";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

// Columna "Categoría" del Excel → tipo de gasto en la app
const EXPENSE_TYPES = {
  "gastos fijos": "Fijos",
  "gastos variables": "Variables Necesarios",
  "gastos hormiga": "Superfluos",
};

// Categoría de gasto inferida por descripción; gana la primera regla que matchee (texto en minúscula y sin tildes)
const EXPENSE_CATEGORY_RULES = [
  ["Salud", /farmac|psicolog|odontolog|muela/],
  ["Educación", /da vinci|ingles|matricula|examen/],
  ["Servicios", /servicios|edenor|metrogas|internet|tuenti|personal/],
  ["Hogar", /alquiler|expensas|compras|carrito|carne|carniceria|verduleria|fiambreria|sabanas|air fryer|freidora|ferreteria|plomeria|gasista|cerrajeria|mudanza|cable de red|lonchera|tupper/],
  ["Ropa", /camperita|zapatillas/],
  ["Regalos", /regalo|reaglo|cumple/],
  ["Entretenimiento", /cine|fulbo|futbol|juego|finde|sabado|viernes|salida|netflix|youtube|asado|ano nuevo|porro|calistenia/],
  ["Comida", /almuerzo|cena|merienda|hamburguesa|helado|cafe|kiosco|chipa|medialuna|panaderia|comida|postre|cerveza/],
  ["Transporte", /sube|subte|uber|bici|monopatin|moto|casco|registro|cenat/],
];
const FALLBACK_CATEGORY = "Otros";

// Inversiones: categoría = instrumento, tipo = objetivo
const INVESTMENT_CATEGORY_RULES = [
  ["Dolar", /dolar|usd/],
  ["CEDEAR", /cedear|spy/],
  ["FCI", /fima|frasco/],
];
const INVESTMENT_TYPE_RULES = [["Corto Plazo", /fima|frasco/]];
const FALLBACK_INVESTMENT_TYPE = "Ahorro";

// Saldo arrastrado del mes anterior: no es plata nueva
const CARRYOVER = /^(sobrante|restante)\b/;

const normalize = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
const matchRule = (rules, text, fallback) => rules.find(([, re]) => re.test(normalize(text)))?.[0] ?? fallback;
const cellValue = (v) => (v && typeof v === "object" && !(v instanceof Date) ? (v.result ?? v.richText?.map((t) => t.text).join("") ?? v.text) : v);
const pad = (n) => String(n).padStart(2, "0");

function parseArgs(argv) {
  const args = { file: null, commit: false, sheet: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--commit") args.commit = true;
    else if (argv[i] === "--sheet") args.sheet = argv[++i];
    else args.file = argv[i];
  }
  if (!args.file) throw new Error('Falta la ruta del Excel. Ej: npm run import:excel -- "data/Balance 2026 - Lucas.xlsx"');
  return args;
}

function parseSheetMonth(name) {
  const [monthName, year] = normalize(name).split(/\s+/);
  const month = MONTHS.indexOf(monthName) + 1;
  if (!month || !/^\d{4}$/.test(year)) return null;
  const lastDay = new Date(Date.UTC(+year, month, 0)).getUTCDate();
  return { ym: `${year}-${pad(month)}`, startDate: `${year}-${pad(month)}-01`, endDate: `${year}-${pad(month)}-${lastDay}` };
}

function readTable(ws, table) {
  const [from, to] = table.tableRef.split(":");
  const start = ws.getCell(from);
  const end = ws.getCell(to);
  const rows = [];
  for (let r = start.row + 1; r <= end.row; r++) {
    const cells = [];
    for (let c = start.col; c <= end.col; c++) cells.push(cellValue(ws.getCell(r, c).value));
    if (cells.every((v) => v == null || v === "")) continue;
    rows.push({ row: r, cells });
  }
  return rows;
}

// Lee el workbook y devuelve los registros a crear, más las filas descartadas con su motivo
function extractRecords(wb, onlySheet) {
  const records = [];
  const skipped = [];

  for (const ws of wb.worksheets) {
    if (onlySheet && ws.name !== onlySheet) continue;
    const month = parseSheetMonth(ws.name);
    if (!month) {
      skipped.push(`Hoja "${ws.name}": nombre no reconocido como "<Mes> <Año>"`);
      continue;
    }

    for (const { table } of Object.values(ws.tables)) {
      const kind = /rescates/i.test(table.name) ? "rescate" : /^ingresos/i.test(table.name) ? "income" : /^gastos/i.test(table.name) ? "expense" : /^inversiones/i.test(table.name) ? "investment" : null;
      if (!kind) continue;

      for (const { row, cells } of readTable(ws, table)) {
        const [rawDate, rawDescription, amount, rawType] = cells;
        const where = `${ws.name} fila ${row} (${table.name})`;
        const description = String(rawDescription ?? "").trim();

        if (!(rawDate instanceof Date) || !description || typeof amount !== "number" || amount <= 0) {
          skipped.push(`${where}: datos incompletos ${JSON.stringify(cells)}`);
          continue;
        }
        if (kind === "income" && CARRYOVER.test(normalize(description))) {
          skipped.push(`${where}: saldo arrastrado "${description}"`);
          continue;
        }

        // ExcelJS devuelve las fechas como medianoche UTC
        let date = rawDate.toISOString().slice(0, 10);
        const originalDate = date.startsWith(month.ym) ? null : date;
        if (originalDate) date = month.startDate;

        const base = { sheet: ws.name, where, month, date, originalDate, amount: Math.round(amount) };

        if (kind === "expense") {
          const type = EXPENSE_TYPES[normalize(rawType ?? "")];
          if (!type) {
            skipped.push(`${where}: tipo de gasto desconocido "${rawType}"`);
            continue;
          }
          records.push({ ...base, kind, description, type, category: matchRule(EXPENSE_CATEGORY_RULES, description, FALLBACK_CATEGORY) });
        } else if (kind === "investment") {
          records.push({
            ...base,
            kind,
            description,
            category: matchRule(INVESTMENT_CATEGORY_RULES, description, FALLBACK_CATEGORY),
            type: matchRule(INVESTMENT_TYPE_RULES, description, FALLBACK_INVESTMENT_TYPE),
          });
        } else {
          records.push({ ...base, kind: "income", description: kind === "rescate" && !/^rescate/.test(normalize(description)) ? `Rescate: ${description}` : description });
        }
      }
    }
  }
  return { records, skipped };
}

function createApi(token) {
  return async function api(method, path, { body, params } = {}) {
    const url = new URL(path, API_URL);
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
      body: body && JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${await res.text()}`);
    return res.json();
  };
}

async function authenticate() {
  if (process.env.AUTH_TOKEN) return process.env.AUTH_TOKEN;
  const { IMPORT_EMAIL: email, IMPORT_PASSWORD: password } = process.env;
  if (!email || !password) throw new Error("Definí IMPORT_EMAIL e IMPORT_PASSWORD (o AUTH_TOKEN) para autenticarte contra la API");
  const { token } = await createApi(null)("POST", "/auth/login", { body: { email, password } });
  return token;
}

// Resuelve nombres a ids (sin distinguir mayúsculas/tildes) y crea los que falten
async function resolveCatalog(api, endpoint, names, commit, created) {
  const existing = await api("GET", endpoint);
  const byName = new Map(existing.map((item) => [normalize(item.name), item.id]));
  for (const name of names) {
    if (byName.has(normalize(name))) continue;
    created.push(`${endpoint}: "${name}"`);
    byName.set(normalize(name), commit ? (await api("POST", endpoint, { body: { name } })).id : `<nuevo ${name}>`);
  }
  return (name) => byName.get(normalize(name));
}

const ENDPOINTS = { expense: "/expenses", income: "/incomes", investment: "/investments" };
const recordKey = (date, amount, description) => `${date}|${amount}|${normalize(description)}`;

// Cuenta lo que ya existe por (fecha, monto, descripción) para no duplicar al re-ejecutar
async function loadExisting(api, months) {
  const counts = new Map();
  for (const { startDate, endDate } of months) {
    for (const [kind, endpoint] of Object.entries(ENDPOINTS)) {
      const items = await api("GET", endpoint, { params: { startDate, endDate } });
      for (const item of items) {
        const key = `${kind}|${recordKey(String(item.date).slice(0, 10), item.amount ?? item.amount_invested, item.description ?? "")}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
  }
  return counts;
}

function toPayload(record, ids) {
  // Mediodía UTC para que la columna @db.Date guarde el día correcto en cualquier zona horaria
  const date = `${record.date}T12:00:00.000Z`;
  if (record.kind === "expense") {
    return { description: record.description, amount: record.amount, date, typeId: ids.expenseType(record.type), categoryId: ids.expenseCategory(record.category) };
  }
  if (record.kind === "investment") {
    return {
      description: record.description,
      amount_invested: record.amount,
      current_value: record.amount,
      date,
      typeId: ids.investmentType(record.type),
      categoryId: ids.investmentCategory(record.category),
    };
  }
  return { description: record.description, amount: record.amount, date };
}

function printSummary(records, skipped) {
  const fmt = (n) => n.toLocaleString("es-AR");
  console.log("\nResumen por hoja:");
  const sheets = [...new Set(records.map((r) => r.sheet))];
  for (const sheet of sheets) {
    const rows = records.filter((r) => r.sheet === sheet);
    const sum = (kind) => rows.filter((r) => r.kind === kind).reduce((acc, r) => acc + r.amount, 0);
    const count = (kind) => rows.filter((r) => r.kind === kind).length;
    console.log(
      `  ${sheet.padEnd(16)} ingresos ${String(count("income")).padStart(2)} ($${fmt(sum("income"))})  gastos ${String(count("expense")).padStart(2)} ($${fmt(sum("expense"))})  inversiones ${count("investment")} ($${fmt(sum("investment"))})`,
    );
  }

  const tally = (list) => Object.entries(list.reduce((acc, k) => ({ ...acc, [k]: (acc[k] ?? 0) + 1 }), {})).map(([k, v]) => `${k} (${v})`).join(", ");
  const expenses = records.filter((r) => r.kind === "expense");
  const investments = records.filter((r) => r.kind === "investment");
  console.log(`\nCategorías de gasto: ${tally(expenses.map((r) => r.category))}`);
  console.log(`Tipos de gasto: ${tally(expenses.map((r) => r.type))}`);
  console.log(`Inversiones: ${investments.map((r) => `${r.description} → ${r.category}/${r.type}`).join("; ")}`);

  const uncategorized = [...new Set(expenses.filter((r) => r.category === FALLBACK_CATEGORY).map((r) => r.description))];
  if (uncategorized.length) console.log(`\nGastos sin regla (→ ${FALLBACK_CATEGORY}): ${uncategorized.join(", ")}`);

  const moved = records.filter((r) => r.originalDate);
  if (moved.length) {
    console.log("\nFechas movidas al mes de la hoja:");
    moved.forEach((r) => console.log(`  ${r.where}: ${r.originalDate} → ${r.date} "${r.description}"`));
  }
  if (skipped.length) {
    console.log("\nFilas omitidas:");
    skipped.forEach((s) => console.log(`  ${s}`));
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(args.file);

  if (args.sheet && !wb.getWorksheet(args.sheet)) throw new Error(`No existe la hoja "${args.sheet}"`);
  const { records, skipped } = extractRecords(wb, args.sheet);
  printSummary(records, skipped);

  const api = createApi(await authenticate());
  const created = [];
  const unique = (kind, field) => [...new Set(records.filter((r) => r.kind === kind).map((r) => r[field]))];
  const ids = {
    expenseType: await resolveCatalog(api, "/expenses-type", unique("expense", "type"), args.commit, created),
    expenseCategory: await resolveCatalog(api, "/expenses-category", unique("expense", "category"), args.commit, created),
    investmentType: await resolveCatalog(api, "/investment-type", unique("investment", "type"), args.commit, created),
    investmentCategory: await resolveCatalog(api, "/investment-category", unique("investment", "category"), args.commit, created),
  };
  if (created.length) console.log(`\n${args.commit ? "Creados" : "Se crearían"} en catálogos: ${created.join(", ")}`);

  const months = [...new Map(records.map((r) => [r.month.ym, r.month])).values()];
  const existing = await loadExisting(api, months);
  const pending = records.filter((r) => {
    const key = `${r.kind}|${recordKey(r.date, r.amount, r.description)}`;
    const left = existing.get(key) ?? 0;
    if (left > 0) existing.set(key, left - 1);
    return left === 0;
  });
  console.log(`\n${records.length} registros en el Excel, ${records.length - pending.length} ya existen en la base, ${pending.length} por crear.`);

  if (!args.commit) {
    console.log("\nDry-run: no se escribió nada. Volvé a correr con --commit para importar.");
    return;
  }

  let ok = 0;
  const failed = [];
  for (const record of pending) {
    try {
      await api("POST", ENDPOINTS[record.kind], { body: toPayload(record, ids) });
      ok++;
    } catch (error) {
      failed.push(`${record.where} "${record.description}": ${error.message}`);
    }
  }
  console.log(`\nImportados ${ok}/${pending.length}.`);
  if (failed.length) {
    console.log("Errores (re-ejecutar el script reintenta solo estos):");
    failed.forEach((f) => console.log(`  ${f}`));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`\nError: ${error.message}`);
  process.exit(1);
});
