"""Acceptance test suite for the Germany & Alsace (4-20 Nov 2026) planner.

Validates ``index.html`` (repository root) against every requirement recorded in
the authoritative vision source:

    C:/Users/mattC/Documents/Knowledge/Projects/munich-trip-2026/Vision.md

Requirement coverage
--------------------
REQ-01  Inbound rail logistics (TGV INOUI 2362 + 9577, Fri 13 Nov 2026) ... REQ-01
REQ-02  Timehouse Munich accommodation & the 22:30 check-in trap ......... REQ-02
REQ-03  Return flight (Thu 19 Nov 2026, Etihad EY 126 at 10:30, MUC) ..... REQ-03
REQ-04  Mandatory day trips (Neuschwanstein Sun 15 Nov + Dachau Mon 16 Nov) REQ-04
REQ-05  Mandatory Christmas market (Residenz Kaiserhof) ................. REQ-05
REQ-06  Interests: delicacies, beer, must-sees, neighborhoods, museum
        budget and the four dedicated trails (bakeries/wine/antiques/
        cameras) ........................................................ REQ-06
REQ-07  Bavarian transport & ticketing survival guide ................... REQ-07
REQ-08  HK first-timer to Germany hiccups ............................... REQ-08
REQ-09  Interactive, responsive, self-contained HTML5 deliverable with
        verified local photographs (also the file/validity/image checks) . REQ-09
REQ-10  Master bookings wallet, packing checklist & laundromat guide ...... REQ-10
Revision  Revised itinerary (Berlin leg re-sequenced on 3 Nov 2026: Street Food
        Thursday, Museum Island + Mampe + Yorckschlösschen, zoo + BRLO,
        Domke Sunday lunch; 84-pin list snapshot; Black Forest hours and
        renamed/added Munich stops from the 1 Nov 2026 verification)

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

import json
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


def test_rendered_javascript_parses(page: Page, tmp_path: Path) -> None:
    """The inlined controller must be valid JavaScript. A syntax error there
    would silently kill the map, the Berlin day filters and the packing
    checklist while every content assertion still passed."""
    import shutil
    import subprocess

    assert page.exists, f"index.html not found at {INDEX_HTML}"
    inline = re.search(r"<script>\n([\s\S]*?)\n</script>", page.source)
    assert inline, "index.html must inline the interactive controller script"
    node = shutil.which("node")
    if not node:  # build.mjs itself needs node, so this is only a local guard
        pytest.skip("node is unavailable, skipping the JavaScript syntax check")
    script_path = tmp_path / "controller.js"
    script_path.write_text(inline.group(1), encoding="utf-8")
    result = subprocess.run(
        [node, "--check", str(script_path)],
        capture_output=True,
        text=True,
        timeout=60,
    )
    assert result.returncode == 0, (
        "the inlined controller script is not valid JavaScript: "
        + (result.stderr or result.stdout)
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
    ("flight_ey126_1030_from_muc",
     "Etihad EY 126 flight departing Munich Airport (MUC) at 10:30",
     near(Re(r"\bey\W{0,3}126\b"), hhmm("10:30"),
          Re(r"\bmuc\b|munich\s*airport|flughafen\s*muenchen|flughafen\s*munchen|airport"),
          window=300)),
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
    ("camera_foto_erhardt_renamed",
     "Foto Erhardt (ehem. Foto Dinkel) on Landwehrstraße 6, open Mon-Fri 09:30-18:30 / Sat 10:00-16:00",
     near(Re(r"foto\s*erhardt"), Re(r"landwehrstr"), hhmm("09:30"), hhmm("18:30"),
          hhmm("16:00"), window=500)),
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
    """REQ-03: departure Thursday 19 Nov 2026, Etihad EY 126 at 10:30 from MUC."""
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
    assert src.count('<div class="table-scroll">') >= 5, (
        "wide fare/audit/laundry tables must be wrapped in .table-scroll containers"
    )
    assert re.search(r"max-width:\s*620px", src), "mobile breakpoint for swipe-scrollable tab bars missing"


# ---------------------------------------------------------------------------
# REQ-10: Master Bookings Wallet, Interactive Packing Checklist & Laundry Guide
# ---------------------------------------------------------------------------

REQ10_BOOKING_AND_PACKING_CHECKS = [
    ("outbound_flights_etihad_condor_7ak639",
     "Outbound flights Etihad EY 871 (19:35 HKG->00:25 AUH) + Condor DE 2553 (02:20 AUH->06:20 BER), Ref 7AK639",
     near("EY 871", "DE 2553", "7AK639", hhmm("19:35"), hhmm("06:20"), window=450)),
    ("berlin_karlito_booking_5126078467",
     "Karlito Apartmenthaus Family Apartment with Balcony, Booking #5126078467",
     near("Karlito", "5126078467", Re(r"balcony"), window=320)),
    ("berlin_yorckschloesschen_fri_6_nov_1830",
     "Yorckschlösschen confirmed dinner reservation Fri 6 Nov at 18:30 for 2 people",
     near("Yorckschlösschen", hhmm("18:30"), Re(r"\b2\b"), window=280)),
    ("oebb_nightjet_booking_0698_9390_6002_7647",
     "ÖBB Nightjet Berlin Hbf (Tiefgeschoß) to Freiburg(Breisgau) Hbf booking code 0698 9390 6002 7647",
     near("0698 9390 6002 7647", Re(r"tiefgeschoss"), "Freiburg", window=320)),
    ("freiburg_airbnb_mario_nadine_hmktphqe4h",
     "Freiburg Airbnb Schlossbergblick 1-Zimmer Dachgeschoss Apartment hosted by Mario & Nadine, code HMKTPHQE4H",
     near("Schlossbergblick", "Mario", "Nadine", "HMKTPHQE4H", window=320)),
    ("colmar_logis_saint_martin_6935982825",
     "Logis Hôtel Saint-Martin Colmar Superior Double or Twin Room, booking #6935982825",
     near("Saint-Martin", "6935982825", Re(r"superior"), window=320)),
    ("turckheim_domaine_baur_shifted_fri_13_nov",
     "Domaine François Baur biodynamic wine tasting shifted from Nov 12 to Fri 13 Nov at 10:00 AM",
     near("Domaine", "Baur", hhmm("10:00"), Re(r"rebook\w*|shift\w*"), window=360)),
    ("munich_single_confirmed_base_timehouse_6724144172",
     "Timehouse (#6724144172) is the sole confirmed Munich base with the WhatsApp late check-in",
     near("Timehouse", "6724144172", Re(r"whatsapp"), window=350)),
    ("munich_bob_w_only_a_cancelled_record",
     "Bob W Munich City Centre (Schwanthalerstr. 61, #5210364141) appears only as a cancelled/archived record",
     near(Re(r"bob\s*w"), Re(r"cancel\w*|archiv\w*|stale"),
          Re(r"5210364141|schwanthalerstr"), window=340)),
    ("neuschwanstein_tour_475_1415_invoice_39901_1056944",
     "Neuschwanstein Castle Tour #475 at 14:15 (15 mins prior in courtyard), Invoice 39901.1056944",
     near("Neuschwanstein", hhmm("14:15"), "475", "39901.1056944", window=380)),
    ("return_flights_ey126_ey870_7ak639",
     "Return flights Etihad EY 126 (10:30 MUC->19:30 AUH) + EY 870 (21:15 AUH->08:30 HKG Nov 20), Ref 7AK639",
     near("EY 126", "EY 870", hhmm("10:30"), hhmm("21:15"), hhmm("08:30"), "7AK639", window=500)),
    ("laundromat_strategy_berlin_freiburg_munich",
     "Verified 3-stop laundromat guide across Berlin (Schleudertraum / Waschsalon 115), Freiburg (30grad Lehener Str. 27 / Wasch & Fun Egonstraße 25), and Munich (Timehouse Waschküche / SB Waschsalon)",
     AllOf(near("Schleudertraum", "Memhardstr", window=260),
           near(Re(r"30\W*grad"), "Lehener", "Egonstraße", window=380),
           near("Timehouse", Re(r"waschkueche|laundry\s*room"), window=320))),
]


@_parametrize(REQ10_BOOKING_AND_PACKING_CHECKS)
def test_req10_bookings_and_packing_laundry(page: Page, check_id, description, matcher) -> None:
    """REQ-10: confirmed bookings (Timehouse as the single Munich base, Bob W kept
    only as a cancelled record), interactive packing checklist and laundromat guide."""
    assert_match(matcher, f"REQ-10 {check_id}: {description}", page)


def test_req10_interactive_packing_checkboxes_present(page: Page) -> None:
    """REQ-10: interactive packing checklist has >= 25 checkboxes persisted via localStorage."""
    assert page.exists
    checkboxes = re.findall(r'input\s+type="checkbox"\s+data-pack-id="[^"]+"', page.source)
    assert len(checkboxes) >= 25, f"Expected >= 25 packing checkboxes, found {len(checkboxes)}"
    assert "localStorage" in page.source, "Packing checklist must persist state in localStorage"


def test_req10_bob_w_is_never_presented_as_an_active_munich_hotel(page: Page) -> None:
    """REQ-10: the traveller must see exactly one Munich hotel. Every mention of
    Bob W has to sit inside a cancellation notice, otherwise the old overlapping
    booking would look like a live reservation again."""
    assert page.exists, f"index.html not found at {INDEX_HTML}"
    mentions = list(re.finditer(r"bob\s*w", page.corpus))
    for mention in mentions:
        context = page.corpus[max(0, mention.start() - 260): mention.start() + 420]
        assert re.search(r"cancel\w*|archiv\w*|stale", context), (
            "Bob W is mentioned outside a cancellation context, so the site would "
            f"look like it still books two Munich hotels: ...{context}..."
        )


def test_req03_return_flight_never_departs_at_1000(page: Page) -> None:
    """REQ-03: EY 126 departs MUC at 10:30. The superseded 10:00 departure time
    must not survive anywhere next to the flight, or the traveller may plan the
    airport transfer an hour too generously."""
    assert page.exists, f"index.html not found at {INDEX_HTML}"
    stale = re.findall(
        r"ey\s*126[^.]{0,60}?\bdeparts?\b[^.]{0,30}?\b0?10[:.]00\b", page.corpus
    )
    assert not stale, (
        "EY 126 must be documented as departing 10:30, not 10:00; found: "
        + "; ".join(stale)
    )


# ---------------------------------------------------------------------------
# Revised itinerary (Black Forest / Alsace / Munich, verified 1 Nov 2026)
#
# These legs were re-checked against published hours and the user's shared
# Google Maps list. These checks pin the user-visible outcome of that revision:
# the corrected Black Forest opening hours, the Nightjet timings, the
# 84-place list snapshot and the renamed/added Munich stops. The Berlin leg has
# its own section further down (re-sequenced on 3 Nov 2026).
# ---------------------------------------------------------------------------

MALY_KSIAZE = Re(r"ma\S{0,2}y\s*ksi\S{0,6}")

REVISION_CHECKS = [
    # -- Black Forest / Alsace: Mon 9, Wed 11, Thu 12 Nov ------------------
    ("blackforest_mon_kolben_kaffee_breakfast",
     "Monday breakfast at Kolben Kaffee within its Mon-Sat 07:30 opening hours",
     near(Re(r"kolben\s*kaffee"), Re(r"mon\W{0,3}sat"), hhmm("07:30"),
          Re(r"breakfast|fruehstueck"), window=420)),
    ("blackforest_thu_freiburgs_finest_1000",
     "Freiburgs Finest moved to Thu 12 Nov 10:00 and closes at 18:00",
     near(Re(r"freiburgs\s*finest"), on_weekday("thu", 12), hhmm("10:00"),
          hhmm("18:00"), window=500)),
    ("blackforest_schauinsland_omitted_for_real_reasons",
     "Schauinsland omission explained by the winter-closed mine/farm while the cable car's 16 Nov-4 Dec revision is stated",
     near(Re(r"schauinsland"), Re(r"16\s*nov\W{0,14}4\s*dec"),
          Re(r"mine|bergwerk|schniederlihof"), window=800)),
    ("blackforest_titisee_wed_11_nov",
     "Lake Titisee scheduled for Wednesday 11 Nov",
     near(Re(r"titisee"), on_weekday("wed", 11), window=340)),

    # -- Munich: 81-pin list audit and renamed/added stops ----------------
    ("munich_audit_84_saved_places",
     "shared Google Maps list audited as an 84-place 3 Nov 2026 snapshot",
     near(Re(r"\b84\b"), Re(r"saved\s*places|saved\s*pins"),
          Re(r"3\s*nov"), window=320)),
    ("munich_audit_3_krakow_pins_out_of_scope",
     "the 3 Kraków pins are flagged out of scope for this trip",
     near(Re(r"krak"), Re(r"\b3\b"), Re(r"out\s*of\s*scope|poland"), window=340)),
    ("munich_feinkost_ole_wed_18_nov",
     "Feinkost Olé scheduled on Wed 18 Nov",
     near(Re(r"feinkost\s*ole"), on_weekday("wed", 18), window=340)),
    ("munich_sauter_sonnenstrasse_21",
     "Sauter / Calumet camera store at Sonnenstraße 21",
     near(Re("sauter"), Re(r"sonnenstr"), Re(r"\b21\b"), window=340)),
]


@_parametrize(REVISION_CHECKS)
def test_revised_itinerary(page: Page, check_id, description, matcher) -> None:
    """Revision (verified 1 Nov 2026): corrected Black Forest hours, Nightjet
    timings, the 84-place list snapshot and renamed/added Munich stops."""
    assert_match(matcher, f"Revision {check_id}: {description}", page)



# ---------------------------------------------------------------------------
# Berlin leg re-sequenced to the user's 3 Nov 2026 decisions
#
# Thu 5 Nov  arrival -> Zeit fuer Brot -> memorial/gate -> one flex lunch ->
#           Hackesche Hoefe -> Dead Chicken Alley/Otto Weidt -> FOTOIMPEX ->
#           check-in & rest -> Street Food Thursday at Markthalle Neun
# Fri 6 Nov  one bakery -> Museum Island (day ticket, not booked) -> Mampe
#           16:00-17:30 -> confirmed 18:30 Yorckschloesschen
# Sat 7 Nov  zoo all day -> BRLO as the only planned dinner, with at most one
#           optional KaDeWe / C/O Berlin add-on (neither on the baseline route)
# Sun 8 Nov  Wall Memorial -> Mauerpark -> Domke lunch -> East Side Gallery ->
#           20:52 Nightjet NJ 408, at Berlin Hbf with bags by ~20:15
# ---------------------------------------------------------------------------

BERLIN_CHECKS = [
    ("berlin_arrival_fex_re20_potsdamer_then_u2",
     "BER arrival uses FEX/RE20 to Potsdamer Platz then U2 to Rosa-Luxemburg-Platz, "
     "ABC ticket validated, timetable subject to a live check",
     near(Re(r"fex"), Re(r"re\s*20"), Re(r"potsdamer\s*platz"),
          Re(r"rosa-luxemburg-platz"), Re(r"\babc\b"), Re(r"validat"),
          window=700)),
    ("berlin_thu_zeit_fuer_brot_cinnamon_bun",
     "Thu 5 Nov must-have cinnamon roll / Zimtschnecke at Zeit fuer Brot inside its "
     "Mon-Fri 07:00-20:00 hours",
     near(Re(r"zeit\s*fuer\s*brot"), Re(r"cinnamon\s*roll|zimtschnecke"),
          on_weekday("thu", 5), hhmm("07:00"), hhmm("20:00"), window=700)),
    ("berlin_thu_one_flexible_lunch",
     "the single flexible Mitte lunch is Staendige Vertretung first and Sophien 11 second",
     near("Ständige Vertretung", Re(r"sophien\s*11"),
          Re(r"one\s*lunch\s*only|never\s*both"), window=500)),
    ("berlin_thu_hackesche_and_otto_weidt",
     "Hackesche Hoefe plus the optional Otto Weidt weekday 09:00-18:00 visit",
     near(Re(r"hackesche\s*hoefe"), Re(r"otto\s*weidt"), hhmm("09:00"),
          hhmm("18:00"), Re(r"optional"), window=700)),
    ("berlin_thu_fotoimpex_11_to_19",
     "FOTOIMPEX is a Thu 5 Nov stop open Mon-Sat 11:00-19:00",
     near(Re(r"fotoimpex"), Re(r"mon\W{0,3}sat"), hhmm("11:00"), hhmm("19:00"),
          window=320)),
    ("berlin_thu_street_food_thursday_first_choice",
     "Street Food Thursday at Markthalle Neun 17:00-22:00 is the first-choice dinner",
     near(Re(r"street\s*food\s*thursday"), Re(r"markthalle\s*neun"), hhmm("17:00"),
          hhmm("22:00"), Re(r"first[-\s]*choice"), window=420)),
    ("berlin_thu_anjoy_backup_only",
     "Anjoy (Rykestrasse 11) is the dinner backup and never combined with Street Food Thursday",
     near(Re(r"anjoy"), Re(r"rykestr"), Re(r"backup"),
          Re(r"never\s*both|not\s*both"), window=500)),
    ("berlin_fri_one_bakery_only",
     "Fri 6 Nov breakfast is one bakery: SammyS (Sophienstr. 30-31, opening subject to "
     "check) or a Zeit repeat or CANAL at 10:00",
     near("SammyS", Re(r"sophienstr\w*\s*30"), Re(r"canal"),
          Re(r"subject\s*to\s*check"), window=600)),
    ("berlin_fri_museum_island_day_ticket",
     "Museum Island day pass is EUR 24 per person, not booked, the Pergamonmuseum main "
     "building is closed and Das Panorama is a separate exhibition venue",
     near(Re(r"museum\s*island"), money("24"), Re(r"not\s*booked"),
          Re(r"pergamonmuseum(?:\s+main\s+building)?\s*(?:itself\s*)?(?:is\s*)?closed"),
          Re(r"panorama"), window=900)),
    ("berlin_fri_steak_doner_is_a_suggestion",
     "the user-saved The Steak Döner (Spandauer Str. 4) is a suggestion only, not booked",
     near(Re(r"the\s*steak\s*doener"), Re(r"spandauer\s*str"), Re(r"suggestion"),
          Re(r"not\s*booked"), window=500)),
    ("berlin_fri_mampe_window_before_hofladen_close",
     "Fri 6 Nov Mampe window 16:00-17:30 before the Hofladen closes at 18:00",
     near(Re(r"mampe"), on_weekday("fri", 6), hhmm("16:00"), hhmm("17:30"),
          hhmm("18:00"), Re(r"hofladen"), window=500)),
    ("berlin_fri_yorck_short_walk",
     "the confirmed 18:30 Yorckschloesschen table is a 15-20 min walk from Mampe",
     near("Yorckschlösschen", hhmm("18:30"), Re(r"15\W{0,3}20\s*min\s*walk"),
          window=420)),
    ("berlin_fri_states_no_domke_or_east_side",
     "Friday explicitly carries no Domke stop and no East Side Gallery",
     near(Re(r"friday"), Re(r"no\s*domke"), Re(r"east\s*side\s*gallery"),
          window=200)),
    ("berlin_sat_zoo_whole_day",
     "Sat 7 Nov is the zoo all day 09:00-16:30 with last admission 15:30, a proper "
     "lunch in the zoo (Waldschaenke) and houses closing at 16:00",
     near(Re(r"zoological\s*garden|berlin\s*zoo"), hhmm("09:00"), hhmm("16:30"),
          Re(r"last\s*admission\s*15:30"), Re(r"waldsch\w*nke"),
          Re(r"close\w*\s*(?:at\s*)?16[:.]00"), window=700)),
    ("berlin_sat_brlo_only_planned_dinner",
     "BRLO is the only planned Sat 7 Nov dinner/beer stop with Sat 12:00-24:00 hours, "
     "unverified availability and no reservation",
     near(Re(r"brlo"), on_weekday("sat", 7), hhmm("12:00"), hhmm("24:00"),
          Re(r"not\s*reserved|unverified"), window=520)),
    ("berlin_sat_at_most_one_optional_addon",
     "KaDeWe and C/O Berlin are optional add-ons of which at most one may be taken",
     near(Re(r"kadewe"), Re(r"c/o\s*berlin"), Re(r"at\s*most\s*one"),
          Re(r"optional"), window=520)),
    ("berlin_sun_domke_lunch_to_confirm",
     "Sun 8 Nov Domke lunch inside the verified Sun 09:00-21:00 hours, with "
     "Mettbroetchen availability unconfirmed and the phone number to call",
     near(Re(r"domke"), on_weekday("sun", 8), hhmm("09:00"), hhmm("21:00"),
          Re(r"\+49\s*30\s*291\s*76\s*35"), Re(r"unconfirmed"), window=800)),
    ("berlin_sun_east_side_in_daylight",
     "Sun 8 Nov has the East Side Gallery as a daylight stop",
     near(Re(r"east\s*side\s*gallery"), Re(r"daylight"), on_weekday("sun", 8),
          window=520)),
    ("berlin_sun_train_with_bags_by_2015",
     "the 20:52 Nightjet departs Berlin Hbf with bags there by ~20:15",
     near(Re(r"berlin\s*hbf|hauptbahnhof"), hhmm("20:15"), hhmm("20:52"),
          Re(r"bags"), window=460)),
]


@_parametrize(BERLIN_CHECKS)
def test_berlin_revised_leg(page: Page, check_id, description, matcher) -> None:
    """Berlin (3 Nov 2026 decisions): day-by-day order, honest booking state and
    the single flexible lunch/dinner/add-on options."""
    assert_match(matcher, f"Berlin {check_id}: {description}", page)


def test_berlin_luggage_storage_is_never_claimed_confirmed(page: Page) -> None:
    """No claim that Karlito accepted an early bag drop or day storage. (The
    Freiburg Airbnb's 06:35 early luggage drop *is* host-confirmed and stays.)"""
    assert page.exists, f"index.html not found at {INDEX_HTML}"
    assert near(Re(r"bag\s*drop"), Re(r"unconfirmed"), window=320).matches(page.corpus), (
        "the Thu 5 Nov bag drop must be labelled unconfirmed"
    )
    assert near(Re(r"storage"), Re(r"unconfirmed"), window=320).matches(page.corpus), (
        "the Sun 8 Nov day storage must be labelled unconfirmed"
    )
    stale = [
        "bag drop confirmed",
        "bag drop is confirmed",
        "storage is confirmed",
        "storage confirmed",
        "luggage storage is confirmed",
    ]
    found = [phrase for phrase in stale if phrase in page.corpus]
    assert not found, (
        "Berlin luggage storage must never be presented as confirmed; found: "
        + "; ".join(found)
    )
    assert "no confirmed luggage storage" in page.corpus, (
        "the Berlin leg should state plainly that no luggage storage is confirmed"
    )


def test_berlin_polish_grocery_is_pending_with_true_coordinates(page: Page) -> None:
    """The Polish-grocery priority stays visible as pending, with the corrected
    location and distance instead of the old Mampe-adjacent 550 m claim."""
    assert page.exists, f"index.html not found at {INDEX_HTML}"
    assert near(MALY_KSIAZE, Re(r"52\.488025"), Re(r"13\.407631"), Re(r"pending"),
                Re(r"1\.9\s*km"), window=800).matches(page.corpus), (
        "Maly Ksiazę must be marked pending with its true saved coordinates and "
        "the corrected ~1.9 km distance"
    )
    stale_proximity = re.findall(
        r"(?:just|only|about|approx\w*)\s*550\s*m|550\s*m\s*(?:away|from)",
        page.corpus,
    )
    assert not stale_proximity, (
        "the old '550 m from Yorckschloesschen' claim must be gone; found: "
        + "; ".join(stale_proximity)
    )


def test_berlin_removes_the_old_day_plan_wording(page: Page) -> None:
    """Stale Berlin wording from the superseded plan must not survive."""
    assert page.exists, f"index.html not found at {INDEX_HTML}"
    stale = [
        "RE8 / RB23",
        "23 Active Stops",
        "Mampe + BRLO · 5 Stops",
        "Domke Mettbrötchen + Cameras",
        "flexible Prenzlauer Berg wander",
        "11 Stops",
    ]
    found = [phrase for phrase in stale if fold(phrase) in page.corpus]
    assert not found, (
        "superseded Berlin day wording is still rendered: " + "; ".join(found)
    )


# ---------------------------------------------------------------------------
# Berlin map data: pin -> day alignment, chronological order and route links
# ---------------------------------------------------------------------------


def load_pois() -> list[dict]:
    """The rendered map's pin dataset (name, days, optional flags, images)."""
    page = load_page()
    if not page.exists:
        return []
    match = re.search(r"var POIS = (\[[\s\S]*?\n  \]);", page.source)
    assert match, "index.html must render the map pin dataset (var POIS = [...])"
    return json.loads(match.group(1))


def berlin_pins() -> list[dict]:
    return [p for p in load_pois() if p.get("region") == "region-berlin"]


def pins_on_day(day: str) -> list[dict]:
    return [p for p in berlin_pins() if day in (p.get("days") or [])]


def find_pin(fragment: str) -> dict:
    matches = [
        p for p in berlin_pins()
        if not p.get("omitted") and fragment.lower() in p["name"].lower()
    ]
    assert len(matches) == 1, (
        f"expected exactly one Berlin pin matching {fragment!r}, got "
        f"{[p['name'] for p in matches]}"
    )
    return matches[0]


BERLIN_PIN_DAYS = {
    "Zeit für Brot": ["day-05"],
    "Hackesche Höfe": ["day-05"],
    "Dead Chicken Alley": ["day-05"],
    "FOTOIMPEX": ["day-05"],
    "Markthalle Neun": ["day-05"],
    "SammyS": ["day-06"],
    "Museum Island": ["day-06"],
    "Mampe": ["day-06"],
    "Yorckschlösschen": ["day-06"],
    "Zoological Garden": ["day-07"],
    "BRLO": ["day-07"],
    "Berlin Wall Memorial": ["day-08"],
    "Mauerpark": ["day-08"],
    "Fleischerei Domke": ["day-08"],
    "East Side Gallery": ["day-08"],
    "Hauptbahnhof": ["day-08"],
}

BERLIN_OPTIONAL_PIN_NAMES = [
    "Ständige Vertretung",
    "Sophien 11",
    "Anjoy",
    "The Steak Döner",
    "CANAL",
    "KaDeWe",
    "C/O Berlin",
    "Mały Książę",
    "Silo Coffee",
    "Hamy",
    "Safelight",
    "Foto-Meyer",
    "RAW-Gelände",
    "Boxhagener Platz",
]


@pytest.mark.parametrize("fragment,days", BERLIN_PIN_DAYS.items(),
                         ids=[f.replace(" ", "-") for f in BERLIN_PIN_DAYS])
def test_berlin_pin_sits_on_the_right_day(fragment: str, days: list[str]) -> None:
    """Each scheduled Berlin place is pinned on exactly the day it is planned."""
    pin = find_pin(fragment)
    assert pin["days"] == days, (
        f"{pin['name']} must be pinned on {days}, found {pin['days']}"
    )


def test_berlin_pins_are_chronological_within_each_day() -> None:
    """The numbered pins of each day follow the written order of the day."""
    order = {
        "day-05": ["Karlito", "Zeit für Brot", "Holocaust Memorial", "Hackesche Höfe",
                   "Dead Chicken Alley", "FOTOIMPEX", "Markthalle Neun"],
        "day-06": ["Karlito", "SammyS", "Museum Island", "Mampe", "Yorckschlösschen"],
        "day-07": ["Karlito", "Zoological Garden", "BRLO"],
        "day-08": ["Karlito", "Berlin Wall Memorial", "Mauerpark", "Fleischerei Domke",
                   "East Side Gallery", "Hauptbahnhof"],
    }
    for day, fragments in order.items():
        names = [p["name"].lower() for p in pins_on_day(day)]
        positions = []
        for fragment in fragments:
            hits = [i for i, name in enumerate(names) if fragment.lower() in name]
            assert len(hits) == 1, f"{fragment!r} is not pinned exactly once on {day}"
            positions.append(hits[0])
        assert positions == sorted(positions), (
            f"{day} pins are out of chronological order: {[n['name'] for n in pins_on_day(day)]}"
        )
        assert len(names) == len(fragments), (
            f"{day} should place {len(fragments)} pins, found {len(names)}"
        )


@pytest.mark.parametrize("fragment", BERLIN_OPTIONAL_PIN_NAMES,
                         ids=[f.replace(" ", "-") for f in BERLIN_OPTIONAL_PIN_NAMES])
def test_berlin_optional_pin_never_joins_a_daily_route(fragment: str) -> None:
    """Alternatives, backups and pending places must stay out of every day
    polyline and baseline Google directions, or they would read as mandatory stops."""
    pin = find_pin(fragment)
    assert pin["days"] == [], (
        f"{pin['name']} is an alternative/backup/pending place and must not be "
        f"scheduled on a day route, found {pin['days']}"
    )


def test_berlin_map_pins_reference_only_real_images() -> None:
    """New pins must not invent or break image assets: either a real local photo
    or no photo at all."""
    assert berlin_pins(), "Berlin pins must be rendered on the map"
    for pin in berlin_pins():
        img = pin.get("img") or ""
        if not img:
            continue
        path = resolve_ref(img)
        assert path.is_file(), f"{pin['name']} references a missing image: {img}"
        assert path.stat().st_size > MIN_IMAGE_BYTES, (
            f"{pin['name']} references an unusable image: {img}"
        )


def test_berlin_saturday_routes_keep_alternatives_separate(page: Page) -> None:
    """The default Sat 7 Nov route is zoo -> BRLO. KaDeWe and C/O Berlin are
    offered only as separately labelled alternative route links."""
    assert page.exists, f"index.html not found at {INDEX_HTML}"
    baseline = re.search(r'"day-07": "(https://www\.google\.com/maps/dir/[^"]+)"',
                         page.source)
    assert baseline, "the Sat 7 Nov baseline route link must be rendered"
    url = baseline.group(1)
    assert "Zoologischer+Garten" in url and "BRLO" in url, (
        "the Sat 7 Nov baseline route must run zoo -> BRLO"
    )
    assert "KaDeWe" not in url and "C%2FO" not in url, (
        "optional Sat 7 Nov add-ons must not be baked into the baseline directions"
    )

    alt_match = re.search(r"var DAY_GMAPS_ALT = (\{[\s\S]*?\n  \});", page.source)
    assert alt_match, "index.html must render the alternative route links"
    alternatives = json.loads(alt_match.group(1))
    saturday = alternatives.get("day-07") or []
    assert len(saturday) == 2, (
        f"expected the two labelled Saturday alternatives, got {len(saturday)}"
    )
    joined = json.dumps(saturday, ensure_ascii=False).lower()
    assert "kadewe" in joined and "c/o berlin" in joined, (
        "both optional add-ons must appear in the alternative route links"
    )
    for alternative in saturday:
        label = alternative["label"].lower()
        assert "optional" in label and "at most one" in label, (
            f"alternative route link must be labelled optional: {alternative['label']}"
        )
        assert "brlo" in alternative["url"].lower(), (
            "each alternative route must still end at BRLO"
        )


def test_berlin_audit_reports_the_84_place_snapshot(page: Page) -> None:
    """The saved-list audit states the 3 Nov 2026 snapshot of 84 places and does
    not present itself as a live-updating list."""
    assert page.exists, f"index.html not found at {INDEX_HTML}"
    assert near(Re(r"\b84\b"), Re(r"saved\s*places"), Re(r"3\s*nov\s*2026"),
                Re(r"not\s*a\s*live\s*feed"), window=800).matches(page.corpus), (
        "the audit must state the 84-place, 3 Nov 2026, non-live snapshot"
    )
    assert near(Re(r"the\s*steak\s*doener"), Re(r"super\s*shawarma"),
                Re(r"stasi\s*museum"), window=400).matches(page.corpus), (
        "the three newly added Berlin pins must be acknowledged in the audit"
    )
    assert near(Re(r"\b39\b"), Re(r"berlin"), Re(r"84\s*saved\s*pins|total", ),
                window=400).matches(page.corpus) or near(
        Re(r"39\s*\+\s*20\s*\+\s*16\s*\+\s*6\s*\+\s*3\s*=\s*84"),
        window=40).matches(page.corpus), (
        "the audit must show how the 84 pins split across the regions"
    )


# ---------------------------------------------------------------------------
# Berlin follow-up audit (4 Nov 2026)
#
# The first Berlin pass left six verified defects: several pins sat at the wrong
# coordinates, the Thursday/Sunday routes hid the return legs, alternative-only
# places were undiscoverable in their day filter, the timetable omitted real
# transit/rest buffers, a few published facts were wrong (Pergamon/Panorama,
# Otto Weidt hours, Ständige hours, BRLO's menu) and the scroll-stopping "only
# reservation"/"1:1 route" claims overstated the plan. These tests pin the
# corrected, user-visible outcome.
# ---------------------------------------------------------------------------

# Coordinates taken from the user's saved Google list pins; the last four from a
# separate OpenStreetMap address check.
EVIDENCE_COORDINATES = [
    ("Markthalle Neun", 52.502135, 13.431599, "Eisenbahnstra"),
    ("SammyS", 52.5263276, 13.399265, "Sophienstra"),
    ("CANAL", 52.5252552, 13.4016845, "Sophienstra"),
    ("Steak Döner", 52.5207058, 13.4046972, "Spandauer"),
    ("C/O Berlin", 52.5066337, 13.330547, "Hardenbergstra"),
    ("Yorckschlösschen", 52.493563, 13.382109, "Yorckstra"),
    ("Sophien 11", 52.5249910, 13.4027756, "Sophienstra"),
    ("Anjoy", 52.5362432, 13.4206010, "Rykestra"),
    ("KaDeWe", 52.5015753, 13.3410035, "Tauentzienstra"),
    ("Neues Museum", 52.5201553, 13.3977381, "Bodestra"),
]


@pytest.mark.parametrize(
    "fragment,lat,lng,street",
    EVIDENCE_COORDINATES,
    ids=[item[0].replace(" ", "-").replace("/", "") for item in EVIDENCE_COORDINATES],
)
def test_berlin_evidence_coordinates(fragment, lat, lng, street) -> None:
    """Each re-checked place sits on its evidenced coordinates, and its pin
    carries the street address the marker navigates to."""
    pin = find_pin(fragment)
    assert pin["lat"] == pytest.approx(lat, abs=1e-7), (
        f"{pin['name']} latitude must be the evidenced {lat}, found {pin['lat']}"
    )
    assert pin["lng"] == pytest.approx(lng, abs=1e-7), (
        f"{pin['name']} longitude must be the evidenced {lng}, found {pin['lng']}"
    )
    assert fold(street) in fold(pin.get("addr", "")), (
        f"{pin['name']} must carry the street address ({street}); found "
        f"{pin.get('addr')!r}"
    )


def _run_pin_search_urls(pins: list[dict], tmp_path: Path) -> list[str]:
    """Execute the controller's own Google Maps search-link builder in node."""
    import shutil
    import subprocess

    source = load_page().source
    match = re.search(
        r"(function pinSearchUrl\(p\) \{[\s\S]*?)\n  // end pinSearchUrl", source
    )
    assert match, "the map must build its Google Maps search link with pinSearchUrl()"
    node = shutil.which("node")
    if not node:
        pytest.skip("node is unavailable, skipping the pin search-link check")
    script = (
        match.group(1)
        + "\nvar pins = "
        + json.dumps(pins, ensure_ascii=False)
        + ";\nconsole.log(JSON.stringify(pins.map(pinSearchUrl)));\n"
    )
    script_path = tmp_path / "pin_search.js"
    script_path.write_text(script, encoding="utf-8")
    result = subprocess.run(
        [node, str(script_path)], capture_output=True, text=True, timeout=60
    )
    assert result.returncode == 0, (
        "pinSearchUrl() must run in node: " + (result.stderr or result.stdout)
    )
    return json.loads(result.stdout)


def test_berlin_pin_search_points_at_the_address(tmp_path: Path) -> None:
    """Every popup's Google Maps link searches the street address, not the
    decorated display name ("★ #48 … (NON-NEGOTIABLE!)")."""
    from urllib.parse import unquote

    decorated = [
        find_pin("Mampe"),
        find_pin("Markthalle Neun"),
        find_pin("Yorckschlösschen"),
        find_pin("FOTOIMPEX"),
        find_pin("Domke"),
        find_pin("Mauerpark"),
        find_pin("Berlin Wall Memorial"),
        find_pin("Hauptbahnhof"),
        find_pin("Zeit für Brot"),
        find_pin("Neues Museum"),
    ]
    urls = _run_pin_search_urls(decorated, tmp_path)
    assert len(urls) == len(decorated)
    for pin, url in zip(decorated, urls):
        assert url.startswith("https://www.google.com/maps/search/?api=1&query="), url
        query = unquote(url.split("query=", 1)[1])
        street = fold(pin["addr"].split("(")[0].strip())
        first_token = street.split(",")[0].strip()
        assert first_token in fold(query), (
            f"{pin['name']} must search its street address; query was {query!r}"
        )
        for decoration in ("★", "✖", "◇", "NON-NEGOTIABLE", "CONFIRMED", "#48", "#04"):
            assert decoration.lower() not in fold(query), (
                f"{pin['name']} search query leaks display decoration "
                f"({decoration}) into the address search: {query!r}"
            )


def load_day_routes() -> dict[str, list[dict]]:
    page = load_page()
    match = re.search(r"var DAY_ROUTES = (\{[\s\S]*?\n  \});", page.source)
    assert match, "index.html must render the day route data (var DAY_ROUTES = {...})"
    return json.loads(match.group(1))


def day_baseline_url(day: str) -> str:
    page = load_page()
    match = re.search(
        r'"%s": "(https://www\.google\.com/maps/dir/[^"]+)"' % re.escape(day),
        page.source,
    )
    assert match, f"the {day} baseline Google directions link must be rendered"
    return match.group(1)


def test_berlin_thursday_timeline_has_real_buffers(page: Page) -> None:
    """Thu 5 Nov: memorial 10:15-11:45, one lunch 12:15-13:15, courtyards/alley
    plus FOTOIMPEX 13:15-15:15, then the return to Karlito and a ~2h+ rest to
    ~17:45 before dinner at ~18:30/19:00."""
    assert near(Re(r"memorial|gedenkstaette"), hhmm("10:15"), hhmm("11:45"),
                window=260).matches(page.corpus), (
        "the Thursday memorial block must be timed 10:15-11:45"
    )
    assert near(Re(r"lunch"), hhmm("12:15"), hhmm("13:15"), window=200).matches(
        page.corpus
    ), "the single Thursday lunch must be timed 12:15-13:15"
    assert near(Re(r"hackesche"), hhmm("13:15"), hhmm("14:15"), window=260).matches(
        page.corpus
    ), "the courtyard block must start after the lunch"
    assert near(Re(r"fotoimpex"), hhmm("14:45"), hhmm("15:15"), window=220).matches(
        page.corpus
    ), "FOTOIMPEX must be timed ~14:45-15:15"
    assert near(Re(r"rest"), hhmm("17:45"), Re(r"2\s*h|two\s*hours|~2h"),
                window=320).matches(page.corpus), (
        "the Thursday check-in/rest must run to ~17:45 and be a real ~2h+ rest"
    )
    assert near(Re(r"street\s*food\s*thursday"), hhmm("18:30"), window=600).matches(
        page.corpus
    ), "the Thursday dinner must be evidenced at ~18:30/19:00"


def test_berlin_thursday_route_returns_home_before_dinner() -> None:
    """FOTOIMPEX -> Karlito check-in/rest -> Markthalle must be the drawn route,
    in the baseline directions, and explained as an unnumbered return."""
    routes = load_day_routes()
    steps = routes["day-05"]
    ids = [step["id"] for step in steps]
    karlito = find_pin("Karlito")["id"]
    fotoimpex = find_pin("FOTOIMPEX")["id"]
    markthalle = find_pin("Markthalle Neun")["id"]
    assert ids.count(karlito) == 2, (
        "the Thursday route must visit Karlito twice (arrival + check-in/rest)"
    )
    first_home = ids.index(karlito)
    return_home = ids.index(karlito, first_home + 1)
    assert fotoimpex in ids[:return_home] and markthalle in ids[return_home:], (
        "the Thursday route must run FOTOIMPEX -> Karlito -> Markthalle, got "
        f"{ids}"
    )
    return_step = steps[return_home]
    assert return_step.get("kind") == "return", (
        "the repeated Karlito location must be an unnumbered return waypoint"
    )
    assert "return" in return_step["label"].lower(), return_step["label"]

    url = day_baseline_url("day-05")
    linien = url.count("Linienstra%C3%9Fe+60")
    assert linien >= 2, (
        "the Thursday baseline Google directions must include the return home, got "
        f"{url}"
    )
    assert url.index("FOTOIMPEX") < url.index("Markthalle+Neun"), (
        "the Thursday baseline directions must end at Markthalle Neun"
    )


def test_berlin_friday_transit_buffer_to_mampe(page: Page) -> None:
    """Fri 6 Nov: leave the island 15:45-16:00, 30-40 min travel, Mampe from
    ~16:15-16:40 until ~17:30 before the 18:30 table."""
    assert near(Re(r"island"), hhmm("15:45"), hhmm("16:00"), Re(r"30\W{0,3}40\s*min"),
                window=300).matches(page.corpus), (
        "Friday must allow a 15:45-16:00 island exit plus a 30-40 min ride"
    )
    assert near(Re(r"mampe"), hhmm("16:15"), hhmm("17:30"), window=260).matches(
        page.corpus
    ), "Mampe must be timed ~16:15/16:40 to ~17:30"


def test_berlin_saturday_departure_and_zoo_window(page: Page) -> None:
    """Sat 7 Nov: leave the apartment ~09:00, be in the zoo ~09:30-16:30 with
    lunch inside the zoo."""
    assert near(Re(r"karlito|apartment"), hhmm("09:00"), Re(r"leave|departure"),
                window=240).matches(page.corpus), (
        "Saturday must state the ~09:00 apartment departure"
    )
    assert near(Re(r"zoo"), hhmm("09:30"), hhmm("16:30"), window=260).matches(
        page.corpus
    ), "the Saturday zoo window must be ~09:30-16:30"
    assert near(Re(r"lunch"), Re(r"inside\s+the\s+zoo"), window=200).matches(
        page.corpus
    ), "Saturday lunch must be inside the zoo, not an extra stop"


def test_berlin_sunday_timed_sequence(page: Page) -> None:
    """Sun 8 Nov: checkout 08:00-09:00, Wall Memorial 09:20-10:15, Mauerpark
    10:30-12:15, 45-60 min to Domke, lunch 13:00-13:45, Gallery 14:00-15:30,
    early dinner/train food ~17:30, Hbf 20:15 for the 20:52 Nightjet."""
    assert near(Re(r"check\s*out|checkout"), hhmm("08:00"), hhmm("09:00"),
                window=240).matches(page.corpus), (
        "Sunday checkout must be timed 08:00-09:00"
    )
    assert near(Re(r"wall\s*memorial"), hhmm("09:20"), hhmm("10:15"), window=260).matches(
        page.corpus
    ), "the Wall Memorial block must be timed 09:20-10:15"
    assert near(Re(r"mauerpark"), hhmm("10:30"), hhmm("12:15"), window=260).matches(
        page.corpus
    ), "the Mauerpark block must be timed 10:30-12:15"
    assert near(Re(r"domke"), hhmm("13:00"), hhmm("13:45"), Re(r"45\W{0,3}60\s*min"),
                window=400).matches(page.corpus), (
        "Domke lunch must be 13:00-13:45 after a 45-60 min ride from the market"
    )
    assert near(Re(r"east\s*side\s*gallery"), hhmm("14:00"), hhmm("15:30"),
                window=260).matches(page.corpus), (
        "East Side Gallery must be timed 14:00-15:30"
    )
    assert near(Re(r"dinner|train\s*food"), hhmm("17:30"), window=200).matches(
        page.corpus
    ), "the early dinner / train food must be ~17:30"
    assert near(MUNICH_HBF, hhmm("20:15"), hhmm("20:52"), window=460).matches(
        page.corpus
    ) or near(seq("Berlin", "Hbf"), hhmm("20:15"), hhmm("20:52"),
              window=460).matches(page.corpus), (
        "the Sunday station arrival must stay 20:15 for the 20:52 departure"
    )


def test_berlin_sunday_bag_pickup_is_conditional(page: Page) -> None:
    """Gallery -> Karlito bag pickup -> Hbf only when the apartment stored the
    bags; with Hbf lockers the route skips the apartment."""
    assert near(Re(r"bag\s*pickup"), Re(r"only\s+if"), Re(r"hbf\s*lockers"),
                window=420).matches(page.corpus), (
        "the Sunday bag pickup must be stated as conditional on the apartment "
        "having stored the bags, with Hbf lockers as the alternative"
    )
    stale = [
        "back to karlito to collect the bags",
        "collect bags at karlito first",
    ]
    found = [phrase for phrase in stale if phrase in page.corpus]
    assert not found, (
        "the Sunday plan must not assume bags are stored at Karlito; found: "
        + "; ".join(found)
    )
    steps = load_day_routes()["day-08"]
    ids = [step["id"] for step in steps]
    karlito = find_pin("Karlito")["id"]
    gallery = find_pin("East Side Gallery")["id"]
    assert ids.count(karlito) == 2, "the Sunday route must show the return home"
    home = ids.index(karlito, 1)
    assert gallery in ids[:home] and ids[-1] == find_pin("Hauptbahnhof")["id"], (
        f"the Sunday route must run Gallery -> Karlito -> Hbf, got {ids}"
    )
    assert "only if" in steps[home]["label"].lower(), steps[home]["label"]


def test_berlin_old_infeasible_timings_are_gone(page: Page) -> None:
    """The superseded schedule (13:00 flea finish, 13:15 Domke, 16:00 FOTOIMPEX
    with a 17:30 departure and no rest, zoo from 09:00 with an 08:45 exit) must
    not survive anywhere."""
    stale = [
        "mauerpark flohmarkt (11:00–13:00",
        "13:15–14:30",
        "14:45–16:15",
        "fotoimpex gmbh (~16:00)",
        "08:45 departure",
        "10:00–~15:45",
        "mampe 16:00–17:30",
    ]
    found = [phrase for phrase in stale if fold(phrase) in page.corpus]
    assert not found, (
        "superseded Berlin timings are still rendered: " + "; ".join(found)
    )


def test_berlin_museum_pass_facts_and_citation(page: Page) -> None:
    """The Pergamonmuseum main building is closed; the €24 pass includes only
    the separately housed Das Panorama exhibition, not the closed building's
    collection; the pass is unbooked but not presented as something that must
    be bought on arrival."""
    assert near(Re(r"€24|24\s*(?:eur|€)"), Re(r"museum\s*island"),
                Re(r"pergamonmuseum\s+main\s+building"), Re(r"closed"),
                Re(r"panorama"), Re(r"separately\s+housed"),
                window=700).matches(page.corpus), (
        "the pass must state that the Pergamonmuseum main building is closed "
        "and that only the separately housed Das Panorama is included"
    )
    incorrect = [
        "includes the pergamonmuseum collection",
        "pass includes the pergamonmuseum",
        "covering the island museums and the pergamonmuseum collection",
        "covers the island museums and the pergamonmuseum collection",
    ]
    found = [phrase for phrase in incorrect if phrase in page.corpus]
    assert not found, (
        "the closed Pergamonmuseum main building's collection must not be "
        "described as included in the pass; found: " + "; ".join(found)
    )
    assert near(Re(r"panorama"), Re(r"separate\s+exhibition\s+venue"),
                Re(r"not\s+a\s+separate\s+paid\s+ticket"), window=320).matches(
        page.corpus
    ), (
        "Das Panorama must be described as a separate venue rather than a "
        "separate paid ticket"
    )
    assert "smb.museum/en/plan-your-visit/prices-tickets" in page.source, (
        "the museum pass claim must cite the SMB ticket page"
    )
    assert near(Re(r"special\s+exhibition"), Re(r"time\s+slot"), window=320).matches(
        page.corpus
    ), "special exhibitions may need an extra free time slot with the pass"
    assert near(Re(r"pass|ticket"), Re(r"not\s+booked"), window=260).matches(
        page.corpus
    ), "the museum pass must stay explicitly unbooked"
    stale = ["buy it on arrival", "buy on arrival", "must buy", "panorama is a separate ticket"]
    found = [phrase for phrase in stale if phrase in page.corpus]
    assert not found, (
        "the pass must not be presented as mandatory-on-arrival or Panorama as a "
        "separate ticket; found: " + "; ".join(found)
    )


def test_berlin_otto_weidt_hours_include_the_weekend(page: Page) -> None:
    """Otto Weidt is open weekdays 09:00-18:00 and weekends 10:00-18:00, cited."""
    assert near(Re(r"otto\s+weidt"), Re(r"weekdays?\s*09:00\W{0,3}18:00"),
                Re(r"weekends?\s*10:00\W{0,3}18:00"), window=360).matches(
        page.corpus
    ), "Otto Weidt hours must state weekday 09:00-18:00 and weekend 10:00-18:00"
    assert "museum-blindenwerkstatt.de/en" in page.source, (
        "the Otto Weidt hours claim must cite museum-blindenwerkstatt.de"
    )
    stale = ["weekday-only", "weekdays only"]
    found = [phrase for phrase in stale if phrase in page.corpus]
    assert not found, (
        "Otto Weidt must not be described as weekday-only; found: "
        + "; ".join(found)
    )


def test_berlin_staendige_hours_daily_until_0100(page: Page) -> None:
    """Ständige Vertretung is open daily 11:00-01:00, cited from staev.de."""
    assert near(Re(r"staendige|ständige"), Re(r"daily\s*11:00\W{0,3}01:00"),
                window=260).matches(page.corpus), (
        "Ständige Vertretung must be stated as daily 11:00-01:00"
    )
    assert "staev.de/berlin-mitte.html" in page.source, (
        "the Ständige Vertretung hours claim must cite staev.de"
    )
    pin = find_pin("Ständige Vertretung")
    assert "11:00–01:00" in pin["hours"], (
        f"the Ständige pin must carry the 11:00-01:00 hours, found {pin['hours']!r}"
    )
    assert not near(Re(r"staendige|ständige"), Re(r"daily\s*11:00\W{0,3}24:00"),
                    window=260).matches(page.corpus), (
        "the old Ständige 11:00-24:00 hours must be gone next to the Ständige "
        "references"
    )


def test_berlin_brlo_menu_is_current_and_cited(page: Page) -> None:
    """BRLO's current kitchen serves seasonal vegetable-focused shared plates;
    smokehouse plates must not be presented as the default."""
    assert near(Re(r"brlo"), Re(r"seasonal"), Re(r"vegetable"),
                Re(r"shared\s+plates"), window=420).matches(page.corpus), (
        "BRLO must be described with its current seasonal, vegetable-focused "
        "shared plates"
    )
    assert "brlo.de/gastronomien/brlo-brwhouse" in page.source, (
        "the BRLO menu claim must cite brlo.de"
    )
    assert "smokehouse plates at park" not in page.corpus and (
        "for craft beer & smokehouse plates" not in page.corpus
    ), "the superseded smokehouse-plates default is still rendered"
    assert "not the current default" in page.corpus, (
        "the plan should say the smokehouse framing is not the current default"
    )


def test_berlin_only_confirmed_restaurant_reservation(page: Page) -> None:
    """Exactly three things are confirmed in Berlin (apartment, Fri 18:30 table,
    Sun 20:52 Nightjet) and the reservation claim is scoped to restaurants."""
    assert near(Re(r"only\s+confirmed\s+berlin\s+restaurant\s+reservation"),
                window=80).matches(page.corpus) or (
        "only confirmed berlin restaurant reservation" in page.corpus
    ), "the reservation claim must be scoped to a Berlin restaurant reservation"
    stale = ["only reservation in this leg", "the only berlin reservation"]
    found = [phrase for phrase in stale if phrase in page.corpus]
    assert not found, (
        "the unscoped 'only reservation' claim must be gone; found: "
        + "; ".join(found)
    )
    assert near(Re(r"confirmed"), Re(r"karlito|5126078467"),
                Re(r"yorckschloesschen|yorckschlösschen"), hhmm("18:30"),
                Re(r"nightjet|nj\s*408"), hhmm("20:52"), window=900).matches(
        page.corpus
    ), (
        "the plan must name the three confirmed items: the apartment booking, the "
        "18:30 table and the 20:52 Nightjet"
    )


OPTIONAL_DAY_PINS = {
    "Ständige Vertretung": "day-05",
    "Sophien 11": "day-05",
    "Anjoy": "day-05",
    "Steak Döner": "day-06",
    "CANAL": "day-06",
    "KaDeWe": "day-07",
    "C/O Berlin": "day-07",
}


@pytest.mark.parametrize(
    "fragment,day",
    OPTIONAL_DAY_PINS.items(),
    ids=[name.replace(" ", "-").replace("/", "") for name in OPTIONAL_DAY_PINS],
)
def test_berlin_alternative_is_discoverable_on_its_day(fragment, day) -> None:
    """Alternative/backup places stay off the route but must be findable in the
    day's map filter and sidebar, labelled optional and individually navigable."""
    pin = find_pin(fragment)
    assert pin["days"] == [], (
        f"{pin['name']} must not be treated as a scheduled stop, found {pin['days']}"
    )
    assert pin.get("altDays") == [day], (
        f"{pin['name']} must be discoverable in the {day} filter, found "
        f"{pin.get('altDays')}"
    )
    assert pin.get("optional") is True, f"{pin['name']} must be flagged optional"
    tag = fold(pin.get("tag", ""))
    assert "optional" in tag or "backup" in tag, (
        f"{pin['name']} needs an OPTIONAL/BACKUP label, found {pin.get('tag')!r}"
    )
    assert pin.get("addr"), f"{pin['name']} needs an address for individual navigation"


def test_berlin_alternatives_never_join_a_route() -> None:
    """No optional pin appears in a drawn day route or in the day's baseline
    Google directions; the alternatives stay behind their own links."""
    routes = load_day_routes()
    optional_ids = {
        find_pin(fragment)["id"]
        for fragment in OPTIONAL_DAY_PINS
    } | {find_pin("Mały Książę")["id"]}
    for day, steps in routes.items():
        for step in steps:
            assert step["id"] not in optional_ids, (
                f"{day} route illegally includes the alternative pin {step['id']}"
            )
    for day in ("day-05", "day-06", "day-07"):
        url = day_baseline_url(day).lower()
        for unwanted in ("anjoy", "kadewe", "c%2fo", "canal", "steak", "sophien+11", "staendige", "ständige"):
            assert unwanted not in url, (
                f"the {day} baseline directions must exclude {unwanted}: {url}"
            )


def test_berlin_optional_pins_excluded_from_the_default_route_line() -> None:
    """The polyline is built from DAY_ROUTES (planned stops + returns) only, so an
    optional pin can never be interpolated into the route line."""
    source = load_page().source
    assert "var declaredRoute = isDay ? (DAY_ROUTES[filterKey] || []) : [];" in source, (
        "the map must draw the day route from the DAY_ROUTES data"
    )
    assert re.search(r"L\.polyline\(routeCoords", source), (
        "the day polyline must be built from the route waypoints, not the pin list"
    )
    assert "altDays" in source and "optional" in source, (
        "optional pins must be filtered and drawn with their own marker style"
    )


def test_berlin_day_routes_only_reference_planned_pins() -> None:
    """Day route data must reference real pins, and every pin scheduled for a day
    must appear in that day's route, in the written chronological order."""
    pois = {p["id"]: p for p in berlin_pins()}
    routes = load_day_routes()
    assert set(routes) >= {"day-05", "day-06", "day-07", "day-08"}
    for day, steps in routes.items():
        scheduled = {p["id"] for p in pins_on_day(day)}
        route_ids = [step["id"] for step in steps]
        for step in steps:
            assert step["id"] in pois, f"{day} route points at unknown pin {step['id']}"
            if step.get("kind") != "return":
                assert step["id"] in scheduled, (
                    f"{day} route includes {pois[step['id']]['name']}, which is not "
                    f"scheduled for {day}"
                )
                assert step.get("label"), "each numbered stop needs a timeline label"
        assert scheduled <= set(route_ids), (
            f"{day} route is missing scheduled pins: "
            f"{sorted(scheduled - set(route_ids))}"
        )
        assert route_ids.index(route_ids[0]) == 0


def test_berlin_saturday_has_no_route_stop_for_both_addons() -> None:
    """KaDeWe A and C/O Berlin B are mutually exclusive add-ons, shown as
    labelled alternatives with their own directions links."""
    kadewe = find_pin("KaDeWe")
    co = find_pin("C/O Berlin")
    assert kadewe.get("badge") == "A" and co.get("badge") == "B", (
        "the Saturday add-ons must be labelled A and B on the map"
    )
    page = load_page()
    assert near(Re(r"option\s*a"), Re(r"option\s*b"), Re(r"at\s*most\s*one"),
                Re(r"never\s*both"), window=700).matches(page.corpus), (
        "the timeline must say Option A and Option B are alternatives, never both"
    )
    sat = load_day_routes()["day-07"]
    assert kadewe["id"] not in [step["id"] for step in sat]
    assert co["id"] not in [step["id"] for step in sat]


def test_berlin_route_accuracy_is_not_claimed_as_1to1(page: Page) -> None:
    """The plan must not claim a 1:1/turn-by-turn route while flexible lunches and
    the rest are unpinned."""
    stale = ["1:1 map", "1:1 aligned", "100% 1:1", "1:1 route", "21 pin placements"]
    found = [phrase for phrase in stale if fold(phrase) in page.corpus]
    assert not found, (
        "the superseded 1:1 route-accuracy claim is still rendered: "
        + "; ".join(found)
    )
    assert near(Re(r"approximate"), Re(r"not\s+a\s+turn\W{0,3}by\W{0,3}turn|itinerary\s+sketch"),
                window=400).matches(page.corpus), (
        "the plan must say the timings/route are approximate rather than 1:1"
    )


def test_berlin_hamy_is_a_suggestion_not_a_saved_place(page: Page) -> None:
    """Hamy is unscheduled, only ever a Saturday idea, and not a saved Google list
    place — the plan must not deny Hamy exists either."""
    hamy = find_pin("Hamy")
    assert not hamy.get("saved"), "Hamy is a suggestion and must not be marked saved"
    assert hamy["days"] == [], "Hamy must not be scheduled on any day"
    assert near(Re(r"hamy"), Re(r"not\s+(?:one\s+of\s+)?your\s+saved\s+google\s+list|not\s+a\s+saved\s+google\s+list"),
                Re(r"saturday"), window=700).matches(page.corpus), (
        "Hamy must be explained as an unscheduled Saturday-only suggestion that is "
        "not on the saved Google list"
    )
    stale = ["no hamy on this trip", "no hamy anywhere", "not anywhere on this trip"]
    found = [phrase for phrase in stale if phrase in page.corpus]
    assert not found, (
        "the plan must not imply Hamy is missing from the whole trip; found: "
        + "; ".join(found)
    )


def test_berlin_polish_grocery_has_no_day(page: Page) -> None:
    """The Polish-grocery priority is still pending, with no invented day."""
    pin = find_pin("Mały Książę")
    assert pin["days"] == [] and not pin.get("altDays"), (
        "Mały Książę must stay unscheduled (no day, no day-filter assignment)"
    )
    assert "no day" in fold(pin.get("note", "")), (
        "the pin note must say no day has been assigned"
    )
    assert near(MALY_KSIAZE, Re(r"pending"), Re(r"no\s+assigned\s+day|no\s+day"),
                window=700).matches(page.corpus), (
        "the timeline/scorecard must carry the Polish-grocery priority as pending "
        "without assigning it a day"
    )


def test_berlin_marker_counts_are_not_brittle(page: Page) -> None:
    """The Berlin UI must not advertise brittle pin counts that the map no longer
    guarantees, while the audited 84-place snapshot stays."""
    stale = [
        "21 chronological pins",
        "21 pin placements",
        "14 optional/pending",
        "7 map pins",
        "5 map pins",
        "6 map pins",
        "3 map pins + 2 optional",
    ]
    found = [phrase for phrase in stale if fold(phrase) in page.corpus]
    assert not found, (
        "brittle Berlin marker counts are still rendered: " + "; ".join(found)
    )
    assert near(Re(r"\b84\b"), Re(r"3\s*nov\s*2026"), window=300).matches(page.corpus)


def test_berlin_records_the_media_gap(page: Page) -> None:
    """Honest REQ-09 media gap: new places may have no verified photo, and no
    browser validation is claimed until it is separately verified."""
    assert near(Re(r"no\s+verified\s+photograph|not\s+verified\s+photograph"),
                Re(r"no\s+image|no\s+photo"), window=400).matches(page.corpus), (
        "the plan must record that some re-pinned places have no verified photo "
        "and show no image instead of a stand-in"
    )
    assert berlin_pins(), "Berlin pins must still render"
    missing = [p["name"] for p in berlin_pins() if not p.get("img")]
    assert missing, (
        "at least one Berlin pin is expected to have no verified image so the gap "
        "is real and documented"
    )
