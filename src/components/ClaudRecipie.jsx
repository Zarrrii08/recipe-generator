import ReactMarkdown from 'react-markdown';

export default function IngredientList({recipes}) {
    
  return (
    <section className="ingredient-list px-[60px] bg-gray-100 rounded-md mx-auto mb-4 w-[640px] " aria-live='polite'>
          <h2 className='text-[28px] font-[1000]'>Chief Cloud Recommends: </h2>
          <ReactMarkdown>
          {recipes}  
          </ReactMarkdown>
    </section>
  );
}