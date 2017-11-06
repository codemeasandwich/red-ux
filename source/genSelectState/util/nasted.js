
import genCreateSelector from './genCreateSelector'

//=====================================================
//===================================+== process Nasted
//=====================================================

function nasted(state_selector,workers,run){

  const level = {}
  if("object" === typeof workers){

    for(const propName in workers){
      level[propName] = nasted(state_selector[propName],workers[propName],run)
    }
    return level
  } else if("function" === typeof workers){

     if(run) {
       return workers(state_selector)
    }
    
    return genCreateSelector(state_selector,workers)
  }

  throw new Error("unknow type:"+JSON.stringify(workers))
}

export default nasted
