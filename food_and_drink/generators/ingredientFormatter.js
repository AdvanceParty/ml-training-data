const fs = require ('fs');
const { multiplyArray } = require('../../generatorTools/util');
const ingredients = require('./ingredients');
const outputFile = '../ingredients_noun_adj.txt';

// multiply the adjectives array a few times so that we have more content to
// spread out across the generated recipes.
const adjectives = multiplyArray(require('../../generatorTools/adjectives'), 20);
const nouns = multiplyArray(require('../../generatorTools/nouns'), 45);


const nounChance = nouns.length /ingredients.length ;
const adjectiveChance = adjectives.length /ingredients.length ;
const breakChance = .6 ;
const minIngredientsPerRecipe = 3;

console.log(`nounChance: ${nounChance}`);
console.log(`adjectiveChance: ${adjectiveChance}`);

const newRecipe = () => ["INGREDIENTS"]

const getAdjective = () => {
  return (adjectives.length && Math.random() <= adjectiveChance ) ? adjectives.pop() + " " : '';
}

const getNoun = () => {
  return (nouns.length && Math.random() <= nounChance ) ? nouns.pop() : false;
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
    let recipe = acc[acc.length-1];

    let noun = getNoun();
    let adjective = getAdjective();

    if (noun) {
      if (adjective && Math.random() > .5) {
        recipe.push(adjective + noun);
        adjective = '';
      } else {
        recipe.push(noun);
      }
    } 

    recipe.push(adjective + ingredient);
    
    if (breaker.update() === 0) { acc.push(newRecipe()) }
    
    return acc;

  },[newRecipe()])

  const data = flattenRecipes(recipes);
  fs.writeFile(outputFile, data, function (err, data){
    console.log(`saved to ${outputFile}`);
  });
}

start();
