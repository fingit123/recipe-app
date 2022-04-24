import React, { useEffect, useState } from 'react'
import './IngredientListItem.css'

function IngredientListItem({item, parentArray, setParentArray}) {
  const [itemSelected, setItemSelected] = useState(false)

  useEffect(() => {
    if (parentArray.filter(e => e.name === item.name).length > 0) {
      // setItemSelected(true)
    } else {
      // setItemSelected(false)
    }
  }, [parentArray])

  const removeItem = () => {
      setParentArray(parentArray.filter((arrayItem) => (arrayItem !== item)))
  }

  const selectItem = () => {
    if (!itemSelected) {
      console.log('item not selected')
      setParentArray([...parentArray, item])
      setItemSelected(true)
    }
    if (itemSelected) {
        console.log('item  selected')
        setParentArray(parentArray.filter((arrayItem) => (arrayItem !== item)))
        setItemSelected(false)
    }
  }

  const divStyle = {
    backgroundColor: itemSelected ? '#fbd173' : 'white',
    // borderWidth: 1;
    // borderColor: 'orange'
  };

  return (
    <div onClick={selectItem} style={divStyle} className='ingredientItemContainer'>
        <img className='image' src={item.image} alt='' />

        {item.name}
    </div>
  )
}

export default IngredientListItem