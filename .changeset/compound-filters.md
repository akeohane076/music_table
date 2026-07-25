---
"music-table": minor
---

Compound components. `Popover` is now generic — `<Popover><Popover.Trigger/><Popover.Content/></Popover>`
sharing open/close state via context (`usePopover`) — and the filters are thin assemblies of it
plus new reusable primitives: `Checkbox` (box+label), `RemovableTag` (×+label), and `ButtonBar`
(menu footer). The filters accept the trigger as a render-prop child (`{({count, isActive}) => …}`),
defaulting to `FilterTrigger`. Rendered output is pixel-identical. See
`docs/rfcs/0003-compound-components.md`.
