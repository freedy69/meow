console.log("hi hello");

var WAIT = (ms) => new Promise(res => setTimeout(res, ms));
var Properties = null;
var PropertiesReceived = false;
var DrawingMarkers = false;
var ClosestProperty = null;
var LastClosestProperty = null;
var NearbyDistance = 50;
var NotNearbyWaitTime = 2000;
var NearbyWaitTime = 0;
var InRange = false;
var RangeCurrentCount = 0;
var RangeMaxCount = 1;
var MarkerCurrentCount = 0;
var MarkerMaxCount = 1;
var NuiOpen = false;
var HasNuiBeenClosed = false;
var SetPauseMenuScreen = N_0x77f16b447824da6c;
var CurrentLoadingCamera = null;
var ApartmentLoadingScreenActive = false;

emitNet("Properties->RequestList");
CheckPos();

onNet("Properties->ReceiveList", (properties) => {
    if (properties != null)
    {
        Properties = properties;
        PropertiesReceived = true;
    
        console.log(`Received ${Properties.length} properties.`);

        for (property of properties)
        {
            CreatePropertyBlips(property);
            console.log("Creating blips for property ", property.name, property.id);
        }
    }
});

onNet("Properties->EnterApartmentResponse", (data) => {
    if (data[0])
    {
        console.log("server accepted enter request for ", data[1], data[2]);
        SendNuiMessage(JSON.stringify("enter-req-accepted"));
	ManageNui();
	StartApartmentLoadingScreen(ClosestProperty.cameraSettings);
    }
    else
    {
        console.log("server denied enter request for ", data[1], data[2]);
        SendNuiMessage(JSON.stringify("enter-req-denied"));
    }
})

// nui callbacks
RegisterNuiCallbackType('keyDownCloseMenu');
RegisterNuiCallbackType('apartmentMenuClick');

on("__cfx_nui:keyDownCloseMenu", (data, cb) =>
{
    console.log("nui close request");

    ManageNui();

    cb("nui closed");
});

on("__cfx_nui:apartmentMenuClick", (data, cb) => 
{
    console.log("sending request to server for apartment ", data.apartmentId, data.apartmentName);
    emitNet("Properties->EnterApartmentRequest", data.apartmentId, data.apartmentName);
    cb("got it b");
});
//

async function CheckPos()
{
    while (true)
    {        
        if (PropertiesReceived)
        {
            ClosestProperty = Properties[GetClosestPropertyIndex()]; // this returns the index of the property in the big array okokokok

            if (ClosestProperty)
            {
                LastClosestProperty = ClosestProperty;
                InRange = true;
                if (RangeCurrentCount < RangeMaxCount)
                {
                    PlayerEnteredPropertyRange(ClosestProperty);
                    RangeCurrentCount++;
                }

                if (!NuiOpen)
                {
                    DrawMarker(0, ClosestProperty.extCoords[0], ClosestProperty.extCoords[1], ClosestProperty.extCoords[2], 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 105, 136, 184, 255, true, false, 2, false, null, null, false);

                    if (ClosestProperty.garage.hasGarage)
                    {
                        DrawMarker(0, ClosestProperty.garage.extCoords[0], ClosestProperty.garage.extCoords[1], ClosestProperty.garage.extCoords[2], 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 105, 136, 184, 255, true, false, 2, false, null, null, false);
                    }
                }
                else
                {
                    HideHudAndRadarThisFrame();
                    DisableControlAction(0, 1, true); // look lr
                    DisableControlAction(0, 2, true); // look ud
                    DisableControlAction(0, 24, true); // attack
                    DisableControlAction(0, 25, true); // aim
                }

                if (IsPlayerInMarker(ClosestProperty.extCoords))
                {   
                    if (MarkerCurrentCount < MarkerMaxCount)
                    {
                        PlayerEnteredPropertyMarker(ClosestProperty);
                        MarkerCurrentCount++;
                    }
                }
                else
                {
                    if (MarkerCurrentCount == MarkerMaxCount)
                    {
                        PlayerLeftPropertyMarker(ClosestProperty);
                        MarkerCurrentCount = 0;
                    }
                }
            }
            else
            {
                InRange = false;

                if (RangeCurrentCount == RangeMaxCount)
                {
                    PlayerLeftPropertyRange(LastClosestProperty);
                    RangeCurrentCount = 0;
                    LastClosestProperty = null;
                }
            }
        }

        await WAIT(ClosestProperty ? NearbyWaitTime : NotNearbyWaitTime);
    }
}

