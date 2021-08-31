console.log("hi");

var Properties =
[
    {
        id: 1,
        extCoords: [-774.02, 310.89, 85.7],
        name: "Eclipse Tower Apartments",
        cameraSettings: {
            x: -885.52, 
            y: 181.33, 
            z: 190.33, 
            rx: -10,
            ry: 0, 
            rz: -38
        },
        garage: 
        {
            hasGarage: true,
            extCoords: [-796.206, 311.314, 85.692],
            blipId: 357,
            name: "Eclipse Tower - Garage",
            txtEntry: "G_ECL_TRW",
            intCoords: [240.962, -1004.716, -99.014]
        },
        txtEntry: "ECL_TWR",
        blipId: 40,
        apartments: 
        [
            {
                id: 1,
                type: "Luxury",
                name: "Apartment 1",
                price: 1000000,
                intCoords: [-774.553, 331.621, 160]
            }
        ]
    },
    {
        id: 2,
        extCoords: [-340.36, 626.12, 171.36],
        name: "Kimble Hill Residence",
        garage:
        {
            hasGarage: true,
            extCoords: [-338.94, 630.68, 172.35],
            blipId: 357,
            name: "Kimble Hill Residence - Garage",
            txtEntry: "G_KMB_RES",
            intCoords: [211.66, -999.18, -99]
        },
        txtEntry: "KMB_RES",
        blipId: 40,
        apartments:
        [
            {
                id: 1,
                type: "Exclusive",
                name: "1378 Kimble Hill",
                price: 2500000,
                intCoords: [0, 0, 0]
            }
        ]
    },
    {
        id: 3,
        extCoords: [903.43, -615.8, 58.45],
        name: "West Mirror Estate",
        garage:
        {
            hasGarage: true,
            extCoords: [912.94, -630.5, 58.05],
            blipId: 357,
            name: "West Mirror Estate - Garage",
            txtEntry: "G_WSM_EST",
            intCoords: [211.66, -999.18, -99]
        },
        txtEntry: "WSM_EST",
        blipId: 40,
        apartments:
        [
            {
                id: 1,
                type: "Modest",
                name: "3102 West Mirror Drive",
                price: 650000,
                intCoords: [0, 0, 0]
            }
        ]
    },
    {
        id: 4,
        extCoords: [-1151.12, -913, 6.63],
        name: "Prosperity Apartment Complex",
        garage:
        {
            hasGarage: true,
            extCoords: [-1147.43, -908.9, 2.69],
            blipId: 357,
            name: "Prosperity Apts. - Garage",
            txtEntry: "G_PRS_CMP",
            intCoords: [179.03, -1000.79, -99]
        },
        txtEntry: "PRS_CMP",
        blipId: 40,
        apartments:
        [
            {
                id: 1,
                type: "Cheap",
                name: "2728 Prosperity Street",
                price: 250000,
                intCoords: [0, 0, 0]
            },
            {
                id: 2,
                type: "Cheap",
                name: "4731 Prosperity Street",
                price: 250000,
                intCoords: [0, 0, 0]
            },
            {
                id: 3,
                type: "Cheap",
                name: "1402 Prosperity Street",
                price: 250000,
                intCoords: [0, 0, 0]
            }
        ]
    },
    {
        id: 5,
        extCoords: [-970.59, -1431.46, 7.68],
        name: "La Puerta Apartments",
        garage:
        {
            hasGarage: true,
            extCoords: [-980.06, -1449.56, 4.75],
            blipId: 357,
            name: "La Puerta Apts. - Garage",
            txtEntry: "G_LPT_APT",
            intCoords: [211.66, -999.18, -99]
        },
        txtEntry: "LPT_APT",
        blipId: 40,
        apartments:
        [
            {
                id: 1,
                type: "Modest",
                name: "0045 Tug Street",
                price: 630000,
                intCoords: [0, 0, 0]
            },
            {
                id: 2,
                type: "Modest",
                name: "1702 Tug Street",
                price: 630000,
                intCoords: [0, 0, 0]
            },
            {
                id: 3,
                type: "Cheap",
                name: "8012 Tug Street",
                price: 470000,
                intCoords: [0, 0, 0]
            },
            {
                id: 4,
                type: "Cheap",
                name: "2578 Tug Street",
                price: 470000,
                intCoords: [0, 0, 0]
            }
        ]
    }
];

onNet("Properties->RequestList", () => 
{
    var _source = source;
    var _name = GetPlayerName(_source);

    console.log(`[${_source}] ${_name} requested properties, sending...`);
    emitNet("Properties->ReceiveList", _source, Properties);
});

onNet("Properties->EnterApartmentRequest", (id, name) => 
{
    var _source = source;
    var _name = GetPlayerName(_source);
    console.log(`[${_source}] ${_name} requested to enter [${id}] ${name}`);

    emitNet("Properties->EnterApartmentResponse", _source, [CanPlayerEnterApartment(), id, name]);
});

function CanPlayerEnterApartment(player, aptId)
{
    return true;
    // idk what the criteria for accepting and denying players will be yet, probably economy related
    // but for now just accept everyone lol
}
