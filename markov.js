const BREAK = "¬";
const LENGTH_LIMIT = 10000;

function makeMarkovTable(input, depth, delim){
	var words = input.split(delim);
	var markovTable = {};

	if(!delim){ //it looks better if you add a space when ur generating cahracter-wise
		words.push(" ");
	}
	for(i=0;i<depth;i++){
		words.push(words[i]); //add a little wrap at the end
	}

	for(i=0;i<words.length-depth;i++){
		conc="";
		for(j=0;j<depth;j++){
			conc += words[i+j] + delim; //space at the end for words
		}
		conc = conc.substring(0,conc.length-delim.length); //get rid of the last delimiter

		// if(conc.toLowerCase()){
		// 	conc = conc.toLowerCase(); //makes keys non case-sensitive for more combos
		// }

		if(markovTable[conc]){
			markovTable[conc].push(words[i+depth]); //add the following word to the array of possible words
		}
		else{
			markovTable[conc] = [words[i+depth]];
		}
	}
	return markovTable;
}

function displayTable(table){ //for debugging purposes
	var myTable= "<table><tr><td style='width: 100px; color: red;'>Key</td>";
	myTable+="<td style='width: 100px; color: red; text-align: right;'>Value</td></tr>";

	myTable+="<tr><td style='width: 100px;                   '>---------------</td>";
	myTable+="<td     style='width: 100px; text-align: right;'>---------------</td></tr>";

	var keySet = Object.keys(table);

	for (i in keySet) {
		myTable+="<tr><td style='width: 100px;'>" + keySet[i] + "</td>";
		myTable+="<td style='width: 100px; text-align: right;'>" + table[keySet[i]] + "</td></tr>";
	}  
	myTable+="</table>";

	var tablePopup = window.open("", "TableWindow", "height=500");
	tablePopup.document.write(myTable);
}

function makeText(table, length, delim){
	var keySet = Object.keys(table); //poor compatibility
	console.log(keySet);
	var fullText = wordsToMatch = keySet[Math.floor(Math.random()*keySet.length)];
	for(i=0; i<length; i++){ //this'll be off a lil
		var possibleNexts = table[wordsToMatch];//.toLowerCase];
		var nextWord = possibleNexts[Math.floor(Math.random()*possibleNexts.length)];
		console.log("next word:",nextWord);
		fullText += delim+nextWord;
		wordsToMatch += delim+nextWord;
		console.log(wordsToMatch);
		wordsToMatch = wordsToMatch.substring(wordsToMatch.indexOf(delim)+1); //remove the first thing
		console.log(wordsToMatch);
	}
	return(fullText);
}

function doSubmit(){
	var input = document.getElementById("inputText").value;

	var depth = parseInt(document.getElementById("depthLabel").value);
	var length = parseInt(document.getElementById("lengthInput").value);

	var ignoreLinebreaks = document.getElementById("ignoreLinesCheck").checked;
	var charsNotWords = document.getElementById("charRadio").checked;
	var delim = " ";
	if(charsNotWords){
		delim = "";
	}

	//no hard limit on the length but there's a warning
	if(length>LENGTH_LIMIT){
		if(!confirm("Generating anything over "+CHAR_LIMIT+" characters is gonna take a bit, are you sure?")){
			return;
		}
	}

	if(!ignoreLinebreaks){
		input = input.replace(/\n\r?/g, BREAK);
		console.log(input);
	}

	var markovTable = makeMarkovTable(input, depth, delim);
	var displayText = makeText(markovTable, length, delim);

	if(!ignoreLinebreaks){
		displayText = displayText.replace(new RegExp("\\"+BREAK, 'g'), "<br>");
	}

	console.log(displayText);
	document.getElementById("outputPane").innerHTML = displayText;

	//displayTable(markovTable);
}
