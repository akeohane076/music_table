---
"music-table": minor
---

Filter configurability pass: `renderOptionLabel` / `renderSelectedLabel` render props (custom
option content while the checkbox/menuitemradio machinery stays guardrailed), a `filterOption`
predicate for custom in-menu matching, a `searchProps` slot for the inner search (its
value/onChange remain owned by the filter), `placement`/`alignment` pass-through to the
Popover, and `menuXstyle` overrides on both filters. All defaults unchanged and pixel-identical.
