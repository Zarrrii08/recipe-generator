import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';


export default function IngredientList(props ) {
    const ingreItems = props.Ingredients.map(ingredient => (
        <li key={ingredient}><OutdoorGrillIcon/> {ingredient}</li>
        ))
  return (
    <div className="ingredient-list">
 <div>
      <ul className='list-disc pl-[24px]'>
        <h1 style={{fontWeight:'bold'}} className='text-2xl'>Ingredients on Hand:</h1>
        {ingreItems}
      </ul>

      { props.Ingredients.length > 2 && <div className='flex mt-4 items-center justify-center gap-4 p-4' 
      style={{  background: '#f0eade' , borderRadius: '12px' }}>
        <div>
          <h2 style={{fontWeight:'bold'}}>Get Reciepe</h2>
          <p>Generate a Recipe from your list of Ingredients</p>

        </div>
        <div>
          <button onClick={props.ShowRecipe} className='rounded-md py-1 px-4 bg-black shadow-lg shadow-cyan-500/50 text-white'>Get a
            recipe</button>
        </div>
      </div>}
    </div>
    </div>
  );
}