
import { createSelector } from 'reselect'

function from_object(selectors,workers){

  const selectorMapped = {}, propNames = [];

//++++++++++++++++++++++++++++ Object of state mapping
//++++++++++++++++++++++++++++++++++++++++++++++++++++

  for(const propName in selectors){
    propNames.push(propName)
    const args = selectors[propName];

    const worker = workers && workers[propName]

    if("function" === typeof args){
      if(worker){
        selectorMapped[propName] = createSelector(args,worker)
      } else {
        selectorMapped[propName] = args;
      }
    } else {// if(Array.isArray(args)){
      selectorMapped[propName] = createSelector(...args,worker)
    }
  }

  return function map_state_to_props_from_object(state, ownProps) {
    return propNames.reduce((map_props,name)=>{
      map_props[name] = selectorMapped[name](state)
      return map_props;
    },{})
  }
}

export default from_object
