local WGG, warden = ...

local gui = warden.GuiBuilder:New()
local category = gui:Category("Warden Basic Arms")
local general = category:Tab("General")

general:Checkbox({
    text = "Use Execute",
    key = "wardenBasicArms.useExecute",
    default = true,
    tooltip = "Use Execute before Mortal Strike when available.",
})
