export function h(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else node.setAttribute(key, value);
  }
  for (const child of [].concat(children)) {
    if (child == null || child === false) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

export function externalAction(url, className, text) {
  if (!url) {
    return h("span", { class: `${className} is-inactive`, text });
  }
  return h("a", {
    class: className,
    href: url,
    target: "_blank",
    rel: "noopener noreferrer",
    text,
  });
}

async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.append(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

export function copyButton(view, className, label) {
  if (!view.caLive) return null;
  const button = h("button", { class: className, type: "button", text: label });
  button.addEventListener("click", async () => {
    const ok = await writeClipboard(view.ca);
    button.textContent = ok ? "Copied" : label;
    window.setTimeout(() => {
      button.textContent = label;
    }, 1600);
  });
  return button;
}
