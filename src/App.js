import React, { useEffect, useState } from 'react'

import logo from './logo.svg';
import './App.css';
import IngredientListItem from './IngredientListItem';
import LoadingModal from './LoadingModal';

const allIngredients = [
  {
    name: 'salmon',
    image: 'https://imagesvc.meredithcorp.io/v3/mm/image?q=60&c=sc&poi=face&w=2000&h=1000&url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F43%2F2020%2F01%2FFresh-Salmon-Fillets-by-FudioGetty-Images-2000.jpg'
  },
  {
    name: 'avocado',
    image: 'https://images.immediate.co.uk/production/volatile/sites/30/2017/01/avocado-45bccf2-scaled.jpg?quality=45&resize=504,458?quality=90&webp=true&resize=504,458'
  },
  {
    name: 'grapefruit',
    image: 'https://www.verywellhealth.com/thmb/AN4Z27FMJn5lcC421bogmAPOi0c=/2121x1414/filters:no_upscale():max_bytes(150000):strip_icc()/fresh-grapefruit-on-chopping-board-1266067263-73c505565bed40ef8524f463e4fbea5f.jpg'
  },
  {
    name: 'lemon',
    image: 'https://www.eatthis.com/wp-content/uploads/sites/4/2020/02/lemons.jpg?quality=82&strip=1'
  },

]

const allRecipes = [
  {
    name: 'salmonRecipe',
    ingredients: [
      'salmon', 'avocado', 'grapefruit', 'lemon'
    ],
    image: 'https://images.themodernproper.com/billowy-turkey/production/posts/2014/grapefruit-salmon-salad-5.jpg?w=1200&auto=compress%2Cformat&fit=crop&dm=1599770176&s=8cf90047e79301a806f8686b4ef30d05'
  },
  {
    name: 'broccoliRecipe',
    ingredients: [
      'pasta', 'broccoli', 'basil leaves', 'garlic cloves'
    ],
    image: 'https://images.themodernproper.com/billowy-turkey/production/posts/2020/Broccoli-Pesto-Pasta-7.jpg?w=1200&auto=compress%2Cformat&fit=crop&dm=1599768462&s=1f973289090d6a228c2ee4880d3dcff1'
  },
  {
    name: 'macRecipe',
    ingredients: [
      'mac', 'salt', 'parmesan', 'cheddar'
    ],
    image: 'https://images.themodernproper.com/billowy-turkey/production/posts/2020/instant-pot-mac-and-cheese-8.jpg?w=667&auto=compress%2Cformat&fit=crop&dm=1610374934&s=2870d70bc5aaf7e4173b8aad5b9c63c9'
  },
]


function App() {
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [showLoading, setShowLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [showIngredients, setShowIngredients] = useState(false)
  const [showRecipes, setShowRecipes] = useState(false)
  const [makeableRecipes, setMakeableRecipes] = useState([])
  

  const imageInputChangeHandler = (event) => {
    //I should display the image to show that you can only have one image
    let selected = event.target.files[0]
    if (selected) {
      // setImagePickerError('')
      setImagePreview(URL.createObjectURL(selected))
    }
}

  const generateRecipes = () => {
    setShowLoading(true)
    const timer = setTimeout(() => {
      //see if selected ingredients are in the recipe's ingredients.
      //for each object see if ingredients array contains 4 of the selected items
      allRecipes.forEach(recipe => {
        // console.log(recipe.ingredients)
        const canMakeRecipe = allIngredients.every(elem => recipe.ingredients.includes(elem.name))
        // console.log('can make recipe', canMakeRecipe)
        if (canMakeRecipe) {
          setMakeableRecipes([...makeableRecipes, recipe])
        }
      })
      setShowIngredients(true)
      setShowRecipes(true)
      setShowLoading(false)
    }, 3000);

    return () => clearTimeout(timer);
  }

  return (
    <div className="App">
      {showLoading &&<LoadingModal />}

      <h1 className="App-Title">Healthy Recipe Generator</h1>
      <div className="imagePreviewWrapper">
      {imagePreview &&<img src={imagePreview} className='imagePreview' alt="preview" />}
      </div>
      <input className="Choose-File" value="testing" type='file' onChange={imageInputChangeHandler}/>
      

      {imagePreview &&<div onClick={generateRecipes} className='generateButton'>Generate Recipes</div>}

      {showIngredients &&<div>
        <h1 className="subtitles">Ingredients</h1>
        <div className='ingredientsGrid'>
          {allIngredients.map((ingredient) => <IngredientListItem key={ingredient.name} parentArray={selectedIngredients} setParentArray={setSelectedIngredients} item={ingredient}/>)}
        </div>
      </div>}

      {showRecipes &&<div>
        <h1 className="subtitles">Recipes</h1>
        <div className='ingredientsGrid'>
          {makeableRecipes.map((recipe) => <IngredientListItem key={recipe.name} parentArray={makeableRecipes} setParentArray={setMakeableRecipes} item={recipe}/>)}
        </div>
      </div>}

    </div>
  );
}

export default App;
