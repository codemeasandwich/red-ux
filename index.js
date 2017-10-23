// red.js
import { createSelector } from 'reselect'
import equal from 'fast-deep-equal';

//=====================================================
//===================================== create selector
//=====================================================

function genCreateSelector(args,work){
  if(Array.isArray(args) && args.length === work.length && work.length > 1){
    const argsX = args.map( (x,i) => y => y[i] )
    return createSelector(...argsX,work)
  }
  return createSelector(x => x ,work)
}

//=====================================================
//=================================== generat selectors
//=====================================================

function genSelectState(selectors,workers){

  const selectorMapped = {}, propNames = [];

//++++++++++++++++++++++++++ function of state mapping
//++++++++++++++++++++++++++++++++++++++++++++++++++++

  if("function" === typeof selectors){

    return function map_state_to_props_from_function(state, ownProps) {

        const map_state_to_station_selector = selectors(state);

        if(workers){
          for(const propName in workers){
            if (workers.hasOwnProperty(propName)) {
              selectorMapped[propName] = selectorMapped[propName] || genCreateSelector(map_state_to_station_selector[propName],workers[propName])
              // apply "reselect" to host logic
              workers[propName] = (...args) => (1 === args.length) ? selectorMapped[propName](args[0]) : selectorMapped[propName](args)

              map_state_to_station_selector[propName] = selectorMapped[propName](map_state_to_station_selector[propName])
            }
          }
        }
        return map_state_to_station_selector;
      }
  } // END if

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
    } else if(Array.isArray(args)){
      selectorMapped[propName] = createSelector(...args,worker)
    } else {
      debugger;
      throw new Error("unknow type");
    }
  }

  return function map_state_to_props_from_object(state, ownProps) {
    return propNames.reduce((map_props,name)=>{
      map_props[name] = selectorMapped[name](state)
      return map_props;
    },{})
  }
}

//=====================================================
//============================================== red-ux
//=====================================================

export default {
  genSelectState,
  shouldUpdate : (a,b) => ! equal(a,b)
}