function StartApartmentLoadingScreen(pCamSettings)
{
    if (pCamSettings)
    {
        let interval;

        CurrentLoadingCamera = CreateCam('DEFAULT_SCRIPTED_CAMERA', true);

        console.log("creating camera", CurrentLoadingCamera);
    
        interval = setInterval(() => 
        {
            if (IsCamActive(CurrentLoadingCamera))
            {
                clearInterval(interval);
		        interval = null;
            }
        }, 0);
	    
	    let animDict = 'shake_cam_all@';
	    RequestAnimDict(animDict);
	    interval = setInterval(() => 
        {
	        if (HasAnimDictLoaded(animDict))
	        {
	            clearInterval(interval);
		    interval = null;
	        }
	    }, 0);

        SetCamActive(CurrentLoadingCamera, true);
        SetCamCoord(CurrentLoadingCamera, pCamSettings.x, pCamSettings.y, pCamSettings.z);
        PointCamAtCoord(CurrentLoadingCamera, pCamSettings.x, pCamSettings.y, pCamSettings.z);
        SetCamFov(CurrentLoadingCamera, 60);
        SetCamRot(CurrentLoadingCamera, pCamSettings.rx, pCamSettings.ry, pCamSettings.rz, 2);
	    AnimatedShakeCam(CurrentLoadingCamera, animDict, 'light', '', 0.7);
	    RemoveAnimDict(animDict);
        RenderScriptCams(true, false, 0);
	    DisplayRadar(false);
	    ClearHelp(true);
	    BeginTextCommandBusyspinnerOn('mp_spinloading');
	    EndTextCommandBusyspinnerOn(1);

        console.log("camera created");

        ApartmentLoadingScreenActive = true;
    }
}

function StopApartmentLoadingScreen()
{
    SetCamActive(CurrentLoadingCamera, false);
    DestroyCam(CurrentLoadingCamera, true);
    RenderScriptCams(false, false, 500, true, true);
    DisplayRadar(true);

    CurrentLoadingCamera = null;
    ApartmentLoadingScreenActive = false;
}

function ManageNui(property)
{
    if (NuiOpen)
    {
        NuiOpen = false;
        HasNuiBeenClosed = true;
        SetNuiFocus(false, false);
    }
    else
    {
        NuiOpen = true;
        SendNuiMessage(JSON.stringify(property));
        SendNuiMessage(JSON.stringify("show"));
        SetNuiFocus(true, true);
    }
}

function PlayerEnteredPropertyMarker(property)
{
    console.log("player entered marker of ", property.name);
    ManageNui(property);
}

function PlayerLeftPropertyMarker(property)
{
    console.log("player left marker of ", property.name);
}

function PlayerEnteredPropertyRange(property)
{
    console.log("entered range of ", property.name);
    AnnounceNearbyProperty(property.name, true); 
}

function PlayerLeftPropertyRange(property)
{
    console.log("left range of ", property.name);
    AnnounceNearbyProperty(property.name, false);
    SendNuiMessage(JSON.stringify("reset-divs"));
}

function AnnounceNearbyProperty(name, entering)
{
    if (name && entering)
    {
        BeginTextCommandThefeedPost("STRING");
        AddTextComponentSubstringPlayerName(`You are near ${name}.`);
        EndTextCommandThefeedPostTicker(true, true);
    }
    else if (name && !entering)
    {
        BeginTextCommandThefeedPost("STRING");
        AddTextComponentSubstringPlayerName(`You left the area of ${name}.`);
        EndTextCommandThefeedPostTicker(true, true);
    }
}

function CreatePropertyBlips(property)
{
    AddTextEntry(property.txtEntry, property.name);
    var blip = AddBlipForCoord(property.extCoords[0], property.extCoords[1], property.extCoords[2]);
    SetBlipSprite(blip, property.blipId);
    SetBlipAsShortRange(blip, true);
    SetBlipCategory(blip, 10);
    BeginTextCommandSetBlipName(property.txtEntry);
    EndTextCommandSetBlipName(blip);    

    if (property.garage.hasGarage)
    {
        AddTextEntry(property.garage.txtEntry, property.garage.name);
        var garageBlip = AddBlipForCoord(property.garage.extCoords[0], property.garage.extCoords[1], property.garage.extCoords[2]);
        SetBlipSprite(garageBlip, property.garage.blipId);
        SetBlipAsShortRange(garageBlip, true);
        SetBlipCategory(garageBlip, 10);
        BeginTextCommandSetBlipName(property.garage.txtEntry);
        EndTextCommandSetBlipName(garageBlip);
    }
}

function GetClosestPropertyIndex()
{
    var localPos = GetEntityCoords(PlayerPedId());
    for (var i = 0; i < Properties.length; i++)
    {
        var distance = GetDistance(localPos[0], localPos[1], localPos[2], Properties[i].extCoords[0], Properties[i].extCoords[1], Properties[i].extCoords[2]);
        if (distance < NearbyDistance)
        {
            return i;
        }
    }
}

