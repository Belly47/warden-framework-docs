local WGG, warden = ...

local NAMESPACE = "Warden Basic Arms"
local spells = {
    MortalStrike = warden.SpellHandler.NewSpell(12294),
    Execute = warden.SpellHandler.NewSpell(163201),
}

if not spells.MortalStrike or not spells.Execute then
    error("examples/basic-rotation/warrior/arms/spells.lua: required spell unavailable")
end

spells.Execute:callback(function(spell)
    local target = warden.UnitManager:Get("target")
    if target and target.enemy and spell:castable(target) then
        return spell:cast(target)
    end
end)

spells.MortalStrike:callback(function(spell)
    local target = warden.UnitManager:Get("target")
    if target and target.enemy and spell:castable(target) then
        return spell:cast(target)
    end
end)

warden.SpellHandler.PopulateSpellbook(spells, "WARRIOR", 1, NAMESPACE)
