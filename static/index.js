import axios from 'axios'

let rm = async function () {
    var routeMap = null;
    await axios
        .get("./static/routeMap.json")
        .then((res) => {
            const json = res.data;
            console.log("read static resources: ", json);
            routeMap = json ? Object.assign({}, json) : null;
            for (let key of Object.keys(routeMap)) {
                routeMap[key].sort(function (a, b) {
                    // Compare the 2 ids
                    if (a.id < b.id) return -1;
                    if (a.id > b.id) return 1;
                    return 0;
                });
            }
        })
        .catch((err) => {
            console.log("read static resource index path error:" + err);
        });
    return routeMap
}

let wp = async function () {
    var workPlace = null;
    await axios
        .get("./static/workPlace.json")
        .then((res) => {
            const json = res.data;
            console.log("read static resources: ", json);
            workPlace = json.slice();
            workPlace.sort(function (a, b) {
                // Compare the 2 ids
                if (a.id < b.id) return -1;
                if (a.id > b.id) return 1;
                return 0;
            });
        })
        .catch((err) => {
            console.log("read static resource index path error:" + err);
        });
    return workPlace;
}

const staticRes = {
    routeMap: rm,
    workPlace: wp,
}

export default staticRes