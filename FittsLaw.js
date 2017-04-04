/**
 * Created by Sri on 4/4/2017.
 */
var currentCircle = 0;
var circleIds = [1,2,3,4,5,6,7,8,9];
var dist = 0;
var mt = [];
var currentTimeStamp;
var nextTimeStamp;
var extraFlag = 0;
var expData = [['A','W','ID','MT','IP']];
function changeRadius(radius){
    console.log(radius);
    console.log(document.querySelector('input[name="distance"]:checked').value);
    var dist = document.querySelector('input[name="distance"]:checked').value;
    var otherDist = [120,210,300];
    for (var j=0;j<otherDist.length;j++){
        var element=document.getElementById(otherDist[j]+'D');
        if ((dist + 'D') == (otherDist[j] + 'D')) {
            element.style.display = 'inline';
        } else {
            element.style.display = 'none';
        }
        console.log('Done hiding');
    }
    for (var i=1;i<10;i++){
        var element=document.getElementById((dist+'D'+i));
        element.setAttribute('r',(radius/2));
    }
}


function changeDist(dist){
    console.log(dist);
    /*
     Hide everything except the selected distance.
     */
    var otherDist = [120,210,300];
    for (var j=0;j<otherDist.length;j++){
        var element=document.getElementById(otherDist[j]+'D');
        if ((dist + 'D') == (otherDist[j] + 'D')) {
            element.style.display = 'inline';
        } else {
            element.style.display = 'none';
        }
        console.log('Done hiding');
    }

    /*
     Check for radius value and change accordingly.
     */
    var radius = document.querySelector('input[name="targetWidth"]:checked').value;
    console.log(radius);
    for (var i=1;i<10;i++){
        var element=document.getElementById((dist+'D'+i));
        element.setAttribute('r',(radius/2));
    }
}

function startProcess(buttonValue){
    if (buttonValue== 'Stop Recording'){
        document.getElementById('StartButton').innerHTML = 'Start Recording Data';
        document.getElementById('StartButton').value = 'Start Recording';
        mt=[];
        extraFlag=0;
        circleIds=[1,2,3,4,5,6,7,8,9];
        currentCircle=0;
        dist = document.querySelector('input[name="distance"]:checked').value;
        for (var i=1;i<10;i++){
            var element = document.getElementById(dist+'D'+i);
            console.log(element);
            element.classList.remove('target');
        }
        document.getElementById('ExportData').style.visibility='visible';
    }else if (buttonValue == 'Start Recording'){
        mt=[];
        extraFlag=0;
        dist = document.querySelector('input[name="distance"]:checked').value;
        console.log(dist);
        circleIds=[1,2,3,4,5,6,7,8,9];
        currentCircle=0;
        document.getElementById('StartButton').innerHTML = 'Stop Recording Data';
        document.getElementById('StartButton').value = 'Stop Recording';
        document.getElementById('ExportData').style.visibility = 'hidden';
        generateNextCircle();
    }

}

function generateNextCircle(){
    if (circleIds.length!=1){
        var randomI = getRandomInt(1,9);
        while (circleIds.indexOf(randomI) == (-1)){
            randomI = getRandomInt(1,9);
        }
    }else if (circleIds.length == 1){
        randomI=circleIds[0];
    }else{
        ;
    }
    console.log(randomI);
    currentCircle = dist+'D'+randomI;
    var element=document.getElementById(dist+'D'+(randomI));
    console.log(element);
    element.classList.add('target');
    currentTimeStamp = Date.now();

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


function clickedCircle(id){
    console.log(id);
    if (id == currentCircle){
        nextTimeStamp = Date.now();
        mt.push(nextTimeStamp-currentTimeStamp);
        var indexOfI = circleIds.indexOf(parseInt(id.substr(id.length-1)));
        circleIds.splice(indexOfI,1);
        console.log(circleIds);
        var element = document.getElementById(id);
        element.classList.remove('target');
        if (circleIds.length != 0){
            if (circleIds.length == 2){
                console.log('Pre Extra item time');
                if (extraFlag == 0){
                    console.log('Extra item time');
                    if (parseInt(id.substr(id.length-1)) == 0){
                        circleIds.push(parseInt(id.substr(id.length-1))+1);
                    } else if (parseInt(id.substr(id.length-1)) == 9){
                        circleIds.push(parseInt(id.substr(id.length-1))-1);
                    } else {
                        circleIds.push(3);
                    }
                }
                extraFlag = 1;
            }
            generateNextCircle();
        }else {
            var radiusExp = document.getElementById(id).getAttribute('r');
            for (var i=0;i<mt.length;i++){
                if (mt[i]>2500){
                    alert('Please start the experiment again. One or more of the movement times recorded has been irregular.');
                    mt=[];
                    console.log(mt);
                    break;
                }
            }
            if (mt.length != 0){
                var mtSum=0
                for (var i=0;i<mt.length;i++){
                    mtSum += mt[i];
                }
                var avgMt = mtSum/(mt.length);
                var ID = Math.log2((parseInt(dist)/(radiusExp*2))+1);
                var IP = (ID/avgMt);
                console.log("All done! The movement timings for distance of",dist," and width of ",(radiusExp*2)," are: ",avgMt,'|',ID,'|',IP);
                var expDataTemp = [parseInt((dist)),(radiusExp*2),ID,avgMt,IP];
                expData.push(expDataTemp);
            }
            document.getElementById('StartButton').innerHTML = 'Start Recording Data';
            document.getElementById('StartButton').value = 'Start Recording';
            document.getElementById('ExportData').style.visibility = 'visible';
        }
    }else{
        console.log('clicked'+id);
    }
}

function exportData(){
    var csv="";
    expData.forEach(function(row) {
        csv += row.join(',');
        csv += "\n";
    });

    console.log(csv);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'ExperimentData.csv';
    hiddenElement.click();
}
