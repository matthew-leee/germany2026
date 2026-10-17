"""Acceptance test suite for the Munich & Bavaria trip planner deliverable.

Validates ``index.html`` (repository root) against every requirement recorded in
the authoritative vision source:

    C:/Users/mattC/Documents/Knowledge/Projects/munich-trip-2026/Vision.md

Requirement coverage
--------------------
REQ-01  Inbound rail logistics (TGV INOUI 2362 + 9577, Fri 13 Nov 2026) ... REQ-01
REQ-02  Timehouse Munich accommodation & the 22:30 check-in trap ......... REQ-02
REQ-03  Outbound flight (Thu 19 Nov 2026, 10:00 AM, MUC) ................. REQ-03
REQ-04  Mandatory day trips (Neuschwanstein Sun 15 Nov + Dachau Mon 16 Nov) REQ-04
REQ-05  Mandatory Christmas market (Residenz Kaiserhof) ................. REQ-05
REQ-06  Interests: delicacies, beer, must-sees, neighborhoods, museum
        budget and the four dedicated trails (bakeries/wine/antiques/
        cameras) ........................................................ REQ-06
REQ-07  Bavarian transport & ticketing survival guide ................... REQ-07
REQ-08  HK first-timer to Germany hiccups ............................... REQ-08
REQ-09  Interactive, responsive, self-contained HTML5 deliverable with
        verified local photographs (also the file/validity/image checks) . REQ-09

How matching works
------------------
* Content is matched against a *normalized corpus*: the rendered text plus all
  attribute values of ``index.html`` (HTML entities decoded, case-folded,
  German umlauts transliterated ``ae/oe/ue``, remaining accents stripped,
  dashes unified, whitespace collapsed).  This makes e.g. "München" and
  "Muenchen", "Weißwurst" and "Weisswurst", "Käsespätzle" and
  "Kaesespaetzle" interchangeable.
* ``lit``/``seq``/``alt`` build tolerant regex fragments; ``near`` requires a
  group of facts to co-occur inside a character window (order independent), so
  tables, cards and inline markup do not break the assertions.
* Time and money helpers accept the common German/English formatting variants
  (``16:45``/``16.45``, ``€4.20``/``4,20 EUR``/``4.20 €``).

Run with::

    python -m pytest tests/test_trip_planner.py -q
"""

from __future__ import annotations

import re
import unicodedata
from functools import lru_cache
from html.parser import HTMLParser
from pathlib import Path

import pytest

# ---------------------------------------------------------------------------
# Project paths and constants
# ---------------------------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent
INDEX_HTML = PROJECT_ROOT / "index.html"
IMAGES_DIR = PROJECT_ROOT / "assets" / "images"

# Requirement: every referenced local image must be an existing non-empty file
# strictly larger than 10 KB.
MIN_IMAGE_BYTES = 10 * 1024

IMAGE_REF_RE = re.compile(
    r"assets[\\/]+images[\\/][A-Za-z0-9_\-./ %]+\.(?:jpe?g|png|webp|gif|bmp|avif|svg)",
    re.IGNORECASE,
)

# Well-known Munich museums that are *outside* the curated 1-2 museum budget of
# REQ-06 (which allows the Residenz Antiquarium/Schatzkammer plus the Deutsches
# Museum photography/optics section or the Leica Galerie only).
OUT_OF_BUDGET_MUSEUMS = {
    "Alte Pinakothek": r"alte\s+pinakothek",
    "Neue Pinakothek": r"neue\s+pinakothek",
    "Pinakothek der Moderne": r"pinakothek\s+der\s+moderne",
    "Museum Brandhorst": r"brandhorst",
    "Lenbachhaus": r"lenbachhaus",
    "Haus der Kunst": r"haus\s+der\s+kunst",
    "Glyptothek": r"glyptothek",
    "Stadtmuseum": r"stadtmuseum",
    "BMW Museum / BMW Welt": r"bmw\s+(?:museum|welt)",
    "NS-Dokumentationszentrum": r"dokumentationszentrum",
    "Jüdisches Museum": r"j(?:ue|u)disches?\s+museum",
    "Museum Mensch und Natur": r"mensch\s+und\s+natur",
    "Paläontologisches Museum": r"pal(?:ae|a)ontologisches?\s+museum",
    "Ägyptisches Museum": r"(?:ae|a)gyptisches?\s+museum",
    "Schack-Galerie": r"schack",
}


# ---------------------------------------------------------------------------
# Text normalization
# ---------------------------------------------------------------------------

_WHITESPACE_RE = re.compile(r"\s+")
_UMLAUT_TRANSLATION = str.maketrans(
    {"ä": "ae", "ö": "oe", "ü": "ue", "Ä": "ae", "Ö": "oe", "Ü": "ue", "ß": "ss"}
)
_DASH_TRANSLATION = str.maketrans(
    {ch: "-" for ch in "\u2010\u2011\u2012\u2013\u2014\u2015\u2043\u2212"}
)


def fold(text: str) -> str:
    """Normalize *text* for tolerant matching (see module docstring)."""
    text = unicodedata.normalize("NFC", text)
    text = text.casefold()
    text = text.translate(_UMLAUT_TRANSLATION)
    # Strip remaining accents (e.g. Café -> cafe) after the German umlaut
    # transliteration so ae/oe/ue digraphs survive.
    text = unicodedata.normalize("NFKD", text)
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = text.translate(_DASH_TRANSLATION)
    text = text.replace("\u00a0", " ")
    return _WHITESPACE_RE.sub(" ", text).strip()


# ---------------------------------------------------------------------------
# Matching engine
# ---------------------------------------------------------------------------


class Match:
    """A content requirement expressed as a predicate over the corpus."""

    def matches(self, corpus: str) -> bool:  # pragma: no cover - abstract
        raise NotImplementedError


class Re(Match):
    """Regex fragment searched anywhere in the corpus."""

    def __init__(self, pattern: str, flags: int = 0) -> None:
        self.pattern = pattern
        self.flags = flags

    def matches(self, corpus: str) -> bool:
        if not corpus:
            return False
        return re.search(self.pattern, corpus, self.flags | re.IGNORECASE) is not None


class Near(Match):
    """All terms must co-occur within ``window`` characters (order free)."""

    def __init__(self, terms: list[Re], window: int) -> None:
        self.terms = terms
        self.window = window

    def matches(self, corpus: str) -> bool:
        if not corpus:
            return False
        spans: list[list[tuple[int, int]]] = []
        for term in self.terms:
            found = [
                m.span()
                for m in re.finditer(term.pattern, corpus, term.flags | re.IGNORECASE)
            ]
            if not found:
                return False
            spans.append(found)
        for start, end in spans[0]:
            low, high = start - self.window, end + self.window
            if all(
                any(a >= low and b <= high for a, b in other) for other in spans[1:]
            ):
                return True
        return False


