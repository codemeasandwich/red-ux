
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
              if( ! selectorMapped[propName]){
                selectorMapped[propName] = nasted(map_state[propName],workers[propName]);

                workers[propName] = (...args) => {
                  if(args.length > 1)
                      return selectorMapped[propName](...args.map(x=>args))
                  else
                      return selectorMapped[propName](args[0])
                } // END transform for wraping worker
              } // END if ! selectorMapped[propName]

              map_state[propName] = nasted( map_state[propName],selectorMapped[propName],true)
          } // END for
        }// END if workers
        return map_state;
      } // END map_state_to_props_from_function
} // END from_function

export default from_function