async function ShowPropertiesMenu()
{
    ActivateFrontendMenu(GetHashKey('FE_MENU_VERSION_CORONA'));
    while (!IsFrontendReadyForControl() || !IsPauseMenuActive() || IsPauseMenuRestarting())
    {
        log('waiting')
        await WAIT(100)
    }

    await WAIT(100);

    SetPauseMenuScreen(42);
    HighlightAll(true, 9);
    ShowHeadingDetails(false);
    SetHeaderTextByIndex(0, 'COMPLEXES');
    SetHeaderTextByIndex(1, 'APARTMENTS');
    SetHeaderTitle('Properties');
    ShiftCoronaDesc(true, false);
    LockHeaderMouseSupport(true, false);

    while (!IsControlJustReleased(2, 202))
    {
        await WAIT(0);
    }

    SetFrontendActive(false);
}

function AddTabItem(param0, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11) 
{
    if (BeginScaleformMovieMethodOnFrontend("SET_DATA_SLOT")) 
    {
        ScaleformMovieMethodAddParamInt(param0)
        ScaleformMovieMethodAddParamInt(param1)
        ScaleformMovieMethodAddParamInt(param2)
        ScaleformMovieMethodAddParamInt(param3)
        ScaleformMovieMethodAddParamInt(param4)
        ScaleformMovieMethodAddParamInt(param5)
        ScaleformMovieMethodAddParamInt(param6)
        ScaleformMovieMethodAddParamPlayerNameString(param7)
        ScaleformMovieMethodAddParamPlayerNameString(param8)
        ScaleformMovieMethodAddParamPlayerNameString(param9)
        ScaleformMovieMethodAddParamPlayerNameString(param10)
        ScaleformMovieMethodAddParamPlayerNameString(param11)
        ScaleformMovieMethodAddParamBool(true)
        ScaleformMovieMethodAddParamBool(true)
        EndScaleformMovieMethod()
    }
}

function SetHeaderTitle(text)
{
    if (BeginScaleformMovieMethodOnFrontendHeader('SET_HEADER_TITLE'))
    {
        ScaleformMovieMethodAddParamPlayerNameString(text)
        EndScaleformMovieMethod()
    }
}

function ShowHeadingDetails(yesNo)
{
    if (BeginScaleformMovieMethodOnFrontendHeader('SHOW_HEADING_DETAILS'))
    {
        ScaleformMovieMethodAddParamBool(yesNo)
        EndScaleformMovieMethod()
    }
}

function LockHeaderMouseSupport(bool1, bool2)
{
    if (BeginScaleformMovieMethodOnFrontendHeader('LOCK_MOUSE_SUPPORT'))
    {
        ScaleformMovieMethodAddParamBool(bool1)
        ScaleformMovieMethodAddParamBool(bool2)
        EndScaleformMovieMethod()
    }
}

function ShiftCoronaDesc(shiftDesc, hideTabs)
{
    if (BeginScaleformMovieMethodOnFrontendHeader('SHIFT_CORONA_DESC'))
    {
        ScaleformMovieMethodAddParamBool(shiftDesc)
        ScaleformMovieMethodAddParamInt(hideTabs)
        EndScaleformMovieMethod()
    }
}

function SetHeaderTextByIndex(index, text)
{
	if (BeginScaleformMovieMethodOnFrontendHeader('SET_MENU_HEADER_TEXT_BY_INDEX'))
    {
        ScaleformMovieMethodAddParamInt(index)
        ScaleformMovieMethodAddParamPlayerNameString(text)
        EndScaleformMovieMethod()
    }
}

function DisplayDataSlot(id)
{
    if (BeginScaleformMovieMethodOnFrontend('DISPLAY_DATA_SLOT'))
    {
        ScaleformMovieMethodAddParamInt(id)
        EndScaleformMovieMethod()
    }
}

function HighlightAll(disableHover, color)
{
    if (BeginScaleformMovieMethodOnFrontendHeader('SET_ALL_HIGHLIGHTS'))
    {
        ScaleformMovieMethodAddParamBool(disableHover)
        ScaleformMovieMethodAddParamInt(color)
        EndScaleformMovieMethod()
    }
}

function IsPlayerInMarker(markerCoords)
{
    var c = GetEntityCoords(PlayerPedId());
    var d = GetDistance(c[0], c[1], c[2], markerCoords[0], markerCoords[1], markerCoords[2]);

    if (d < 3)
    {
        return true;
    }
    else
    {
        return false;
    }
}

function GetDistance(x1, y1, z1, x2, y2, z2)
{
    var a = x2 - x1;
    var b = y2 - y1;
    var c = z2 - z1;

    var distance = Math.sqrt((a * a) + (b * b) + (c * c));

    return distance;
}

function log(text)
{
    console.log(text);
}

function logtime(start)
{
    if (start)
    {
        var d = Date.now();
        var res = d - start;
        return `took ${res} ms`;
    }
}

RegisterCommand('proplist', () =>
{
    ShowPropertiesMenu()
});
