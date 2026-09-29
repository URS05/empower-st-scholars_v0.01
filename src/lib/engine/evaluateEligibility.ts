export type EligibilityResult = {
  rule: string;
  passed: boolean;
  reason: string;
};

export type EligibilityOutcome = {
  eligible: boolean;
  results: EligibilityResult[];
};

type ComparisonOperator = "eq" | "neq" | "lt" | "lte" | "gt" | "gte" | "in";

type Condition = {
  field?: string;
  operator?: string;
  value?: unknown;
};

type EligibilityRule = {
  id?: string;
  rule?: string;
  field?: string;
  operator?: string;
  value?: unknown;
  conditions?: Condition[];
};

type SchemeConfig = {
  eligibilityRules?: EligibilityRule[];
  eligibility?: EligibilityRule[];
};

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function getByPath(source: unknown, path: string): unknown {
  if (source == null || typeof source !== "object") return undefined;
  return path.split(".").reduce<unknown>((current, key) => {
    if (current == null || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[key];
  }, source);
}

function readField(application: Record<string, unknown>, field: string): unknown {
  const aliases: Record<string, string[]> = {
    category: ["category", "caste", "casteCategory"],
    annualFamilyIncome: ["annualFamilyIncome", "familyIncome", "income"],
    ugcRecognized: ["ugcRecognized", "ugcRecognised", "ugcUniversity"],
    otherFellowshipActive: ["otherFellowshipActive", "hasOtherFellowship", "activeFellowship"],
    qsWorldRank: ["qsWorldRank", "qsRank", "universityQsRank"],
    studyLocation: ["studyLocation", "studyDestination", "location"],
    programmeLevel: ["programmeLevel", "programLevel", "courseLevel"],
    age: ["age"],
  };

  for (const candidate of aliases[field] ?? [field]) {
    const value = getByPath(application, candidate);
    if (value !== undefined && value !== null && value !== "") return value;
  }

  return undefined;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function asString(value: unknown): string {
  return String(value).trim().toLowerCase();
}

function formatDisplay(value: unknown): string {
  if (value === undefined || value === null || value === "") return "not provided";
  if (typeof value === "boolean") return value ? "yes" : "no";
  const numeric = asNumber(value);
  if (numeric != null && numeric >= 1000) return inr.format(numeric);
  return String(value);
}

function compare(actual: unknown, operator: ComparisonOperator, expected: unknown): boolean {
  if (actual === undefined || actual === null || actual === "") return false;

  if (operator === "in") {
    const allowed = Array.isArray(expected) ? expected : [expected];
    return allowed.some((item) => asString(item) === asString(actual));
  }

  if (operator === "eq") {
    if (typeof expected === "boolean" || typeof actual === "boolean") {
      return Boolean(actual) === Boolean(expected);
    }
    return asString(actual) === asString(expected);
  }

  if (operator === "neq") {
    if (typeof expected === "boolean" || typeof actual === "boolean") {
      return Boolean(actual) !== Boolean(expected);
    }
    return asString(actual) !== asString(expected);
  }

  const left = asNumber(actual);
  const right = asNumber(expected);
  if (left == null || right == null) return false;

  if (operator === "lt") return left < right;
  if (operator === "lte") return left <= right;
  if (operator === "gt") return left > right;
  if (operator === "gte") return left >= right;
  return false;
}

function conditionLabel(field: string | undefined): string {
  const labels: Record<string, string> = {
    category: "Category",
    annualFamilyIncome: "Annual family income",
    ugcRecognized: "UGC recognised enrolment",
    otherFellowshipActive: "Other active fellowship",
    age: "Age",
    qsWorldRank: "QS world rank",
    studyLocation: "Study location",
    programmeLevel: "Programme level",
  };
  return field ? (labels[field] ?? field) : "Value";
}

function operatorPhrase(operator: ComparisonOperator, expected: unknown): string {
  if (operator === "in") {
    const allowed = Array.isArray(expected) ? expected.map(String).join(" or ") : String(expected);
    return `must be ${allowed}`;
  }
  if (operator === "eq") return `must be ${formatDisplay(expected)}`;
  if (operator === "neq") return `must not be ${formatDisplay(expected)}`;
  if (operator === "lt") return `must be below ${formatDisplay(expected)}`;
  if (operator === "lte") return `must be ${formatDisplay(expected)} or lower`;
  if (operator === "gt") return `must be above ${formatDisplay(expected)}`;
  if (operator === "gte") return `must be ${formatDisplay(expected)} or higher`;
  return `must match ${formatDisplay(expected)}`;
}

function evaluateCondition(
  application: Record<string, unknown>,
  condition: Condition,
): { passed: boolean; reason: string } {
  const operator = (condition.operator ?? "eq") as ComparisonOperator;
  const field = condition.field ?? "";
  const actual = readField(application, field);
  const passed = compare(actual, operator, condition.value);
  const label = conditionLabel(field);

  if (actual === undefined || actual === null || actual === "") {
    return {
      passed: false,
      reason: `${label} is not provided, so this requirement cannot be confirmed.`,
    };
  }

  if (passed) {
    return {
      passed: true,
      reason: `${label} is ${formatDisplay(actual)}, which ${operatorPhrase(operator, condition.value)}.`,
    };
  }

  return {
    passed: false,
    reason: `${label} is ${formatDisplay(actual)}, but it ${operatorPhrase(operator, condition.value)}.`,
  };
}

function evaluateRule(application: Record<string, unknown>, rule: EligibilityRule): EligibilityResult {
  const title = rule.rule ?? rule.id ?? "Eligibility rule";

  if ((rule.operator === "all" || rule.operator === "any") && Array.isArray(rule.conditions)) {
    const parts = rule.conditions.map((condition) => evaluateCondition(application, condition));
    const passed =
      rule.operator === "all" ? parts.every((part) => part.passed) : parts.some((part) => part.passed);
    const failed = parts.filter((part) => !part.passed);
    const reason = passed
      ? parts.map((part) => part.reason).join(" ")
      : failed.map((part) => part.reason).join(" ");
    return { rule: title, passed, reason };
  }

  const result = evaluateCondition(application, rule);
  return { rule: title, passed: result.passed, reason: result.reason };
}

export function evaluateEligibility(application: any, scheme: any): EligibilityOutcome {
  const config = (scheme ?? {}) as SchemeConfig;
  const rules = config.eligibilityRules ?? config.eligibility ?? [];
  const record =
    application && typeof application === "object" ? (application as Record<string, unknown>) : {};

  const results = rules.map((rule) => evaluateRule(record, rule));
  return {
    eligible: results.length > 0 && results.every((result) => result.passed),
    results,
  };
}
