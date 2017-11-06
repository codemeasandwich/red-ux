
//import { createSelector } from 'reselect'

//import genCreateSelector from './util/genCreateSelector'
import nasted from './util/nasted'

//=====================================================
//========================================= from_object
//=====================================================

function from_object(selectors,workers){

  const selectorMapped = {}, propNames = [];

//++++++++++++++++++++++++++++ Object of state mapping
//++++++++++++++++++++++++++++++++++++++++++++++++++++

for(const propName in selectors){

/*
  if(!worker){
      selectorMapped[propName] = ("function" === typeof selectors[propName]) ? selectors[propName] : x => x
      continue;
  }
*/
  propNames.push(propName)
  const args = selectors[propName];

//  if(!workers)
//    console.log(propName,workers,new Error())

  const worker = workers && workers[propName]

  if("function" === typeof args){
    if(worker){
      selectorMapped[propName] = nasted(args,worker)
      workers[propName] = selectorMapped[propName]
    } else {
      selectorMapped[propName] = args;
    }
  } else {
    selectorMapped[propName] = nasted(args,worker);
  }
}

//+++++++++++++++++++++ map state to props from object
//++++++++++++++++++++++++++++++++++++++++++++++++++++

return function map_state_to_props_from_object(state, ownProps) {

  return propNames.reduce((map_props,name)=>{
 /* console.log(name)
    console.log(state)
    console.log(workers)
    console.log(selectorMapped[name]) */
    map_props[name] = selectorMapped[name](state)
    return map_props;
  },{})
}
}

export default from_object
