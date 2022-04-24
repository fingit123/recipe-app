import React from 'react'

import './LoadingModal.css'

function LoadingModal() {
  return (
    <div className='modal'>
        <div>
            <img className='ratGif' src={'https://media2.giphy.com/media/wNDa1OZtvl6Fi/giphy.gif'} alt='' />
            <h1 className='generatingText'>Identifying Ingredients and Generating Recipes...</h1>

        </div>

    </div>
  )
}

export default LoadingModal