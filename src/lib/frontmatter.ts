export type FrontmatterValue = string | string[];
export type FrontmatterData = Record<string, FrontmatterValue>;

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export function parseFrontmatter(raw: string): { data: FrontmatterData; content: string } {
  const match = raw.match(FRONTMATTER_PATTERN);
  if (!match) {
    return { data: {}, content: raw };
  }

  return {
    data: parseFrontmatterBlock(match[1]),
    content: match[2].replace(/^\r?\n/, ""),
  };
}

function parseFrontmatterBlock(block: string): FrontmatterData {
  const data: FrontmatterData = {};

  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;

    const value = parseValue(match[2].trim());
    if (value !== undefined) {
      data[match[1]] = value;
    }
  }

  return data;
}

function parseValue(raw: string): FrontmatterValue | undefined {
  if (!raw || raw.startsWith("&") || raw.startsWith("*")) return undefined;

  const quoted = raw.match(/^["'](.*)["']$/);
  if (quoted) return quoted[1].replace(/\\"/g, '"');

  const array = raw.match(/^\[(.*)\]$/);
  if (array) {
    const inner = array[1].trim();
    if (!inner) return [];
    return inner
      .split(",")
      .map((item) => item.trim())
      .map((item) => item.replace(/^["'](.*)["']$/, "$1"))
      .filter(Boolean);
  }

  return raw;
}
