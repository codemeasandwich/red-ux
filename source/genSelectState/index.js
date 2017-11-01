
import from_function from './from_function'
import from_object from './from_object'

//=====================================================
//=================================== generat selectors
//=====================================================

function genSelectState(selectors,workers){

  if("function" === typeof selectors){
    return from_function(selectors,workers)
  } else {
    return from_object(selectors,workers)
  }

}

export default genSelectState
