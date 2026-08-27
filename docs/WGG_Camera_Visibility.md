# WGG Camera & Visibility Notes

Source: https://docs.8g90jerssb.space/system/camera-and-visibility

Fetched: 2026-05-21

## VisCheck

`WGG.VisCheck(obj1OrX, obj2OrY, z1?, x2?, y2?, z2?, flags?)`

Returns:

- `hit`: boolean
- `hitX`, `hitY`, `hitZ`: collision point coordinates

Arguments can be either object/object or coordinate form:

```lua
local hit, x, y, z = WGG.VisCheck("player", "target")
local hit = WGG.VisCheck(100, 200, 50, 150, 250, 60)
```

Default flags are `0x11` when no flags are passed.

## CameraPosition

`WGG.CameraPosition() -> x, y, z`

Returns `0` on error.

## W2S

`WGG.W2S(objOrX, y?, z?) -> ndcX, ndcY, onScreen`

The docs explicitly note that W2S returns NDC values, not UI pixels. Convert before using screen-space mouse/click math.