class AnyOf(Match):
    """At least one alternative must match."""

    def __init__(self, *matchers: Match) -> None:
        self.matchers = matchers

    def matches(self, corpus: str) -> bool:
        return any(m.matches(corpus) for m in self.matchers)


class AllOf(Match):
    """Every alternative must match."""

    def __init__(self, *matchers: Match) -> None:
        self.matchers = matchers

    def matches(self, corpus: str) -> bool:
        return all(m.matches(corpus) for m in self.matchers)


def lit(text: str) -> Re:
    """Literal text, normalized and escaped."""
    return Re(re.escape(fold(text)))


def seq(*parts: "Re | str", gap: str = r"\W{0,14}") -> Re:
    """Ordered sequence of literal/regex parts separated by a flexible gap."""
    frags = [p.pattern if isinstance(p, Re) else re.escape(fold(p)) for p in parts]
    return Re(gap.join(frags))


def alt(*parts: "Re | str") -> Re:
    """Regex alternation over literal/regex parts."""
    frags = [p.pattern if isinstance(p, Re) else re.escape(fold(p)) for p in parts]
    return Re("(?:" + "|".join(frags) + ")")


def near(*terms: "Re | str", window: int = 120) -> Near:
    """Co-occurrence of all terms inside a ``window`` character span."""
    frags = [t if isinstance(t, Re) else lit(t) for t in terms]
    return Near(frags, window)


def hhmm(value: str) -> Re:
    """Time such as ``16:45``, tolerant of ``16.45`` and optional hour zero."""
    hour, minute = value.split(":")
    return Re(rf"\b0?{int(hour)}[:.]{minute}\b")


def money(amount: str) -> Re:
    """Euro amount such as ``4.20``/``44``; tolerant of comma decimals and
    ``€`` before or after the number, or the ``EUR`` suffix."""
    number = amount.replace(".", r"[.,]")
    if "[.,]" not in number:
        number += r"(?:[.,]00)?"
    return Re(
        r"(?:(?:\u20ac|eur\b\.?)\s*" + number + r"|" + number + r"\s*(?:\u20ac|eur\b\.?))"
    )


def nov_date(day: int) -> Re:
    """A November 2026 date in day-first, month-first or numeric form.

    The year is optional (some calendar lines omit it), the November month
    reference is not.
    """
    d = rf"\b{day}\b"
    year = r"(?:\W{0,14}2026)?"
    return Re(
        rf"(?:{d}\W{{0,14}}nov(?:ember)?{year}"
        rf"|nov(?:ember)?\W{{0,14}}{d}{year}"
        rf"|{d}[./-]11[./-]2026)"
    )


_WEEKDAYS = {
    "mon": r"mon(?:day)?|montag",
    "tue": r"tue(?:sday)?|dienstag",
    "wed": r"wed(?:nesday)?|mittwoch",
    "thu": r"thu(?:rsday)?|donnerstag",
    "fri": r"fri(?:day)?|freitag",
    "sat": r"sat(?:urday)?|samstag|sonnabend",
    "sun": r"sun(?:day)?|sonntag",
}


def weekday(key: str) -> Re:
    return Re(r"\b(?:" + _WEEKDAYS[key] + r")\b")


def on_weekday(key: str, day: int) -> Re:
    """Weekday and date occurring together (either order)."""
    w = weekday(key).pattern
    d = nov_date(day).pattern
    return Re(rf"(?:{w}\W{{0,30}}{d}|{d}\W{{0,30}}{w})")


# ---------------------------------------------------------------------------
# HTML page inspection
# ---------------------------------------------------------------------------

_VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
}
# Tags whose end tag may legally be omitted in HTML5.
_OPTIONAL_END_TAGS = {
    "html", "head", "body", "li", "dt", "dd", "p", "rt", "rp", "optgroup",
    "option", "thead", "tbody", "tfoot", "tr", "td", "th",
}


