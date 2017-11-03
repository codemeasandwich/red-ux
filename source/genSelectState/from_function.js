
import genCreateSelector from './util/genCreateSelector'
import nasted from './util/nasted'

//=====================================================
//======================================= from_function
//=====================================================

function from_function(selectors,workers){

  const selectorMapped = {};

//+++++++++++++++++++ map state to props from function
//++++++++++++++++++++++++++++++++++++++++++++++++++++

    return function map_state_to_props_from_function(state, ownProps) {

        const map_state = selectors(state);
        if(workers){
          for(const propName in workers){

              selectorMapped[propName] = selectorMapped[propName] || nasted(map_state[propName],workers[propName])
              // apply "reselect" to host logic
              workers[propName] = selectorMapped[propName]
              map_state[propName] = nasted( map_state[propName],workers[propName],true)
          }
        }
        return map_state;
      }
}

export default from_function
