const fs = require ('fs');
const { multiplyArray } = require('../../generatorTools/util');
const nouns = require('../../generatorTools/nouns');
const ingredients = require('./ingredients');
const outputFile = '../ingredients_nouns_verbs.txt';

// multiply the verbs array a few times so that we have more content to
// spread out across the generated recipes.
const verbs = multiplyArray(require('../../generatorTools/verbs'), 4);


const nounChance = nouns.length /ingredients.length ;
const verbChance = verbs.length /ingredients.length ;
const breakChance = .6 ;
const minIngredientsPerRecipe = 3;

const newRecipe = () => ["INGREDIENTS"]

const getVerb = () => {
  return (verbs.length && Math.random() <= verbChance ) ? verbs.pop() + " " : '';
}

const getNoun = () => {
  return (nouns.length && Math.random() <= nounChance ) ? nouns.pop() + " " : false;
}

const breaker = { 
  update: function () {
    this._value += 1;
    if (this._value >= this._minLength && Math.random() >= this._breakChance) {
      this._value = 0;
    }
    return this._value;
  },
  init: function (breakChance, minLength) {
    this._breakChance = breakChance;
    this._minLength = minLength;
    this.resetValue();
  },
  resetValue: function () {
    this._value = 0;
  }
}


const flattenRecipes = (recipes) => {  
  const r = recipes.map(i => i.join("\n"));
  return r.join('\n\n');
}

const start = () => {
  breaker.init(breakChance, minIngredientsPerRecipe);
  recipes = ingredients.reduce((acc, ingredient) => {
    var recipe = acc[acc.length-1];
    var noun = getNoun();
    recipe.push(getVerb() + ingredient);
    if (noun) { recipe.push(noun)};
    if (breaker.update() === 0) { acc.push(newRecipe()) }
    
    return acc;

  },[newRecipe()])

  const data = flattenRecipes(recipes);
  fs.writeFile(outputFile, data, function (err, data){
    console.log("done");
  });
}

start();
