import React, { useEffect, useState } from 'react'

import logo from './logo.svg';
import './App.css';
import IngredientListItem from './IngredientListItem';
import LoadingModal from './LoadingModal';

const allIngredients = [
  {
    name: 'cheese',
    image: 'https://images.heb.com/is/image/HEBGrocery/000081339?fit=constrain,1&wid=800&hei=800&fmt=jpg&qlt=85,0&resMode=sharp2&op_usm=1.75,0.3,2,0'
  },
  {
    name: 'ketchup',
    image: 'https://target.scene7.com/is/image/Target/GUEST_075ed466-052e-417f-86f5-cdbddbea5fb7?wid=488&hei=488&fmt=pjpeg'
  },
  {
    name: 'chips',
    image: 'https://target.scene7.com/is/image/Target/GUEST_8f322c63-e21c-42df-ac73-6300b6c1fb82?wid=488&hei=488&fmt=pjpeg'
  },

]

const allRecipes = [
  {
    name: 'salmonRecipe',
    ingredients: [
      'salmon', 'avacado', 'grapefruit', 'lemon'
    ]
  },
  {
    name: 'broccoliRecipe',
    ingredients: [
      'pasta', 'broccoli', 'basil leaves', 'garlic cloves'
    ]
  },
  {
    name: 'macRecipe',
    ingredients: [
      'mac', 'salt', 'parmesan', 'cheddar'
    ]
  },
]


function App() {
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [showLoading, setShowLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)

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

    //see if selected ingredients are in the recipe's ingredients.
    //for each object see if ingredients array contains 4 of the selected items
    // allRecipes.forEach(recipe => console.log(recipe.ingredients))
    // const canMakeRecipe = allIngredients.every(elem => arr2.includes(elem))
    // console.log('can make recipe')

  }

  return (
    <div className="App">
      {showLoading &&<LoadingModal />}

      <h1>Recipe Generator</h1>

      <input type='file' onChange={imageInputChangeHandler}/>
      {imagePreview &&<img src={imagePreview} className='imagePreview' alt="preview" />}

      {imagePreview &&<div onClick={generateRecipes} className='generateButton'>Generate Recipes</div>}

      <h1>Ingredients</h1>
      <div className='ingredientsGrid'>
        {allIngredients.map((ingredient) => <IngredientListItem key={ingredient.name} parentArray={selectedIngredients} setParentArray={setSelectedIngredients} item={ingredient}/>)}
      </div>

      <h1>Recipes</h1>
      <div className='ingredientsGrid'>
        {/* {allIngredients.map((ingredient) => <IngredientListItem key={ingredient.name} parentArray={selectedIngredients} setParentArray={setSelectedIngredients} item={ingredient}/>)} */}
      </div>
    </div>
  );
}

export default App;
