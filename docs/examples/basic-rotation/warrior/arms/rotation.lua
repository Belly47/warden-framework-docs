local WGG, warden = ...

local NAMESPACE = "Warden Basic Arms"
local spells = warden.SpellHandler.Spellbooks.warrior
    and warden.SpellHandler.Spellbooks.warrior["1"]
    and warden.SpellHandler.Spellbooks.warrior["1"][NAMESPACE]

if not spells then
    error("examples/basic-rotation/warrior/arms/rotation.lua: spellbook unavailable")
end

warden:RegisterRoutine(function()
    local player = warden.UnitManager:Get("player")
    local target = warden.UnitManager:Get("target")
    if not player or player.dead or not target or not target.enemy then
        return
    end

    if warden.Config:Read("wardenBasicArms.useExecute", true) and spells.Execute:execute() then
        return true
    end

    return spells.MortalStrike:execute()
end, "WARRIOR", 1, NAMESPACE)
