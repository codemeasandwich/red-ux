
import from_function from './from_function'

//=====================================================
//=================================== generat selectors
//=====================================================

function genSelectState(selectors,workers){

  if("function" === typeof selectors){
    return from_function(selectors,workers)
  } else {
  //  throw new Error("'selectors' must be a function")
      return from_function(
  (state)=> Object.keys(selectors).reduce( (output,propName) => Object.assign(output,{

    [propName] : (Array.isArray(selectors[propName])) ? selectors[propName].map( fn => fn (state) ): selectors[propName](state)

  }),{} )
  ,workers)
    //return from_object(selectors,workers)
  }

}

export default genSelectState
