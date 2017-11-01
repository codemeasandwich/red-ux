
import genCreateSelector from './util/genCreateSelector'

function from_function(selectors,workers){

  const selectorMapped = {};//, propNames = [];

//++++++++++++++++++++++++++ function of state mapping
//++++++++++++++++++++++++++++++++++++++++++++++++++++

    return function map_state_to_props_from_function(state, ownProps) {

        const map_state_to_station_selector = selectors(state);

        if(workers){

          for(const propName in workers){
/*
            if("Object" === typeof workers[propName]){

              selectorMapped[propName] = {[propName]:nasted(workers[propName])};
              continue;

            }*/

          //  if (workers.hasOwnProperty(propName)) {
              selectorMapped[propName] = selectorMapped[propName] || genCreateSelector(map_state_to_station_selector[propName],workers[propName])

              // apply "reselect" to host logic
              workers[propName] = selectorMapped[propName]

              map_state_to_station_selector[propName] = selectorMapped[propName](map_state_to_station_selector[propName])
          //  }
          }
        }
        return map_state_to_station_selector;
      }

}

export default from_function
