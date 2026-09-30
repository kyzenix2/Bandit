import { copyButton, externalAction, h } from "./dom.js";

function tickerText(view) {
  return view.ticker ? `$${view.ticker}` : "";
}

function sectionHeading(number, title) {
  return h("div", { class: "section__head" }, [
    h("p", { class: "section__index", text: number }),
    h("h2", { text: title }),
  ]);
}

export function renderHeader(view) {
  return h("header", { class: "site-header" }, [
    h("div", { class: "wrap header__inner" }, [
      h("a", { class: "brand", href: "#top" }, [
        h("img", { class: "brand__logo", src: view.logo, alt: "" }),
        h("span", { class: "brand__name", text: view.name }),
      ]),
      h("nav", { class: "nav", "aria-label": "Page" }, [
        h("a", { href: "#about", text: "About" }),
        h("a", { href: "#how-to-buy", text: "How to buy" }),
        h("a", { href: "#chart", text: "Live chart" }),
        h("a", { href: "#join", text: "Join" }),
      ]),
      h("div", { class: "header__actions" }, [
        externalAction(view.buyUrl, "btn btn-pink", "Buy"),
        externalAction(view.chartUrl, "btn btn-ghost-light", "Chart"),
      ]),
    ]),
  ]);
}

export function renderHero(view) {
  const actions = h("div", { class: "hero__actions" }, [
    externalAction(view.buyUrl, "btn btn-pink", "Buy"),
    externalAction(view.chartUrl, "btn btn-ghost-light", "Chart"),
  ]);

  return h("section", { class: "hero", id: "top" }, [
    h("div", { class: "wrap" }, [
      h("img", { class: "hero__banner", src: view.banner, alt: view.name }),
      h("div", { class: "hero__copy" }, [
        h("h1", { text: view.name }),
        view.ticker ? h("p", { class: "hero__ticker", text: tickerText(view) }) : null,
        view.chainLabel ? h("p", { class: "hero__chain", text: view.chainLabel }) : null,
        view.slogan ? h("p", { class: "hero__slogan", text: view.slogan }) : null,
        actions,
      ]),
    ]),
  ]);
}

export function renderIdentity(view) {
  return h("section", { class: "identity", "aria-label": "Token" }, [
    h("div", { class: "wrap identity__inner" }, [
      h("img", { class: "identity__logo", src: view.logo, alt: "" }),
      h("div", { class: "identity__text" }, [
        h("p", { class: "identity__name", text: view.name }),
        view.ticker ? h("p", { class: "identity__ticker", text: tickerText(view) }) : null,
      ]),
      view.chainLabel ? h("p", { class: "identity__chain", text: view.chainLabel }) : null,
    ]),
  ]);
}

export function renderAbout(view) {
  return h("section", { class: "section", id: "about" }, [
    h("div", { class: "wrap" }, [
      sectionHeading("01", "About"),
      h("div", { class: "panel" }, [
        view.description ? h("p", { class: "about__text", text: view.description }) : null,
      ]),
    ]),
  ]);
}

export function renderHowToBuy(view) {
  const steps = view.steps.map((step) =>
    h("li", { class: "step" }, [
      h("span", { class: "step__n", text: step.n }),
      h("h3", { text: step.title }),
      step.href
        ? h("a", {
            class: "step__link",
            href: step.href,
            target: "_blank",
            rel: "noopener noreferrer",
            text: step.body,
          })
        : h("p", { text: step.body }),
    ]),
  );

  return h("section", { class: "section", id: "how-to-buy" }, [
    h("div", { class: "wrap" }, [
      sectionHeading("02", "How to buy"),
      h("ol", { class: "steps" }, steps),
    ]),
  ]);
}

export function renderContract(view) {
  const actions = h("div", { class: "contract__actions" }, [
    externalAction(view.explorerUrl, "btn btn-ghost", "Explorer"),
    copyButton(view, "btn btn-pink", "Copy"),
  ]);

  return h("section", { class: "section section--tight", id: "contract" }, [
    h("div", { class: "wrap" }, [
      h("div", { class: "panel contract" }, [
        h("div", { class: "contract__copy" }, [
          h("p", { class: "contract__label", text: "Contract" }),
          h("p", { class: "contract__ca", translate: "no", text: view.ca }),
        ]),
        actions,
      ]),
    ]),
  ]);
}

export function renderChart(view) {
  const frame = view.embedUrl
    ? h("iframe", {
        class: "chart__frame",
        src: view.embedUrl,
        title: "Live chart",
        loading: "lazy",
      })
    : h("div", { class: "chart__empty" }, [
        h("p", { text: "The chart shows here when the contract address is live." }),
      ]);

  return h("section", { class: "section", id: "chart" }, [
    h("div", { class: "wrap" }, [
      sectionHeading("03", "Live chart"),
      h("div", { class: "chart" }, [frame]),
    ]),
  ]);
}

export function renderJoin(view) {
  const links = view.socials.map((social) =>
    h("a", {
      class: "btn btn-pink",
      href: social.url,
      target: "_blank",
      rel: "noopener noreferrer",
      text: social.label,
    }),
  );

  return h("section", { class: "section", id: "join" }, [
    h("div", { class: "wrap" }, [
      sectionHeading("04", "Join us"),
      links.length ? h("div", { class: "join__links" }, links) : null,
    ]),
  ]);
}

export function renderFooter(view) {
  const parts = [view.name, tickerText(view), view.chainLabel].filter(Boolean);
  return h("footer", { class: "site-footer" }, [
    h("div", { class: "wrap" }, [h("p", { text: parts.join(" · ") })]),
  ]);
}

export function renderMobileBar(view) {
  const copySlot = view.caLive
    ? copyButton(view, "mobile-bar__btn", "Copy CA")
    : h("span", { class: "mobile-bar__slot is-inactive", text: "TBA" });

  return h("div", { class: "mobile-bar", "aria-label": "Token actions" }, [
    externalAction(view.buyUrl, "mobile-bar__slot", "Buy"),
    externalAction(view.chartUrl, "mobile-bar__slot", "Chart"),
    copySlot,
  ]);
}

export function mountPage(root, view) {
  document.title = view.name || document.title;
  const description = document.querySelector('meta[name="description"]');
  if (description && view.description) description.setAttribute("content", view.description);

  root.replaceChildren(
    renderHeader(view),
    h("main", {}, [
      renderHero(view),
      renderIdentity(view),
      renderAbout(view),
      renderHowToBuy(view),
      renderContract(view),
      renderChart(view),
      renderJoin(view),
    ]),
    renderFooter(view),
    renderMobileBar(view),
  );
}
