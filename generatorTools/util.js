const shuffle = function (array) {
	var currentIndex = array.length;
	var temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
};

const multiplyArray = (sourceArray, mfactor, shuffleResult = true) => {
	const m = parseInt(mfactor);
	let multiplied = [...sourceArray];
	for (var i=1; i< mfactor; i++) {
		multiplied = [...multiplied, ...sourceArray];
	};
	return shuffleResult ? shuffle(multiplied) : multiplied;
}

module.exports.shuffle = shuffle;
module.exports.multiplyArray = multiplyArray;

