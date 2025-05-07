import React from 'react';
import ClaudRecipie from './ClaudRecipie';
import IngredientList from './IngredientList';
import { generateRecipe } from '../ai';

const Main = () => {
const [Ingredients,setIngredients] = React.useState('');
const [shownRecipe, setShownRecipe] = React.useState('');



function handleSubmit(formData) {
const newIngred = formData.get("ingredient");
setIngredients(prevIngred => [...prevIngred, newIngred])
}
async function ShowRecipe() {
  try {
    const recipe = await generateRecipe(Ingredients);
    console.log(recipe); // Log the recipe for debugging
    setShownRecipe(recipe); // Update the state with the generated recipe
  } catch (error) {
    console.error("Error fetching recipe:", error.message);
  }
}
return (
<div className='rounded-md mx-auto my-4 py-6 grid items-center justify-center w-[640px] gap-4 bg-gray-100 shadow-lg shadow-gray-500/50'>
<section className='container my-[20px]'>

  <h1 className='text-center text-xl font-bold pb-4'>Search Ingredient</h1>
  <div
    className="main mx-auto py-6 grid items-center justify-center gap-4">
    <form className=' flex items-center justify-center gap-4' action={handleSubmit}>

      <input className='rounded-md py-1 px-4 border-[1px] w-[300px] bg-gray-100 shadow-lg shadow-cyan-500/50'
        type="text" placeholder='e.g tomato' aria-label='Add Ingredient' name='ingredient' required />
      <button type='submit' className='rounded-md py-1 px-4 bg-black shadow-lg shadow-cyan-500/50 text-white'> + Add
        Ingredient </button>

    </form>
    {Ingredients.length > 0 && <IngredientList Ingredients={Ingredients} ShowRecipe={ShowRecipe}/>}
  </div>

</section>

{ shownRecipe && <ClaudRecipie recipes = {shownRecipe} />}
</div>

)
}

export default Main