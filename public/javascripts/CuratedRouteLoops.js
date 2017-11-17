var curatedRoutes = new Array(
    "http://www.routeloops.com/?Base=42.302710000000005:-71.31709999999998&numWpts=7&wpt[0]=42.30976889999999:-71.32740760000001&wpt[1]=42.33166:-71.37959999999998&wpt[2]=42.39230999999999:-71.38096999999999&wpt[3]=42.39582:-71.29417000000001&wpt[4]=42.3766846:-71.2874243&wpt[5]=42.3356275:-71.28952070000002&wpt[6]=42.3094804:-71.30422320000002&tM=1&len=29.44&unitS=0",
    "http://www.routeloops.com/?Base=42.348918281069:-71.09723431339103&numWpts=8&wpt[0]=42.3463368:-71.10645829999999&wpt[1]=42.3471935:-71.10848570000002&wpt[2]=42.3490627:-71.11049379999997&wpt[3]=42.3469555:-71.11396150000002&wpt[4]=42.3424841:-71.11354340000003&wpt[5]=42.341137:-71.11451069999998&wpt[6]=42.3369501:-71.11608860000001&wpt[7]=42.3419515:-71.10921969999998&tM=2&len=4.50&unitS=0"
);
//..........................................................................................................
function getCurated() {
    response = new Object;
    var offerList = new Array;
    rlPoints.length = 0;
    var curateMode = parseInt(document.getElementById("CurateLimit").value);
    var curatedNearby = parseFloat(document.getElementById("curatedNearby").value)*1000;

    for(var i=0;i<curatedRoutes.length;i++) {
        response = parseURL(curatedRoutes[i]);
        //alert("Response return flag = " + response.returnStatus);
        if(response.returnStatus) {
            var useIt = false;
            if(curateMode==0)useIt=true;
            else if(curateMode==1) {
                BB = expandBoundingBox(response,curatedNearby);
                if(BB.contains(BaseLocation))useIt=true;
            }
            if(useIt) {
                //alert("Route # " + i + " is a candidate.");
                offerList.push({id:i, length:response.routeLength, units:response.Units, desc:response.description});
            }
        }
    }

    //Build up the drop down menu
    var select = document.getElementById("Curated");
    select.options.length = 0;
    var Menu = "<option value='-1' selected='selected'>Pick one</option>";
    var oOption = document.createElement("OPTION");
    oOption.text = "Pick one";
    oOption.value = -1;
    document.getElementById("Curated").add(oOption);
    for(var i=0;i<offerList.length;i++) {
        var text = offerList[i].length.toFixed(1).toString();
        if(offerList[i].units=0)text += "km";
        else text += "mi";
        brief = decodeURIComponent(offerList[i].desc);
        brief = brief.substr(0,Math.min(25,brief.length));
        text += " ..." + brief;
        Menu += "<option value=\"" + offerList[i].id + "\">Route " + offerList[i].id + " ::" + text + "</option>";

        var oOption = document.createElement("OPTION");
        oOption.text = text;
        oOption.value = offerList[i].id;
        document.getElementById("Curated").add(oOption);
    }
    //document.getElementById("Curated").innerHTML = Menu;
    return;
}
//...........................................................................................................
function expandBoundingBox(response,range) {
    var mrk;
    var mrs = new Array;
    var BBox = new google.maps.LatLngBounds();
    for(var i=0; i<response.wayPoints.length;i++) {
        BBox.extend(response.wayPoints[i]);
        //mrk = placeMarker(response.wayPoints[i],"wpt "+i);
        //mrs.push(mrk);
    }

    var rectOptions = {
        strokeColor: "#b5b5b5",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillOpacity: 0,
        bounds: BBox,
        zIndex: 10,
        map: null
    }
    var routeRectangle = new google.maps.Rectangle(rectOptions);

    var sw = BBox.getSouthWest();
    var ne = BBox.getNorthEast();
    var aveLat = (sw.lat()+ne.lat())/2;
    var aveLng = (sw.lng()+ne.lng())/2;
    var Left = new google.maps.LatLng(aveLat,sw.lng());
    var Right = new google.maps.LatLng(aveLat,ne.lng());
    var Bottom = new google.maps.LatLng(sw.lat(),aveLng);
    var Top = new google.maps.LatLng(ne.lat(),aveLng);
    var dTB = computeDistanceBetween(Bottom,Top);
    var dLR = computeDistanceBetween(Left,Right);

    var expLeft = getNewPoint(Right,Left,dLR+range);
    var expRight = getNewPoint(Left,Right,dLR+range);
    var expTop = getNewPoint(Bottom,Top,dTB+range);
    var expBottom = getNewPoint(Top,Bottom,dTB+range);

    /*
    mrk = placeMarker(expLeft,"expLeft");
    mrs.push(mrk);
    mrk = placeMarker(expRight,"expRight");
    mrs.push(mrk);
    mrk = placeMarker(expTop,"expTop");
    mrs.push(mrk);
    mrk = placeMarker(expBottom,"expBottom");
    mrs.push(mrk);
    */

    var expBBox = new google.maps.LatLngBounds();
    expBBox.extend(expLeft);
    expBBox.extend(expRight);
    expBBox.extend(expTop);
    expBBox.extend(expBottom);

    var rectOptions = {
        strokeColor: "#b5b5b5",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillOpacity: 0,
        bounds: expBBox,
        zIndex: 10,
        map: null
    }
    var expandedRectangle = new google.maps.Rectangle(rectOptions);
    /*
    alert("There they are.");
    for(var i=0;i<mrs.push;i++)mrs.setMap(null);
    mrs.length = 0;
    */
    return expBBox;
}
//...........................................................................................................
function parseURL(URL) {
    response = new Object;
    var urlInputsName = [];
    var urlInputsValue = [];
    var p1,p2,val;
    response.returnStatus = false;
    //alert("The current url is "+URL);
    var firstSplit = URL.split("?");
    //alert("At the first split we have "+firstSplit.length+" parts.");
    //for(var i=0;i<firstSplit.length;i++)alert("fS["+i+"] = "+firstSplit[i]);
    if(firstSplit.length==2) {
        var secondSplit = firstSplit[1].split("&");
        //alert("At the second split we have "+secondSplit.length+" parts.");
        for(var i=0;i<secondSplit.length;i++) {
            //alert("sS["+i+"] = "+secondSplit[i]);
            var hold = secondSplit[i].split("=");
            urlInputsName[i] = hold[0];
            urlInputsValue[i] = hold[1];
            //alert("name["+i+"] "+urlInputsName[i]+" value "+urlInputsValue[i]);
        }
        //for(var i=0;i<urlInputsName.length;i++)alert("name["+i+"] "+urlInputsName[i]+" value "+urlInputsValue[i]);
        if(urlInputsName[0]=="Base") {
            var hold = urlInputsValue[0].split(":");
            var Lat = parseFloat(hold[0]);
            var Lng = parseFloat(hold[1]);
            response.Base = new google.maps.LatLng(Lat,Lng);
        }
        else {return response;}
        if(urlInputsName[1]=="numWpts") {
            response.numWpts = parseInt(urlInputsValue[1]);
            var numWpts = response.numWpts;
        }
        else {return response;}
        var tempArray = new Array;
        for(var i=0;i<numWpts;i++) {
            if(urlInputsName[i+2]=="wpt["+i+"]") {
                var hold = urlInputsValue[i+2].split(":");
                var Lat = parseFloat(hold[0]);
                var Lng = parseFloat(hold[1]);
                tempArray.push(new google.maps.LatLng(Lat,Lng));
            } else {return response;}
        }
        response.wayPoints = tempArray;
        if(urlInputsName[numWpts+2]=="tM") {
            response.travelMode = parseInt(urlInputsValue[numWpts+2]);
        } else {return response;}
        if(urlInputsName[numWpts+3]=="len") {
            response.routeLength = parseFloat(urlInputsValue[numWpts+3]);
        } else {return response;}
        if(urlInputsName[numWpts+4]=="unitS") {
            response.Units = parseInt(urlInputsValue[numWpts+4]);
        } else {return response;}
        if(urlInputsName[numWpts+5]=="desc") {
            response.description = urlInputsValue[numWpts+5];
        } else {return response;}
        response.returnStatus = true;
        return response;
    } return response;
}
//............................................................................................................
function displayCurated() {
    var routeID = parseInt(document.getElementById("Curated").value);
    if(routeID==-1)return;
    if(routeID>curatedRoutes.length-1) {
        alert("No route with this ID.");
        return;
    }
    urlPoints.length = 0;
    var URL = curatedRoutes[routeID];
    var OK = parseURL(URL);
    if(OK) {
        //alert("This URL parsed fine.");
        response = parseUrl(URL);
        //alert("Display the route with this description  " + decodeURIComponent(response.description));
        var yes = confirm("Display the route with this description  " + decodeURIComponent(OK.description));
        if(!yes)return;
    }
    else {
        alert("Error parsing this URL");
        return;
    }
    rlPoints.length = 0;
    BaseLocation = new google.maps.LatLng(uBase.lat(),uBase.lng());
    for(var i=0;i<urlPoints.length;i++)rlPoints[i] = new google.maps.LatLng(urlPoints[i].lat(),urlPoints[i].lng());
    travelMode = utM;
    document.getElementById("travelMode").value = utM;
    if(uuS==0)
        document.getElementById("length").value = ulen;
    else if(uuS==1)
        document.getElementById("length").value = (ulen*1000*100/2.54/12/5280).toFixed(2);
    calcRoute();
    return;
}
//..................................................
function reCurate() {
    //OK, so when you enter this routine, you should have an old route (with waypoints) and a new starting point.
    //The first question is, what waypoint is this new starting point closest to?
    var dist,close;
    var iclose;
    close = LatLngDist(BaseLocation.lat(),BaseLocation.lng(),rlPoints[0].lat(),rlPoints[0].lng());
    iclose = 0;
    for(var i=1;i<rlPoints.length;i++) {
        dist = LatLngDist(BaseLocation.lat(),BaseLocation.lng(),rlPoints[i].lat(),rlPoints[i].lng());
        if(dist<close) {
            close=dist;
            iclose = i;
        }
    }
    var show = iclose+1;
    //alert("The starting point is near to waypoint # " + show);
    //This may not be good enough.  Try finding the line segment between the waypoints that this is closest to.
    var result = new Object;
    result = closestApproach(BaseLocation,rlPoints[rlPoints.length-1],rlPoints[0]);
    close = result.distance;
    iclose = 0;
    for(var i=0;i<rlPoints.length-1;i++) {
        var p1 = rlPoints[i];
        var p2 = rlPoints[i+1];
        result = closestApproach(BaseLocation,p1,p2);
        dist = result.distance;
        if(dist<close) {
            close = dist;
            iclose = i+1;
        }
    }
    var show = i+1;
    //alert("Based on line segments, the first waypoint should be # " + i);
    //Now, rotate the array around so that the iclose value is now the start of the array.
    //alert("Starting rlPoints " + rlPoints.length)
    var match = rlPoints[iclose];
    while(rlPoints[0] != match) {
        var store = rlPoints[0];
        rlPoints.shift();
        rlPoints.push(store);
    }
    //alert("Ending rlPoints " + rlPoints.length)
    //Now, reload the path with tne new starting point and the waypoints in the new order.
    calcRoute();
    return;
}
//...........................................................................................
function closestApproach(pnt,p1,p2) {
    //Make a flat earth assumption in which lng = x coordinate and lat = y coordinate
    // pnt is the point you are working with
    // p1 and p2 are the ends of the line segment
    var x1,y1,x2,y2;
    var x2p,y2p;
    var x2pr,y2pr;
    var xoff,yoff;
    var xoffp,yoffp;
    var xoffpr,yoffpr;
    var xon,yon;
    var xonp,yonp;
    var xonpr,yonpr;
    var brng;
    var radius;
    var options = new Array;
    var result = new Object;
    //Distances to each end of the current line segment.
    radius = computeDistanceBetween(p1,pnt);
    options.push({location: p1, distance: radius});
    radius = computeDistanceBetween(p2,pnt);
    options.push({location: p2, distance: radius});
    //The rest of this routine finds the point on the line that you would hit by drawing a line that intersects at a right angle.
    // First, set x1,y1 as the origin
    brng = getBearing(p1,p2);
    radius = computeDistanceBetween(p1,p2);
    x2p = radius*Math.sin(brng);
    y2p = radius*Math.cos(brng);
    //Next, rotate so that this point lies on the x axis.
    var cos = x2p/radius;
    var sin = y2p/radius;
    x2pr = x2p*cos + y2p*sin;
    y2pr = -x2p*sin + y2p*cos;
    // Now get the x, coordinates of the AP, also relative to p1.
    brng = getBearing(p1,pnt);
    var radius = computeDistanceBetween(p1,pnt);
    xoffp = radius*Math.sin(brng);
    yoffp = radius*Math.cos(brng);
    //And rotate this to be in the same coordinate system, in which the line from p1 to p2 is on the x axis.
    xoffpr = xoffp*cos + yoffp*sin;
    yoffpr = -xoffp*sin + yoffp*cos;
    //Now the point you want, at right angles to your line, is just the same x vaule, and y value of zero.
    xonpr = xoffpr;
    yonpr = 0; //you don't ever need to use this point, but here it is anyway.
    //Put the point back to the real coordinate system
    //xonpr is, already, the distance from p1 towards p2 where the intersection occurs.  So, we can just:
    var orth = getNewPoint(p1,p2,xonpr);
    radius = computeDistanceBetween(orth,pnt);
    //Don't make this one of the options unless it's actually ON the line segment you are looking at.
    var b1 = getBearing(p1,p2);
    var r1 = computeDistanceBetween(p1,p2);
    var b2 = getBearing(p1,orth);
    var r2 = computeDistanceBetween(p1,orth);
    if(b1-b2<0.2 && r2<=r1)
        options.push({location: orth, distance: radius});

    result.location = options[0].location;
    result.distance = options[0].distance;
    for(var i=1;i<options.length;i++) {
        if(options[i].distance < result.distance) {
            result.location = options[i].location;
            result.distance = options[i].distance;
        }
    } return result;
}
//.............................................................................................
function computeDistanceBetween(LL1,LL2) {
    if(!LL1 || !LL2)return -1;
    var lat1 = LL1.lat();
    var lon1 = LL1.lng();
    var lat2 = LL2.lat();
    var lon2 = LL2.lng();
    //Check the distance between these points -- returns a value in meters.
    var R = 6371; // km
    var dLat = (lat2-lat1)*Math.PI/180;
    var dLon = (lon2-lon1)*Math.PI/180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    //alert("The separation between these points is " + d);
    return d*1000;
}
//...................................................................................................
function getBearing(LL1,LL2) {
    //http://www.movable-type.co.uk/scripts/latlong.html
    var Lat1 = LL1.lat();
    var Lon1 = LL1.lng();
    var Lat2 = LL2.lat();
    var Lon2 = LL2.lng();
    var lat1 = Lat1*Math.PI/180;
    var lat2 = Lat2*Math.PI/180;
    var lon1 = Lon1*Math.PI/180;
    var lon2 = Lon2*Math.PI/180;
    var dLat = (lat2-lat1);
    var dLon = (lon2-lon1);
    //Get the bearing
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) -
        Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
    var brng = Math.atan2(y, x);
    return brng;
}
//........................................................................................
function getNewPoint(LL1,LL2,distM) {
    var Lat1 = LL1.lat();
    var Lon1 = LL1.lng();
    var Lat2 = LL2.lat();
    var Lon2 = LL2.lng();
    var lat1 = Lat1*Math.PI/180;
    var lat2 = Lat2*Math.PI/180;
    var lon1 = Lon1*Math.PI/180;
    var lon2 = Lon2*Math.PI/180;
    var dLat = (lat2-lat1);
    var dLon = (lon2-lon1);
    //Get the bearing
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) -
        Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
    var brng = Math.atan2(y, x);
    //Now get the destination, given the starting point and the bearing
    var R = 6371; // km, radius of the earth.
    var d = distM/1000;  //in km.
    var lat3 = Math.asin( Math.sin(lat1)*Math.cos(d/R) +
        Math.cos(lat1)*Math.sin(d/R)*Math.cos(brng) );
    var lon3 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(lat1),
        Math.cos(d/R)-Math.sin(lat1)*Math.sin(lat2));
    var Lat3 = lat3*180/Math.PI;
    var Lon3 = lon3*180/Math.PI;
    var newPoint = new google.maps.LatLng(Lat3,Lon3)
    return newPoint;
}
//.....................................................................
function getNewPointAlongBearing(LL,distM,brng) {
    var Lat = LL.lat();
    var Lon = LL.lng();
    var lat = Lat*Math.PI/180;
    var lon = Lon*Math.PI/180;
    var R = 6371; // km, radius of the earth.
    var d = distM/1000;  //in km.
    var lat2 = Math.asin( Math.sin(lat)*Math.cos(d/R) +
        Math.cos(lat)*Math.sin(d/R)*Math.cos(brng) );
    var lon2 = lon + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(lat),
        Math.cos(d/R)-Math.sin(lat)*Math.sin(lat2));
    var Lat2 = lat2*180/Math.PI;
    var Lon2 = lon2*180/Math.PI;
    var newPoint = new google.maps.LatLng(Lat2,Lon2);
    return newPoint;
}
//.....................................................................
function addToCurated() {
    /*
    var description = document.getElementById("tcxName").value;
    alert(description);
    */
    var yup = confirm("Confirm that this route will be added to the list of recommended routes,\n and will be available to all RouteLoops users.");
    if(!yup) {
        alert("OK, cancelling the storage.");
        return;
    }
    var description = prompt("Please enter a brief description of this route.");
    if(description.length==0) {
        alert("Route not stored without some description.");
        return;
    }
    var URIdesc = encodeURIComponent(description);
    //alert(URIdesc);
    if(!directionsDisplay.directions)return;
    if(directionsDisplay.directions.routes.length<1)return;
    var URL = storeURL();
    URL += "&desc=" + URIdesc;
    $.post("add-to-curated.php?"+URL);
    alert("Thanks!  This route has been added to the list of recommended routes.");
    return;
}
//......................................................................
function readAllCurated() {
    curatedRoutes.length = 0;
    $.ajax({
        url: "./Curated/CuratedRoutes.txt",
        cache: false,
        success: function(data){
            //alert("This is what came back. " + data);
            var point,end;
            point = data.indexOf("http");
            end = data.indexOf(",");
            while(point>=0) {
                var temp = data.slice(point,end);
                //alert(temp);
                curatedRoutes.push(temp);
                point = data.indexOf("http",end);
                end = data.indexOf(",",point);
            }
        }
    }); return;
}