class _PageParser(HTMLParser):
    """Collects the normalized corpus plus structural HTML5 information."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.tags: set[str] = set()
        self.ids: list[str] = []
        self.imgs: list[dict[str, str]] = []
        self.scripts: list[dict[str, str]] = []
        self.links: list[dict[str, str]] = []
        self.title_parts: list[str] = []
        self.structure_errors: list[str] = []
        self._stack: list[tuple[str, tuple[int, int]]] = []
        self._in_title = False

    # -- content ---------------------------------------------------------
    def handle_data(self, data: str) -> None:
        self.parts.append(data)
        if self._in_title:
            self.title_parts.append(data)

    def handle_starttag(self, tag: str, attrs) -> None:
        attr_map = {k: (v or "") for k, v in attrs}
        self.tags.add(tag)
        self.parts.extend(v for v in attr_map.values() if v)
        if "id" in attr_map and attr_map["id"]:
            self.ids.append(attr_map["id"])
        if tag == "img":
            self.imgs.append(attr_map)
        elif tag == "script":
            self.scripts.append(attr_map)
        elif tag == "link":
            self.links.append(attr_map)
        elif tag == "title":
            self._in_title = True

        if tag in _VOID_TAGS:
            return
        # HTML5 allows <li><li>, <p><p> style implicit closing of the same
        # optional-end-tag element.
        if self._stack and self._stack[-1][0] == tag and tag in _OPTIONAL_END_TAGS:
            self._stack.pop()
        self._stack.append((tag, self.getpos()))

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False
        if tag in _VOID_TAGS:
            return
        if self._stack and self._stack[-1][0] == tag:
            self._stack.pop()
            return
        for index in range(len(self._stack) - 1, -1, -1):
            if self._stack[index][0] == tag:
                implicitly_closed = [t for t, _ in self._stack[index + 1:]]
                illegal = [t for t in implicitly_closed if t not in _OPTIONAL_END_TAGS]
                if illegal:
                    self.structure_errors.append(
                        f"</{tag}> implicitly closes non-optional tags {illegal}"
                    )
                del self._stack[index:]
                return
        if tag not in _OPTIONAL_END_TAGS:
            self.structure_errors.append(f"unmatched closing tag </{tag}>")

    def finish(self) -> None:
        for tag, pos in self._stack:
            if tag not in _OPTIONAL_END_TAGS:
                self.structure_errors.append(f"unclosed <{tag}> opened at {pos}")


class Page:
    """Parsed ``index.html`` (or an empty page when the file is missing)."""

    def __init__(self) -> None:
        self.exists = INDEX_HTML.is_file()
        self.source = ""
        self.corpus = ""
        self.parser = _PageParser()
        if not self.exists:
            return
        self.source = INDEX_HTML.read_text(encoding="utf-8", errors="replace")
        self.parser = _PageParser()
        self.parser.feed(self.source)
        self.parser.close()
        self.parser.finish()
        self.corpus = fold(" ".join(self.parser.parts))

    # -- convenience accessors -------------------------------------------
    @property
    def tags(self) -> set[str]:
        return self.parser.tags

    @property
    def imgs(self) -> list[dict[str, str]]:
        return self.parser.imgs

    @property
    def title(self) -> str:
        return "".join(self.parser.title_parts).strip()

    @property
    def structure_errors(self) -> list[str]:
        return self.parser.structure_errors


@lru_cache(maxsize=1)
def load_page() -> Page:
    return Page()


@pytest.fixture(scope="session")
def page() -> Page:
    return load_page()


def assert_match(matcher: Match, description: str, page: Page) -> None:
    """Assert that a requirement fact is present, with an actionable message."""
    assert matcher.matches(page.corpus), (
        f"Missing required content: {description}."
        + ("" if page.exists else " (index.html does not exist yet)")
    )


# ---------------------------------------------------------------------------
# Local image reference collection
# ---------------------------------------------------------------------------


def local_image_refs() -> list[str]:
    """Every ``assets/images/...`` reference in the page (markup or JS data)
    plus any other local ``<img src>`` target, as root-relative posix paths."""
    page = load_page()
    if not page.exists:
        return []
    refs: set[str] = set()
    for match in IMAGE_REF_RE.finditer(page.source):
        ref = match.group(0).replace("\\", "/")
        while ref.startswith("./"):
            ref = ref[2:]
        refs.add(ref.lstrip("/").split("?")[0].split("#")[0])
    for img in page.imgs:
        src = img.get("src", "").strip()
        if not src or re.match(r"^(?:https?:|data:|mailto:|#)", src, re.IGNORECASE):
            continue
        ref = src.replace("\\", "/")
        while ref.startswith("./"):
            ref = ref[2:]
        refs.add(ref.lstrip("/").split("?")[0].split("#")[0])
    return sorted(refs)


def resolve_ref(ref: str) -> Path:
    return (PROJECT_ROOT / ref).resolve()


# ---------------------------------------------------------------------------
# REQ-09: file existence, HTML5 validity, verified local images
# ---------------------------------------------------------------------------


def test_index_html_exists() -> None:
    """REQ-09: the deliverable `index.html` exists in the repository root."""
    assert INDEX_HTML.is_file(), f"index.html not found at {INDEX_HTML}"


def test_index_html_declares_html5_doctype(page: Page) -> None:
    """REQ-09: the document starts with a HTML5 doctype."""
    assert page.exists, f"index.html not found at {INDEX_HTML}"
    assert re.match(r"\s*<!doctype\s+html\s*>", page.source, re.IGNORECASE), (
        "index.html must start with '<!DOCTYPE html>' (HTML5)"
    )


def test_index_html_has_required_document_structure(page: Page) -> None:
    """REQ-09: html/head/title/meta charset/body structure is present."""
    assert page.exists, f"index.html not found at {INDEX_HTML}"
    missing = sorted({"html", "head", "title", "body", "meta"} - page.tags)
    assert not missing, f"HTML5 structural elements missing from index.html: {missing}"
    assert page.title, "<title> must not be empty"
    assert re.search(r"charset\s*=\s*[\"']?utf-?8", page.source, re.IGNORECASE), (
        "index.html must declare <meta charset=\"utf-8\">"
    )


def test_index_html_is_well_formed(page: Page) -> None:
    """REQ-09: tags are balanced/matched (HTML5 optional end tags tolerated)."""
    assert page.exists, f"index.html not found at {INDEX_HTML}"
    assert not page.structure_errors, (
        "index.html is not well-formed HTML5: " + "; ".join(page.structure_errors)
    )


def test_index_html_has_no_duplicate_ids(page: Page) -> None:
    """REQ-09: no duplicate id attributes (HTML5 validity)."""
    assert page.exists, f"index.html not found at {INDEX_HTML}"
    ids = page.parser.ids
    duplicates = sorted({i for i in ids if ids.count(i) > 1})
    assert not duplicates, f"duplicate id attributes in index.html: {duplicates}"


def test_index_html_images_have_alt_text(page: Page) -> None:
    """REQ-09: every <img> carries a non-empty alt attribute (HTML5 validity)."""
    assert page.exists, f"index.html not found at {INDEX_HTML}"
    assert page.imgs, "index.html contains no <img> elements at all"
    missing_alt = [
        img.get("src", "<unknown>") for img in page.imgs if not img.get("alt", "").strip()
    ]
    assert not missing_alt, f"<img> elements without alt text: {missing_alt}"


def test_no_missing_local_image_references() -> None:
    """REQ-09: zero missing local assets/images references (markup or JS data)."""
    refs = local_image_refs()
    assert refs, "index.html references no local assets/images/... files at all"
    missing = [ref for ref in refs if not resolve_ref(ref).is_file()]
    assert not missing, (
        "Broken local image references in index.html "
        f"({len(missing)} of {len(refs)} missing on disk): {missing}"
    )


def test_local_images_are_non_empty_over_10kb() -> None:
    """REQ-09: every referenced local image is a non-empty file > 10 KB."""
    refs = local_image_refs()
    assert refs, "index.html references no local assets/images/... files at all"
    bad: list[str] = []
    for ref in refs:
        path = resolve_ref(ref)
        if not path.is_file():
            bad.append(f"{ref} (missing)")
            continue
        size = path.stat().st_size
        if size <= MIN_IMAGE_BYTES:
            bad.append(f"{ref} ({size} bytes)")
    assert not bad, (
        "Referenced local images must be non-empty files larger than "
        f"{MIN_IMAGE_BYTES} bytes: {bad}"
    )


def test_local_images_have_valid_image_signatures() -> None:
    """REQ-09: referenced local images are real image files (magic bytes)."""
    refs = local_image_refs()
    assert refs, "index.html references no local assets/images/... files at all"
    signatures = (
        (b"\xff\xd8\xff", "jpeg"),
        (b"\x89PNG", "png"),
        (b"GIF8", "gif"),
        (b"BM", "bmp"),
        (b"RIFF", "webp/riff"),
    )
    bad: list[str] = []
    for ref in refs:
        path = resolve_ref(ref)
        if not path.is_file():
            bad.append(f"{ref} (missing)")
            continue
        head = path.read_bytes()[:16]
        if not any(head.startswith(magic) for magic, _ in signatures):
            bad.append(f"{ref} (no known image signature: {head[:4]!r})")
        if head.startswith(b"RIFF") and head[8:12] != b"WEBP":
            bad.append(f"{ref} (RIFF container without WEBP chunk)")
    assert not bad, f"Referenced local files are not valid images: {bad}"


_REQ09_IMAGE_CATEGORIES = {
    "hotel": ["assets/images/timehouse_room.jpg", "assets/images/timehouse_kitchen.webp"],
    "attractions": [
        "assets/images/neuschwanstein.jpg",
        "assets/images/dachau.jpg",
        "assets/images/marienplatz.jpg",
        "assets/images/odeonsplatz.jpg",
        "assets/images/englischer_garten.jpg",
        "assets/images/chinesischer_turm.jpg",
        "assets/images/residenz_christmas.jpg",
    ],
    "restaurants_food": [
        "assets/images/weisswurst.jpg",
        "assets/images/schweinshaxe.jpg",
        "assets/images/kaesespaetzle.jpg",
        "assets/images/obatzda.jpg",
        "assets/images/kaiserschmarrn.jpg",
        "assets/images/schmalznudel.jpg",
    ],
    "bakeries": ["assets/images/sourdough_bakery.jpg"],
    "wine_and_beer": [
        "assets/images/franken_wine.jpg",
        "assets/images/augustiner.jpg",
        "assets/images/hofbrauhaus.jpg",
    ],
    "camera_shops": ["assets/images/leica_camera.jpg"],
    "antique_shops": ["assets/images/antique_market.jpg"],
    "museums": [
        "assets/images/residenz_antiquarium.jpg",
        "assets/images/deutsches_museum.jpg",
    ],
    "neighborhoods": [
        "assets/images/haidhausen.jpg",
        "assets/images/alte_utting.jpg",
        "assets/images/schwabing.jpg",
    ],
    "rail": ["assets/images/tgv_train.jpg"],
}


@pytest.mark.parametrize(
    "category,accepted",
    sorted(_REQ09_IMAGE_CATEGORIES.items()),
    ids=sorted(_REQ09_IMAGE_CATEGORIES),
)
def test_req09_image_category_coverage(category: str, accepted: list[str]) -> None:
    """REQ-09: verified photographs for hotel, attractions, restaurants,
    bakeries, wine/beer spots, camera/antique shops and museums."""
    refs = set(local_image_refs())
    used = sorted(set(accepted) & refs)
    assert used, (
        f"REQ-09 requires at least one verified photograph for '{category}' "
        f"(accepted files: {accepted}); none of them is referenced in index.html"
    )


def test_req09_responsive_viewport_meta(page: Page) -> None:
    """REQ-09: responsive layout requires a viewport meta tag."""
    assert page.exists, f"index.html not found at {INDEX_HTML}"
    assert re.search(
        r"<meta[^>]*name\s*=\s*[\"']viewport[\"'][^>]*>", page.source, re.IGNORECASE
    ), "index.html must declare <meta name=\"viewport\" ...> for responsive layout"
    assert re.search(
        r"width\s*=\s*device-width", page.source, re.IGNORECASE
    ), "viewport meta must include width=device-width for responsive layout"


def test_req09_is_self_contained_without_external_dependencies(page: Page) -> None:
    """REQ-09: self-contained deliverable - no remote scripts, styles, fonts,
    images or CSS @import/url() dependencies."""
    assert page.exists, f"index.html not found at {INDEX_HTML}"
    problems: list[str] = []
    for script in page.parser.scripts:
        src = script.get("src", "")
        if src.startswith(("http://", "https://", "//")):
            problems.append(f"external <script src={src!r}>")
    for link in page.parser.links:
        href = link.get("href", "")
        if href.startswith(("http://", "https://", "//")):
            problems.append(f"external <link href={href!r}>")
    for img in page.imgs:
        src = img.get("src", "")
        if src.startswith(("http://", "https://", "//")):
            problems.append(f"external <img src={src!r}>")
    for match in re.finditer(
        r"(?:@import\s+|url\(\s*)[\"']?(https?:)?//[^\s)\"']+", page.source, re.IGNORECASE
    ):
        problems.append(f"external CSS resource {match.group(0)!r}")
    assert not problems, (
        "index.html must be self-contained; remove external dependencies: "
        + "; ".join(problems)
    )


def test_req09_has_interactive_javascript(page: Page) -> None:
    """REQ-09: the deliverable is interactive (client-side JavaScript)."""
    assert page.exists, f"index.html not found at {INDEX_HTML}"
    has_script = bool(page.parser.scripts)
    has_behaviour = re.search(
        r"addEventListener|querySelector|getElementById|classList|onclick|"
        r"matchMedia|scrollIntoView",
        page.source,
    )
    assert has_script, "index.html must contain <script> elements (interactive app)"
    assert has_behaviour, (
        "index.html JavaScript must actually interact with the DOM "
        "(addEventListener/querySelector/... not found)"
    )


# ---------------------------------------------------------------------------
# REQ-01: inbound rail (TGV INOUI 2362 + 9577, Fri 13 Nov 2026)
# ---------------------------------------------------------------------------

MUNICH_HBF = seq(alt("München", "Munich"), alt("Hbf", "Hauptbahnhof"), gap=r"\W{0,8}")

REQ01_CHECKS = [
    ("date_fri_13_nov_2026",
     "inbound travel date Friday 13 Nov 2026",
     on_weekday("fri", 13)),
    ("tgv_2362",
     "TGV INOUI 2362 leg 1 train number",
     near("TGV", Re(r"\b2362\b"), window=80)),
    ("leg1_times_colmar_strasbourg",
     "16:45 Colmar -> 17:12 Strasbourg departure/arrival times",
     near("Colmar", hhmm("16:45"), hhmm("17:12"), "Strasbourg", window=180)),
    ("leg1_coach_seats",
     "TGV 2362 Coach 13 with seats 308 & 307",
     near(Re(r"\b2362\b"), Re(r"coach\W{0,5}13\b"), Re(r"\b308\b"), Re(r"\b307\b"),
          window=280)),
    ("strasbourg_transfer_34_min",
     "34-minute transfer at Strasbourg",
     near("Strasbourg", Re(r"transfer\w*|umstieg\w*|connection\w*|correspondance|change"),
          Re(r"\b34\b"), Re(r"min"), window=220)),
    ("tgv_9577",
     "TGV INOUI 9577 leg 2 train number",
     near("TGV", Re(r"\b9577\b"), window=80)),
    ("leg2_times_strasbourg_munich",
     "17:46 Strasbourg -> 21:46 München Hbf departure/arrival times",
     near("Strasbourg", hhmm("17:46"), hhmm("21:46"), MUNICH_HBF, window=200)),
    ("leg2_coach13_lower_deck",
     "TGV 9577 Coach 13 on the lower deck",
     near(Re(r"\b9577\b"), Re(r"coach\W{0,5}13\b"),
          Re(r"lower\s*deck|unter\w*\s*deck\w*|lower\s*level|untere\s*ebene"),
          window=280)),
    ("leg2_seats_304_305",
     "TGV 9577 seats 304 & 305",
     near(Re(r"\b9577\b"), Re(r"\b304\b"), Re(r"\b305\b"), window=280)),
    ("first_class",
     "1st Class booking on the TGV legs",
     near("TGV", Re(r"1st\s*class|erste\s*klasse|1\.\s*klasse|premiere\s*classe"),
          window=200)),
]


# ---------------------------------------------------------------------------
# REQ-02: Timehouse Munich accommodation
# ---------------------------------------------------------------------------

REQ02_CHECKS = [
    ("timehouse_munich",
     "Timehouse Munich named as the accommodation",
     near("Timehouse", Re(r"munich|muenchen"), window=100)),
    ("address",
     "Leopoldstraße 204a, 80804 Munich address",
     near(Re(r"leopoldstr(?:asse|\.)?\W{0,5}204a"), Re(r"\b80804\b"), window=120)),
    ("reception_closes_2230",
     "reception closing time 22:30 (critical vs 21:46 Hbf arrival)",
     near(Re(r"reception|rezeption"), hhmm("22:30"), window=180)),
    ("keybox_alert",
     "keybox alert/code procedure for a late or delayed arrival",
     near(Re(r"keybox|key\s*box|schliesselbox"),
          Re(r"code|24/7|delay\w*|verspaet\w*|late|advance|email|call|alert|warn\w*"),
          window=280)),
    ("u6_nordfriedhof",
     "U6 access via Nordfriedhof",
     near("U6", Re(r"nordfriedhof"), window=220)),
    ("u6_alte_heide",
     "U6 access via Alte Heide",
     near("U6", Re(r"alte\s*heide"), window=320)),
    ("lufthansa_express_bus_25_min",
     "25-minute Lufthansa Express Bus airport connection",
     near(Re(r"lufthansa"), Re(r"express\s*bus|expressbus|airport\s*bus"),
          Re(r"\b25\b"), Re(r"min"), window=280)),
    ("designer_kitchen",
     "designer/shared kitchen perk of the hotel",
     Re(r"kitchen|kueche")),
]


# ---------------------------------------------------------------------------
# REQ-03: outbound flight, Thu 19 Nov 2026, 10:00 AM from MUC
# ---------------------------------------------------------------------------

REQ03_CHECKS = [
    ("date_thu_19_nov_2026",
     "departure date Thursday 19 Nov 2026",
     on_weekday("thu", 19)),
    ("flight_10am_from_muc",
     "10:00 AM flight departing Munich Airport (MUC)",
     near(Re(r"\b0?10[:.]\d{2}\b|\b10\W{0,2}(?:am|a\.m\.|uhr)"),
          Re(r"\bmuc\b|munich\s*airport|flughafen\s*muenchen|flughafen\s*munchen|airport"),
          window=240)),
    ("departure_flight",
     "the 19 Nov 2026 departure is explicitly a flight",
     near(nov_date(19), Re(r"depart\w*|flight|flug\w*|abflug|leaving"), window=320)),
]


# ---------------------------------------------------------------------------
# REQ-04: mandatory day trips (Neuschwanstein + Dachau, split across 2 days)
# ---------------------------------------------------------------------------

REQ04_CHECKS = [
    ("neuschwanstein_date",
     "Neuschwanstein Castle scheduled on Sunday 15 Nov",
     near("Neuschwanstein", nov_date(15), window=280)),
    ("neuschwanstein_sunday",
     "Neuschwanstein day trip falls on a Sunday",
     on_weekday("sun", 15)),
    ("neuschwanstein_winter_hours",
     "Neuschwanstein winter hours 10:00-16:00",
     near(Re(r"winter"), hhmm("10:00"), hhmm("16:00"), window=220)),
    ("bayern_ticket_44_eur",
     "Bayern-Ticket price of €44 (for 2)",
     near(Re(r"bayern\W*ticket"), money("44"), window=220)),
    ("bayern_ticket_two_travelers",
     "Bayern-Ticket covers the 2 travelers",
     near(Re(r"bayern\W*ticket"), Re(r"\b(?:2|two|zwei)\b"), window=280)),
    ("bus78_outdated_2012_warning",
     "warning that the 2012 Bus_78.pdf timetable is outdated",
     near(Re(r"bus[\W_]{0,3}78"), Re(r"\b2012\b"),
          Re(r"outdated|out-of-date|out of date|veraltet|superseded|stale|"
             r"no longer valid|old\b"), window=380)),
    ("dachau_date",
     "Dachau Memorial scheduled on Monday 16 Nov",
     near("Dachau", nov_date(16), window=280)),
    ("dachau_monday",
     "Dachau visit falls on a Monday",
     on_weekday("mon", 16)),
    ("dachau_open_daily_0900_1700",
     "Dachau Memorial open daily 09:00-17:00",
     near("Dachau", Re(r"daily|taeglich|every\s*day"),
          hhmm("09:00"), hhmm("17:00"), window=450)),
    ("dachau_english_tour_1100",
     "English guided tour at Dachau at 11:00",
     near(Re(r"english|englisch"), hhmm("11:00"),
          Re(r"tour\w*|guide\w*|fuehrung|guided"), window=280)),
    ("dachau_mvv_zone_m1_group_2120",
     "MVV Zone M-1 Group Day Ticket at €21.20 for Dachau",
     near(Re(r"zone\W{0,3}m\W{0,2}1\b"), Re(r"gruppen\W*tageskarte|group\W*day"),
          money("21.20"), window=320)),
]


# ---------------------------------------------------------------------------
# REQ-05: Residenz Christmas market (Weihnachtsdorf im Kaiserhof)
# ---------------------------------------------------------------------------

REQ05_CHECKS = [
    ("kaiserhof_residenz_market",
     "Weihnachtsdorf im Kaiserhof der Residenz Christmas market named",
     near(Re(r"weihnachtsdorf|christmas\s*village"), Re(r"kaiserhof"),
          Re(r"residenz"), window=280)),
    ("opens_16_nov_2026",
     "market opens 16 Nov 2026",
     near(Re(r"opens?|opening|open\b|eroffnet"), nov_date(16), window=280)),
    ("daily_hours_1100_2100",
     "market daily opening hours 11:00-21:00",
     near(hhmm("11:00"), hhmm("21:00"), window=50)),
    ("scheduled_tuesday_17_nov",
     "market scheduled for Tuesday 17 Nov",
     on_weekday("tue", 17)),
    ("flexible_swap_16_or_18_nov",
     "flexible swap option for 16 or 18 Nov",
     near(Re(r"flex\w*|swap\w*|alternativ\w*|back-?up|reschedul\w*|switch|move"),
          Re(r"\b16\b"), Re(r"\b18\b"), Re(r"nov"), window=450)),
]


# ---------------------------------------------------------------------------
# REQ-06: delicacies, beer, must-sees, neighborhoods, museums, trails
# ---------------------------------------------------------------------------

REQ06_CHECKS = [
    # -- local delicacies -------------------------------------------------
    ("weisswurstfruehstueck_named",
     "Weißwurstfrühstück named as a delicacy",
     Re(r"weisswurstfruehstueck|weisswurst\W{0,4}fruehstueck|"
        r"weisswurst\W{0,4}breakfast")),
    ("weisswurst_before_noon",
     "Weißwurst must be eaten before noon",
     near(Re(r"weisswurst\w*"),
          Re(r"noon|12[:.]00|vor\s*12|bis\s*12|before\s*12|11[:.]59"), window=320)),
    ("schweinshaxe", "Schweinshaxe", lit("Schweinshaxe")),
    ("kaesespaetzle", "Käsespätzle", lit("Käsespätzle")),
    ("schmalznudel_at_cafe_frischhut",
     "Schmalznudel at Café Frischhut",
     near("Schmalznudel", Re(r"frischhut"), window=220)),
    ("obatzda", "Obatzda", lit("Obatzda")),
    ("kaiserschmarrn", "Kaiserschmarrn", lit("Kaiserschmarrn")),

    # -- beer garden / beer hall guide ------------------------------------
    ("augustiner_braustuben",
     "Augustiner Bräustuben beer hall",
     near("Augustiner", Re(r"braeustuben|braustuben"), window=120)),
    ("augustiner_wooden_barrel",
     "Augustiner Bräustuben wooden barrel (Holzfass) service",
     near("Augustiner",
          Re(r"wooden?\s*barrel|wood\s*barrel|holzfass\w*|wooden\s*cask|fa(?:ss|ß)l"),
          window=320)),
    ("augustiner_edelstoff",
     "Augustiner Edelstoff from the wooden barrel",
     near("Augustiner", "Edelstoff", window=320)),
    ("chinesischer_turm",
     "Chinesischer Turm beer garden",
     seq("Chinesischer", "Turm", gap=r"\W{0,8}")),
    ("viktualienmarkt_biergarten",
     "Viktualienmarkt Biergarten",
     near("Viktualienmarkt", Re(r"biergarten|beer\s*garden"), window=280)),
    ("schneider_braeuhaus",
     "Schneider Bräuhaus",
     seq("Schneider", alt("Bräuhaus", "Brauhaus"), gap=r"\W{0,8}")),

    # -- first-timer must-sees -------------------------------------------
    ("mustsee_marienplatz", "Marienplatz", lit("Marienplatz")),
    ("mustsee_glockenspiel",
     "Neues Rathaus Glockenspiel",
     AnyOf(seq("Neues Rathaus", "Glockenspiel", gap=r"\W{0,30}"), lit("Glockenspiel"))),
    ("mustsee_viktualienmarkt", "Viktualienmarkt", lit("Viktualienmarkt")),
    ("mustsee_frauenkirche", "Frauenkirche", lit("Frauenkirche")),
    ("mustsee_alter_peter",
     "Alter Peter viewpoint",
     AnyOf(seq("Alter", "Peter", gap=r"\W{0,8}"), lit("Peterskirche"))),
    ("mustsee_odeonsplatz", "Odeonsplatz", lit("Odeonsplatz")),
    ("mustsee_englischer_garten",
     "Englischer Garten",
     seq("Englischer", "Garten", gap=r"\W{0,8}")),
    ("mustsee_eisbachwelle",
     "Eisbachwelle surf wave",
     AnyOf(lit("Eisbachwelle"),
           seq("Eisbach", Re(r"wave|welle"), gap=r"\W{0,12}"))),

    # -- modern local neighborhoods --------------------------------------
    ("neighbourhood_schwabing", "Schwabing", lit("Schwabing")),
    ("neighbourhood_maxvorstadt", "Maxvorstadt", lit("Maxvorstadt")),
    ("neighbourhood_glockenbachviertel", "Glockenbachviertel", lit("Glockenbachviertel")),
    ("neighbourhood_haidhausen", "Haidhausen", lit("Haidhausen")),
    ("neighbourhood_alte_utting",
     "Alte Utting / Werksviertel",
     AnyOf(seq("Alte", "Utting", gap=r"\W{0,8}"), lit("Werksviertel"))),

    # -- curated museum budget (at most 1-2 museums) ---------------------
    ("museum_residenz_antiquarium",
     "Munich Residenz Antiquarium",
     near("Residenz", "Antiquarium", window=220)),
    ("museum_schatzkammer_or_treasury",
     "Residenz Schatzkammer / Treasury",
     alt("Schatzkammer", "Treasury")),
    ("museum_photo_optics_or_leica",
     "Deutsches Museum photography/optics section or Leica Galerie",
     AnyOf(near("Deutsches Museum", Re(r"photo\w*|foto\w*"),
                Re(r"optic\w*|optik\w*"), window=300),
           near("Leica", alt("Galerie", "Gallery"), window=150))),

    # -- dedicated trails: headings --------------------------------------
    ("trail_heading_bakeries",
     "dedicated bakery trail section",
     Re(r"baker\w*|baeckerei|backerei")),
    ("trail_heading_wine",
     "dedicated wine trail section",
     Re(r"\bwine\b|\bwein\b|weinbar|weinstube")),
    ("trail_heading_antiques",
     "dedicated antiques trail section",
     Re(r"antique\w*|antik\w*|flohmarkt")),
    ("trail_heading_cameras",
     "dedicated vintage/analog camera trail section",
     Re(r"camera\w*|kamera\w*|analog\w*|vintage")),

    # -- dedicated trails: bakeries --------------------------------------
    ("bakery_julius_brantner", "Julius Brantner bakery", seq("Julius", "Brantner", gap=r"\W{0,8}")),
    ("bakery_frischhut", "Café Frischhut bakery", Re(r"frischhut")),
    ("bakery_dompierre", "Dompierre bakery", lit("Dompierre")),

    # -- dedicated trails: wine ------------------------------------------
    ("wine_weinhaus_neuner", "Weinhaus Neuner", seq("Weinhaus", "Neuner", gap=r"\W{0,8}")),
    ("wine_pfaelzer_residenz_weinstube",
     "Pfälzer Residenz Weinstube",
     seq("Pfälzer", "Residenz", "Weinstube", gap=r"\W{0,12}")),
    ("wine_franken_silvaner_bocksbeutel",
     "Franken Silvaner in the Bocksbeutel bottle",
     near("Franken", "Silvaner", "Bocksbeutel", window=280)),
    ("wine_bar_mural", "Bar Mural", seq("Bar", "Mural", gap=r"\W{0,8}")),

    # -- dedicated trails: antiques --------------------------------------
    ("antiques_ottostrasse_kunst_oase",
     "Ottostraße Kunst-Oase antiques",
     near(Re(r"ottostr(?:asse|\.)?"), Re(r"kunst\W{0,3}oase"), window=240)),
    ("antiques_flohmarkt_saturday",
     "Saturday Flohmarkt (Olympiapark / Daglfing)",
     AllOf(near("Flohmarkt", weekday("sat"), window=280),
           near("Flohmarkt", Re(r"olympiapark|daglfing"), window=380))),

    # -- dedicated trails: cameras ---------------------------------------
    ("camera_leica_store_maffeistr",
     "Leica Store & Galerie at Maffeistrasse",
     near(Re(r"leica"), Re(r"maffeistr"), window=280)),
    ("camera_foto_dinkel", "Foto Dinkel", seq("Foto", "Dinkel", gap=r"\W{0,8}")),
    ("camera_calumet", "Calumet", lit("Calumet")),
    ("camera_sauter", "Sauter", lit("Sauter")),
]


def test_req06_museum_budget_at_most_two(page: Page) -> None:
    """REQ-06: at most 1-2 museums - only the curated Residenz Antiquarium/
    Schatzkammer plus Deutsches Museum photo/optics or Leica Galerie picks."""
    assert page.exists, f"index.html not found at {INDEX_HTML}"
    offenders = [
        name
        for name, pattern in sorted(OUT_OF_BUDGET_MUSEUMS.items())
        if re.search(pattern, page.corpus, re.IGNORECASE)
    ]
    assert not offenders, (
        "REQ-06 caps museum visits at 1-2 curated museums, but index.html also "
        f"mentions: {offenders}"
    )


# ---------------------------------------------------------------------------
# REQ-07: Bavarian transport & troublesome ticketing guide
# ---------------------------------------------------------------------------

BAYERN_TICKET = Re(r"bayern\W*ticket")
GROUP_DAY = Re(r"gruppen\W*tageskarte|group\W*day\W*(?:ticket|pass)?")

REQ07_CHECKS = [
    ("mvv_zone_m_single_420",
     "2026 MVV Zone M single fare €4.20",
     near(Re(r"zone\W{0,3}m(?![-\s]?\d)"),
          Re(r"single\w*|einzel\w*|einzelfahr\w*"), money("4.20"), window=320)),
    ("mvv_group_day_1970",
     "2026 MVV Group Day Ticket (2-5 adults) €19.70",
     near(GROUP_DAY, money("19.70"), window=280)),
    ("mvv_zone_m1_group_day_2120",
     "2026 MVV Zone M-1 Group Day Ticket €21.20",
     near(Re(r"zone\W{0,3}m\W{0,2}1\b"), GROUP_DAY, money("21.20"), window=320)),
    ("streifenkarte_1870",
     "Streifenkarte (stripe ticket) price €18.70",
     near("Streifenkarte", money("18.70"), window=280)),
    ("streifenkarte_folding_stamping_rules",
     "Streifenkarte folding/stamping rules explained",
     near("Streifenkarte",
          Re(r"fold\w*|falten|stamp\w*|stempel\w*|entwert\w*|validat\w*|tear"),
          window=380)),
    ("entwerter_validation_box_fine_60",
     "Entwerter validation box and the €60 fine warning",
     AllOf(near(Re(r"entwerter"), Re(r"validat\w*|box|stempel"), window=280),
           near(Re(r"entwerter|validat\w*"), money("60"), window=380))),
    ("mvvswipe",
     "MVVswipe mentioned in the ticketing guide",
     lit("MVVswipe")),
    ("bayern_ticket_0900_weekday_0000_weekend",
     "Bayern-Ticket validity 09:00 on weekdays vs 00:00 on weekends",
     AllOf(near(BAYERN_TICKET, hhmm("09:00"), window=650),
           near(BAYERN_TICKET, hhmm("00:00"), window=650),
           near(BAYERN_TICKET, Re(r"weekday\w*|werktags?|work\s*day|mon\W*fri"),
                window=650),
           near(BAYERN_TICKET,
                Re(r"weekend\w*|wochenende|saturday|sunday|samstag|sonntag|sonnabend"),
                window=650))),
    ("bayern_ticket_ink_name_writing",
     "Bayern-Ticket mandatory ink name writing rule",
     near(BAYERN_TICKET, Re(r"\bink\b|pen\b|kugelschreiber|ballpoint"),
          Re(r"name\w*|write\w*|writing|eintragen|fill"), window=650)),
    ("u3_u6_nov_2026_construction",
     "U3/U6 November 2026 construction/closure alert",
     near(Re(r"\bu3\b"), Re(r"\bu6\b"), Re(r"nov(?:ember)?|2026"),
          Re(r"construction|bau\w*|closure|sperr\w*|disruption\w*|renovat\w*|arbeiten"),
          window=550)),
]


# ---------------------------------------------------------------------------
# REQ-08: HK first-timer to Germany hiccups
# ---------------------------------------------------------------------------

REQ08_CHECKS = [
    ("sunday_ruhetag_shutdown",
     "Sunday Ruhetag shop shutdown warning",
     near(Re(r"ruhetag\w*"), Re(r"sunday|sonntag"),
          Re(r"clos\w*|geschlossen|shut\w*|rest\s*day|no\s*shopping"), window=420)),
    ("cash_and_coins",
     "cash-first culture and small coins advice",
     near(Re(r"cash\b|bargeld|barzahlung|\bbar\b"),
          Re(r"coin\w*|muenzen|small\s*change|exact\s*change|notes\b|atm|geldautomat"),
          window=380)),
    ("sanifair_toilet_coins",
     "Sanifair toilet coin advice",
     near(Re(r"sanifair"), Re(r"coin\w*|muenzen|cash\b|money\b"), window=280)),
    ("pfand_mug_deposit",
     "Pfand deposit on festival mugs/cups",
     near("Pfand", Re(r"mug|becher|cup\b"), window=280)),
    ("pfand_bottle_deposit",
     "Pfand deposit on bottles",
     near("Pfand", Re(r"bottle|flasche"), window=280)),
    ("stilles_vs_sprudelwasser",
     "Stilles Wasser vs Sprudelwasser ordering tip",
     near(Re(r"stilles?\s*wasser|still\s*water|stilles\b"),
          Re(r"sprudel\w*|sparkling|prickelnd|carbonated|fizzy"), window=420)),
    ("stammtisch_reserved_sign",
     "Stammtisch reserved table sign explained",
     near("Stammtisch",
          Re(r"reserved|reserviert|reserv\w*|sign\b|schild|regular"), window=320)),
    ("tipping_rounding_up",
     "tipping by rounding up",
     near(Re(r"trinkgeld|tipping|\btips?\b|tip\b"), Re(r"round\w*|aufrunden"),
          window=380)),
    ("pretzel_basket_charge",
     "pretzel basket is not free (extra charge)",
     near(Re(r"pretzel\w*|brezen|brezel\w*"), Re(r"basket|korb"),
          Re(r"charge\w*|fee\b|cost\w*|extra|bill\w*|pay\b|paid|not\s*free"),
          window=420)),
    ("jaywalking_fines",
     "jaywalking / red-light crossing fines warning",
     near(Re(r"jaywalk\w*|rotlicht|red\s*light|ampel|cross\w*\s*(?:against|on\s*red)"),
          Re(r"fine\w*|strafe|illegal|avoid|don.t|do\s*not|never|wait|ticket|"
             r"penalty|geldbusse"), window=420)),
    ("bike_lane_hazard",
     "bike lane / cycle path hazard warning",
     near(Re(r"bike\s*lane\w*|radweg\w*|cycle\s*lane|cycle\s*path|bike\s*path|"
             r"cyclist\w*|radfahrer"),
          Re(r"watch|careful|beware|mind\b|look\b|never|don.t|do\s*not|danger|"
             r"quiet|fast|strict|rules|off\s*limits|stay\s*off"), window=420)),
    ("sunset_1630",
     "early ~16:30 sunset in mid-November",
     near(hhmm("16:30"),
          Re(r"sunset|sonnenuntergang|dark\w*|dusk|dunkel|nightfall"), window=280)),
    ("thermal_layering",
     "thermal layering clothing advice",
     AnyOf(near(Re(r"thermal\w*|layer\w*|schicht"),
                Re(r"dress|clothing|pack\w*|warm\w*|cold|jacket|fleece|onion|wool|base"),
                window=420),
           Re(r"thermal\s*layer"))),
]


# ---------------------------------------------------------------------------
# Parametrized requirement tests
# ---------------------------------------------------------------------------


def _parametrize(checks):
    return pytest.mark.parametrize(
        "check_id,description,matcher", checks, ids=[c[0] for c in checks]
    )


@_parametrize(REQ01_CHECKS)
def test_req01_inbound_rail(page: Page, check_id, description, matcher) -> None:
    """REQ-01: exact TGV 2362 + TGV 9577 tickets for Friday 13 Nov 2026."""
    assert_match(matcher, f"REQ-01 {check_id}: {description}", page)


@_parametrize(REQ02_CHECKS)
def test_req02_timehouse_accommodation(page: Page, check_id, description, matcher) -> None:
    """REQ-02: Timehouse Munich with the 22:30 reception/keybox alert."""
    assert_match(matcher, f"REQ-02 {check_id}: {description}", page)


@_parametrize(REQ03_CHECKS)
def test_req03_outbound_flight(page: Page, check_id, description, matcher) -> None:
    """REQ-03: departure Thursday 19 Nov 2026, 10:00 AM flight from MUC."""
    assert_match(matcher, f"REQ-03 {check_id}: {description}", page)


@_parametrize(REQ04_CHECKS)
def test_req04_day_trips(page: Page, check_id, description, matcher) -> None:
    """REQ-04: Neuschwanstein (Sun 15 Nov) and Dachau (Mon 16 Nov)."""
    assert_match(matcher, f"REQ-04 {check_id}: {description}", page)


@_parametrize(REQ05_CHECKS)
def test_req05_residenz_christmas_market(page: Page, check_id, description, matcher) -> None:
    """REQ-05: Weihnachtsdorf im Kaiserhof der Residenz, Tue 17 Nov + swap."""
    assert_match(matcher, f"REQ-05 {check_id}: {description}", page)


@_parametrize(REQ06_CHECKS)
def test_req06_interests_and_trails(page: Page, check_id, description, matcher) -> None:
    """REQ-06: delicacies, beer, must-sees, neighborhoods and the four trails."""
    assert_match(matcher, f"REQ-06 {check_id}: {description}", page)


@_parametrize(REQ07_CHECKS)
def test_req07_transport_and_ticketing(page: Page, check_id, description, matcher) -> None:
    """REQ-07: MVV/Bayern-Ticket fare and validation rules, U3/U6 works."""
    assert_match(matcher, f"REQ-07 {check_id}: {description}", page)


@_parametrize(REQ08_CHECKS)
def test_req08_hk_first_timer_hiccups(page: Page, check_id, description, matcher) -> None:
    """REQ-08: HK-vs-Germany cultural, cash, dining and weather hiccups."""
    assert_match(matcher, f"REQ-08 {check_id}: {description}", page)


# ---------------------------------------------------------------------------
# Self-checks of the matching helpers (guards the guardrails)
# ---------------------------------------------------------------------------


def test_helper_fold_transliterates_german() -> None:
    assert fold("München Hbf") == fold("Muenchen Hbf") == "muenchen hbf"
    assert fold("Weißwurstfrühstück") == fold("Weisswurstfruehstueck")
    assert fold("Käsespätzle") == fold("Kaesespaetzle")
    assert fold("Café Frischhut") == fold("Cafe Frischhut")


def test_helper_hhmm_and_money_accept_variants() -> None:
    assert hhmm("16:45").matches("dep 16:45 Colmar")
    assert hhmm("16:45").matches("dep 16.45 Colmar")
    assert hhmm("09:00").matches("from 9:00 onwards")
    assert money("4.20").matches("€4.20 single")
    assert money("4.20").matches("4,20 EUR")
    assert money("44").matches("total 44.00 €")
    assert not money("4.20").matches("no price here")


def test_helper_near_requires_co_occurrence() -> None:
    corpus = fold("TGV INOUI 2362 coach 13, seats 308 & 307, Colmar 16:45")
    assert near("TGV", Re(r"\b2362\b"), Re(r"\b308\b"), window=80).matches(corpus)
    assert not near(Re(r"\b9577\b"), Re(r"\b308\b"), window=80).matches(corpus)


def test_helper_nov_date_variants() -> None:
    assert nov_date(13).matches(fold("Friday, 13 November 2026"))
    assert nov_date(13).matches(fold("Nov 13, 2026"))
    assert nov_date(13).matches(fold("13.11.2026"))
    assert on_weekday("fri", 13).matches(fold("Fri 13 Nov 2026"))
    assert on_weekday("sun", 15).matches(fold("Sunday, 15 Nov"))
    assert not on_weekday("mon", 13).matches(fold("Fri 13 Nov 2026"))


# ---------------------------------------------------------------------------
# Mobile responsiveness regression checks (verified via test/mobile-screenshots/)
# ---------------------------------------------------------------------------


def test_responsive_layout_rules_present() -> None:
    """REQ-09 responsive: grids scale below card min-widths, wide tables scroll,
    and tab/filter bars become swipe-scrollable on phones."""
    assert INDEX_HTML.is_file(), f"index.html not found at {INDEX_HTML}"
    src = INDEX_HTML.read_text(encoding="utf-8")
    assert "minmax(min(340px, 100%), 1fr)" in src, "grid-2 must not overflow narrow phones"
    assert "minmax(min(290px, 100%), 1fr)" in src, "grid-3 must not overflow narrow phones"
    assert "minmax(min(260px, 100%), 1fr)" in src, "logistics-bar must not overflow narrow phones"
    assert src.count('<div class="table-scroll">') >= 4, (
        "wide fare/audit tables must be wrapped in .table-scroll containers"
    )
    assert re.search(r"max-width:\s*620px", src), "mobile breakpoint for swipe-scrollable tab bars missing"
